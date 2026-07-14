import React from 'react';
import { supabase } from '../services/supabaseClient';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { AlertCircle, CheckCircle2, Lock, Mail } from 'lucide-react';

const Login = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [mode, setMode] = React.useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const switchMode = (nextMode: 'signIn' | 'signUp') => {
    setMode(nextMode);
    setError(null);
    setMessage(null);
    setPassword('');
    setConfirmPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      if (data.session) {
        // Email confirmation is disabled, user is already signed in.
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setMessage('Account created! Check your email to confirm your address before signing in.');
        switchMode('signIn');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isSignUp = mode === 'signUp';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-mrf-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-500">
            {isSignUp ? 'Sign up for a new MRF account' : 'Log in to your MRF account'}
          </p>
        </div>

        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <Input
                type="email"
                placeholder="you@company.com"
                className="pl-10"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <Input
                type="password"
                placeholder="••••••••"
                className="pl-10"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {isSignUp && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {message && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              {message}
            </div>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-sm text-mrf-primary font-medium hover:underline"
            onClick={() => switchMode(isSignUp ? 'signIn' : 'signUp')}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
