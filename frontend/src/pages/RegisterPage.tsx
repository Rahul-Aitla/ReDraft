import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { register as registerApi } from '../api/auth';
import Logo from '../components/Logo';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { token, user } = await registerApi({ name, email, password });
      login(token, user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-hanken">
      {/* Minimal Header for Focused View */}
      <nav className="w-full px-md py-sm flex justify-between items-center bg-transparent max-w-7xl mx-auto">
        <Link className="flex items-center gap-2 group cursor-pointer" to="/blog">
          <Logo className="text-primary w-8 h-8" />
          <span className="font-bold text-primary tracking-tight text-lg">ReDraft</span>
        </Link>
        <Link className="text-on-surface-variant font-medium hover:text-primary transition-colors flex items-center gap-1" to="/login">
          Sign in <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </nav>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-md">
        <div className="w-full max-w-[480px] space-y-8 sm:space-y-lg animate-in fade-in duration-700 slide-in-from-bottom-4">
          <div className="text-center space-y-2 sm:space-y-xs">
            <h1 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold leading-tight sm:leading-[56px] tracking-[-0.02em] text-primary">Join the craft</h1>
            <p className="text-on-surface-variant text-sm sm:text-base max-w-sm mx-auto">Start drafting professionally with version-controlled precision and absolute focus.</p>
          </div>

          <div className="bg-surface-container-lowest shadow-[0_4px_40px_-10px_rgba(0,32,69,0.05)] rounded-xl p-6 sm:p-lg border border-outline-variant/30">
            <form onSubmit={handleSubmit} className="space-y-md">
              {/* Full Name Input */}
              <div className="space-y-[4px]">
                <label className="block text-[13px] font-semibold text-on-surface-variant uppercase tracking-wider" htmlFor="full-name">Full Name</label>
                <div className="relative">
                  <input 
                    className="w-full bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-0 rounded-lg p-sm transition-all placeholder:text-outline outline-none" 
                    id="full-name" 
                    placeholder="Alexander Hamilton" 
                    required 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-outline">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-[4px]">
                <label className="block text-[13px] font-semibold text-on-surface-variant uppercase tracking-wider" htmlFor="email">Email Address</label>
                <div className="relative">
                  <input 
                    className="w-full bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-0 rounded-lg p-sm transition-all placeholder:text-outline outline-none" 
                    id="email" 
                    placeholder="alex@redraft.com" 
                    required 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-outline">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-[4px]">
                <label className="block text-[13px] font-semibold text-on-surface-variant uppercase tracking-wider" htmlFor="password">Password</label>
                <div className="relative flex items-stretch">
                  <input 
                    className="w-full bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-0 rounded-lg p-sm transition-all placeholder:text-outline outline-none" 
                    id="password" 
                    placeholder="Min. 8 characters" 
                    required 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-error text-sm mt-2 p-3 bg-error-container border border-error/10 rounded">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button 
                className="w-full bg-primary text-on-primary font-bold py-md rounded-lg hover:bg-primary-container transition-all active:scale-[0.98] shadow-md shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Divider */}
              <div className="relative py-xs">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-outline-variant/30"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-surface-container-lowest px-2 text-outline font-mono">Secure Sign-up</span></div>
              </div>

              {/* Social Signup Placeholder */}
              <button className="w-full flex items-center justify-center gap-2 border border-outline-variant bg-surface-container-lowest py-sm rounded-lg hover:bg-surface-container-low transition-all text-on-surface font-medium" type="button">
                <span className="material-symbols-outlined text-[20px]">shield</span>
                Join with Professional SSO
              </button>
            </form>
          </div>

          <p className="text-center text-[13px] font-semibold text-on-surface-variant">
            By signing up, you agree to our 
            <Link className="text-primary hover:underline mx-1" to="#">Terms of Service</Link> and 
            <Link className="text-primary hover:underline ml-1" to="#">Privacy Policy</Link>.
          </p>
        </div>
      </main>

      {/* Visual Footer Accent */}
      <footer className="w-full py-lg border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-md flex flex-col md:flex-row justify-between items-center gap-sm opacity-60">
          <div className="flex items-center gap-md text-[12px] font-mono">
            <span>© 2024 REDRAFT INC.</span>
            <span>V2.4.0-STABLE</span>
          </div>
          <div className="flex gap-md text-[12px] font-mono">
            <Link className="hover:text-primary" to="#">SUPPORT</Link>
            <Link className="hover:text-primary" to="#">SECURITY</Link>
            <Link className="hover:text-primary" to="#">LEGAL</Link>
          </div>
        </div>
      </footer>

      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#002045 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
    </div>
  );
};

export default RegisterPage;
