import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { register as registerApi } from '../api/auth';

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
          <div className="text-primary w-8 h-8">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
              <path clipRule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865L43.1065 32.8675L43.1101 32.8739L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889L4.94662 32.777L4.95178 32.7688ZM35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z" fill="currentColor" fillRule="evenodd"></path>
            </svg>
          </div>
          <span className="font-bold text-primary tracking-tight text-lg">EverDraft</span>
        </Link>
        <Link className="text-on-surface-variant font-medium hover:text-primary transition-colors flex items-center gap-1" to="/login">
          Sign in <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </nav>

      <main className="flex-grow flex items-center justify-center p-md">
        <div className="w-full max-w-[480px] space-y-lg animate-in fade-in duration-700 slide-in-from-bottom-4">
          <div className="text-center space-y-xs">
            <h1 className="text-[48px] font-bold leading-[56px] tracking-[-0.02em] text-primary">Join the craft</h1>
            <p className="text-on-surface-variant max-w-sm mx-auto">Start drafting professionally with version-controlled precision and absolute focus.</p>
          </div>

          <div className="bg-surface-container-lowest shadow-[0_4px_40px_-10px_rgba(0,32,69,0.05)] rounded-xl p-lg border border-outline-variant/30">
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
                    placeholder="alex@everdraft.com" 
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
            <span>© 2024 EVERDRAFT INC.</span>
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
