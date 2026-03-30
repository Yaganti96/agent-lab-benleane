import { useState } from 'react';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('alex.johnson@acme.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    onLogin(email, password);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-portal-bg p-4">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-portal-primary mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-portal-fg">Acme HR Portal</h1>
          <p className="text-sm text-portal-muted mt-1">Your employee self-service centre</p>
        </div>

        {/* Card */}
        <div className="bg-portal-surface rounded-2xl shadow-xl p-8 border border-portal-border">
          <h2 className="text-lg font-semibold text-portal-fg mb-6">Sign in</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-portal-fg mb-1.5" htmlFor="email">
                Work email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-portal-border bg-portal-input text-portal-fg placeholder-portal-muted text-sm focus:outline-none focus:ring-2 focus:ring-portal-primary/50 focus:border-portal-primary transition"
                placeholder="you@acme.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-portal-fg mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-portal-border bg-portal-input text-portal-fg placeholder-portal-muted text-sm focus:outline-none focus:ring-2 focus:ring-portal-primary/50 focus:border-portal-primary transition"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-portal-primary hover:bg-portal-primary-hover text-white font-semibold py-2.5 rounded-lg text-sm transition-colors shadow-sm"
            >
              Sign in
            </button>
          </form>

          <p className="text-xs text-portal-muted text-center mt-4">
            Demo: use any password with the pre-filled email
          </p>
        </div>
      </div>
    </div>
  );
}
