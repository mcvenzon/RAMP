import type { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { isSupabaseConfigured, supabase } from '../services/supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

export type UserRole = 'MANAGER' | 'BUYER' | 'COLLECTOR';

function parseRole(value: unknown): UserRole | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toUpperCase();
  return normalized === 'MANAGER' || normalized === 'BUYER' || normalized === 'COLLECTOR' ? normalized : null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let roleRequest = 0;
    if (!isSupabaseConfigured) { setLoading(false); return; }
    const applySession = (nextSession: Session | null) => {
      const request = ++roleRequest;
      const nextUser = nextSession?.user ?? null;
      setSession(nextSession);
      setUser(nextUser);
      setRole(parseRole(nextUser?.app_metadata?.role));
      if (!nextUser) { setLoading(false); return; }
      void supabase.from('profiles').select('role').eq('id', nextUser.id).maybeSingle().then(({ data, error }) => {
        if (!mounted || request !== roleRequest) return;
        if (!error && data) setRole(parseRole(data.role) ?? parseRole(nextUser.app_metadata?.role));
        setLoading(false);
      }, () => { if (mounted && request === roleRequest) setLoading(false); });
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      window.setTimeout(() => { if (mounted) applySession(nextSession); }, 0);
    });
    supabase.auth.getSession().then(({ data }) => { if (mounted) applySession(data.session); }).catch(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) return { error: new Error('Supabase is not configured.') };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };
  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) return { error: new Error('Supabase is not configured.') };
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    return { error };
  };
  const signOut = async () => { if (isSupabaseConfigured) await supabase.auth.signOut(); };

  return <AuthContext.Provider value={{ user, session, role, loading, configured: isSupabaseConfigured, signIn, signInWithGoogle, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
