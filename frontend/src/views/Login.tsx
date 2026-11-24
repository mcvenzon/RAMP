import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Recycle, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps { onPreviewDemo?: () => void; }

export default function Login({ onPreviewDemo }: LoginProps) {
  const { signIn, signInWithGoogle, configured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(''); setLoading(true);
    try { const result = await signIn(email.trim(), password); if (result.error) setError(result.error.message === 'Invalid login credentials' ? 'Email or password doesn’t match. Please try again.' : result.error.message); }
    catch { setError('We couldn’t reach the sign-in service. Check your connection and try again.'); }
    finally { setLoading(false); }
  };

  const continueWithGoogle = async () => {
    setError(''); setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.error) { setError(result.error.message); setGoogleLoading(false); }
    } catch {
      setError('We couldn’t start Google sign-in. Check your connection and try again.');
      setGoogleLoading(false);
    }
  };

  return <main className="login-page">
    <section className="login-story"><div className="login-brand"><span className="brand-mark"><Recycle size={21} /></span><span><strong>RAMP</strong><small>RESOURCE ASSET MANAGEMENT</small></span></div><div className="story-content"><span className="story-pill"><Sparkles size={13} /> CIRCULAR ECONOMY INFRASTRUCTURE</span><h1>Materials have<br /><em>more than one life.</em></h1><p>Connect recovery facilities, trusted buyers, and the data that moves materials forward.</p><div className="story-art" aria-hidden="true"><div className="art-sun" /><div className="art-plant plant-a"><i /><i /><i /></div><div className="art-plant plant-b"><i /><i /><i /></div><div className="art-bin bin-one"><span /></div><div className="art-bin bin-two"><span /></div><div className="art-loop"><Recycle size={42} /></div><div className="art-floor" /></div><div className="story-trust"><span><ShieldCheck size={15} /> Verified material network</span><i /><span>Designed for MRF teams</span></div></div><div className="story-foot"><span>RAMP · Resource Asset Management Platform</span><span>© 2026 RAMP</span></div></section>
    <section className="login-panel"><div className="login-panel-inner"><div className="mobile-login-brand"><span className="brand-mark"><Recycle size={20} /></span><strong>RAMP</strong></div><div className="login-heading"><div className="login-lock"><LockKeyhole size={19} /></div><span className="eyebrow">SECURE FACILITY ACCESS</span><h2>Welcome back</h2><p>Sign in to your RAMP workspace to continue.</p></div>
      {!configured && <div className="config-alert"><span className="config-alert-dot" /><div><strong>Connect your Supabase project</strong><p>Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to <code>frontend/.env</code> to enable sign-in.</p></div></div>}
      <form className="login-form" onSubmit={submit}><label className="form-field"><span>Email address</span><div className="login-input"><Mail size={17} /><input autoComplete="email" type="email" required placeholder="name@company.com" value={email} onChange={(event) => setEmail(event.target.value)} /></div></label><label className="form-field"><span>Password <button className="forgot-button" type="button" onClick={() => setError('Password recovery is managed through your Supabase project.')}>Forgot password?</button></span><div className="login-input"><LockKeyhole size={17} /><input autoComplete="current-password" type={showPassword ? 'text' : 'password'} required placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
        {error && <div className="login-error" role="alert">{error}</div>}
        <button type="submit" className="button button-primary login-submit" disabled={loading || googleLoading || !configured}>{loading ? 'Signing in…' : 'Sign in to RAMP'}{!loading && <ArrowRight size={17} />}</button>
        {!configured && import.meta.env.DEV && onPreviewDemo && <button type="button" className="demo-preview-button" onClick={onPreviewDemo}>Explore the demo workspace <ArrowRight size={15} /></button>}
      </form>
      <div className="login-or"><span />or<span /></div>
      <button type="button" className="google-signin-button" onClick={() => void continueWithGoogle()} disabled={!configured || loading || googleLoading}>
        <GoogleMark />{googleLoading ? 'Connecting to Google…' : 'Continue with Google'}
      </button>
      <div className="login-footnote"><LockKeyhole size={14} /><span>Your account is protected with encrypted authentication.</span></div><div className="login-market-pulse"><span className="eyebrow">TODAY’S MARKET PULSE</span><span><i>PET</i> <strong>+2.4%</strong></span><span><i>ALU</i> <strong>+1.1%</strong></span><span><i>OCC</i> <strong>+0.6%</strong></span></div><div className="login-legal"><span>© 2026 RAMP · Recyclable Asset Management Platform</span><button type="button" onClick={() => setError('For access, contact your RAMP workspace administrator.')}>Request access</button></div></div></section>
  </main>;
}

function GoogleMark() {
  return <svg aria-hidden="true" viewBox="0 0 48 48" className="google-mark"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.91c-.58 2.96-2.27 5.47-4.79 7.16l7.73 6C44.36 38.13 46.98 31.96 46.98 24.55Z"/><path fill="#FBBC05" d="M10.53 28.59A14.45 14.45 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.92 23.92 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.97-6.19Z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.82l-7.73-6c-2.14 1.44-4.89 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"/></svg>;
}
