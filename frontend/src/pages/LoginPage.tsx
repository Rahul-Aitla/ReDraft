import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { login as loginApi } from '../api/auth';
import { useQueryClient } from '@tanstack/react-query';
import Logo from '../components/Logo';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { token, user } = await loginApi({ email, password });
      queryClient.clear();
      login(token, user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center font-hanken text-on-surface bg-background">
      {/* Focused View Header */}
      <nav className="fixed top-0 left-0 right-0 p-md flex items-center">
        <Link to="/blog" className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors duration-200">
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="text-[13px] font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </nav>

      <div className="relative flex h-auto w-full max-w-[480px] flex-col bg-surface-container-lowest shadow-[0_40px_100px_-20px_rgba(0,32,69,0.02)] border border-outline-variant rounded-xl p-lg md:p-xl overflow-hidden">
        {/* Brand Identity Section */}
        <div className="flex flex-col items-center gap-md mb-lg">
          <div className="text-primary">
            <Logo className="size-10" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-on-surface mb-xs">Welcome back</h1>
            <p className="text-on-surface-variant text-sm">Resume your drafting journey</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <div className="flex flex-col gap-[4px]">
            <label className="text-[13px] font-semibold text-on-surface-variant uppercase tracking-wider" htmlFor="email">Email</label>
            <input 
              className="h-12 w-full rounded border border-outline-variant bg-surface px-md font-hanken text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/40" 
              id="email" 
              placeholder="Enter your email" 
              required 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-[4px]">
            <div className="flex justify-between items-center">
              <label className="text-[13px] font-semibold text-on-surface-variant uppercase tracking-wider" htmlFor="password">Password</label>
              <Link to="#" className="text-[13px] font-semibold text-primary hover:underline">Forgot?</Link>
            </div>
            <div className="relative flex items-center">
              <input 
                className="h-12 w-full rounded border border-outline-variant bg-surface pl-md pr-xl font-hanken text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/40" 
                id="password" 
                placeholder="Enter your password" 
                required 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div 
                className="absolute right-md text-on-surface-variant cursor-pointer hover:text-primary transition-colors" 
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-error text-sm mt-2 p-3 bg-error-container border border-error/10 rounded">
              {error}
            </div>
          )}

          <div className="flex items-center gap-xs mt-xs">
            <input className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" id="remember" type="checkbox" />
            <label className="text-[13px] font-semibold text-on-surface-variant select-none" htmlFor="remember">Remember this device</label>
          </div>

          <button 
            className="mt-sm flex h-12 w-full items-center justify-center rounded bg-primary text-on-primary font-hanken font-bold tracking-wide hover:bg-primary-container transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : (
              'Log in'
            )}
          </button>
        </form>

        {/* Signup Redirect */}
        <div className="mt-lg border-t border-outline-variant pt-md text-center">
          <p className="text-sm text-on-surface-variant">
            Don't have an account? 
            <Link className="font-bold text-primary hover:underline ml-xs" to="/register">Create account</Link>
          </p>
        </div>

        {/* Editorial Atmosphere */}
        <div className="mt-xl text-center opacity-40">
          <span className="font-mono uppercase tracking-widest text-[10px]">Version 2.4.0 • Permanent Ink</span>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="fixed bottom-0 right-0 p-lg pointer-events-none select-none">
        <p className="font-serif italic text-on-surface-variant/5 text-[120px] leading-none text-right">
          draft.<br/>revise.<br/>perfect.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
