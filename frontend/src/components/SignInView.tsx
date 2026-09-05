import React, { useState } from 'react';
import { ScreenType } from '../types';

interface SignInViewProps {
  onNavigate: (screen: ScreenType) => void;
  onLoginSuccess: (email: string) => void;
}

export const SignInView: React.FC<SignInViewProps> = ({
  onNavigate,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('sarah.jenkins@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onLoginSuccess(email);
  };

  return (
    <div
      id="signin-screen"
      className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0B0F19] text-[#E2E8F0] font-body relative overflow-y-auto"
    >
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Sign In Container Card */}
      <div className="w-full max-w-[420px] bg-[#0F172A] border border-[#1E293B] rounded-2xl p-8 sm:p-10 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <button
            id="signin-brand-btn"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 mb-4 group cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[32px] text-[#93C5FD] group-hover:scale-110 transition-transform"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              work
            </span>
            <span className="font-headline text-[24px] font-bold text-[#93C5FD]">
              JobPal
            </span>
          </button>
          <h2 className="font-headline text-[24px] font-semibold text-white">
            Welcome back
          </h2>
          <p className="font-body text-[14px] text-[#94A3B8] mt-1 text-center">
            Log in to your account to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="signin-email"
              className="block font-headline text-[13px] font-semibold text-[#94A3B8] mb-2"
            >
              Email address
            </label>
            <input
              id="signin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-[#0B0F19]/60 border border-[#1E293B]/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 text-white text-[15px] outline-none transition-all placeholder:text-slate-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="signin-password"
                className="font-headline text-[13px] font-semibold text-[#94A3B8]"
              >
                Password
              </label>
              <button
                type="button"
                id="link-forgot-password"
                onClick={() => {
                  setForgotEmail(email);
                  setShowForgotModal(true);
                  setForgotSubmitted(false);
                }}
                className="font-body text-[13px] text-[#93C5FD] hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                id="signin-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#0B0F19]/60 border border-[#1E293B]/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 pr-11 text-white text-[15px] outline-none transition-all placeholder:text-slate-500"
              />
              <button
                type="button"
                id="btn-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer p-1"
                aria-label="Toggle password visibility"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            id="btn-submit-signin"
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-headline text-[14px] font-semibold py-3.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(37,99,235,0.25)] cursor-pointer mt-2"
          >
            Sign In
          </button>

          {/* Quick Demo Fill Button */}
          <button
            type="button"
            id="btn-demo-signin"
            onClick={() => {
              setEmail('sarah.jenkins@example.com');
              setPassword('password123');
              onLoginSuccess('sarah.jenkins@example.com');
            }}
            className="w-full bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-[#94A3B8] hover:text-white font-headline text-[13px] font-semibold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-400">bolt</span>
            <span>Fast Demo Login (Sarah Jenkins)</span>
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center border-t border-[#1E293B]/70 pt-6">
          <p className="font-body text-[14px] text-[#94A3B8]">
            Don&apos;t have an account?{' '}
            <button
              id="link-go-to-signup"
              onClick={() => onNavigate('signup')}
              className="text-[#93C5FD] hover:underline font-medium cursor-pointer"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-2xl text-[#E2E8F0]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline text-[18px] font-bold text-white">
                Reset Password
              </h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {forgotSubmitted ? (
              <div className="text-center py-4">
                <span className="material-symbols-outlined text-[#4edea3] text-[40px] mb-2">
                  mark_email_read
                </span>
                <p className="text-white font-medium mb-1">Recovery link sent</p>
                <p className="text-[#94A3B8] text-[13px] mb-4">
                  Check your inbox at {forgotEmail || email} for instructions to reset your password.
                </p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-[13px] font-semibold"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <div>
                <p className="font-body text-[14px] text-[#94A3B8] mb-4">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#0B0F19]/60 border border-[#1E293B] rounded-xl px-4 py-2.5 text-white text-[14px] mb-4 outline-none focus:border-blue-500"
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 rounded-xl text-[#94A3B8] hover:bg-[#1E293B] text-[13px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setForgotSubmitted(true)}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-semibold"
                  >
                    Send Reset Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInView;
