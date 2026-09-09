import React, { useState, useEffect } from "react";
import { ScreenType, UserProfile } from "../types";
import {
  loginUser,
  getRememberedEmail,
  setRememberedEmail,
  saveStoredUserSession,
} from "../services/api";

interface SignInViewProps {
  onNavigate: (screen: ScreenType) => void;
  onLoginSuccess: (email: string, userDetails?: Partial<UserProfile>) => void;
}

export const SignInView: React.FC<SignInViewProps> = ({
  onNavigate,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  useEffect(() => {
    const remembered = getRememberedEmail();
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  const validateEmail = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address (e.g. name@domain.com).");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginUser(trimmedEmail, password);
      
      // Save remembered email preference
      setRememberedEmail(trimmedEmail, rememberMe);

      // Save user session in localStorage
      const sessionData: Partial<UserProfile> = {
        email: trimmedEmail,
        ...(result.user || {}),
      };
      saveStoredUserSession(sessionData);

      onLoginSuccess(trimmedEmail, result.user);
    } catch (err: any) {
      setErrorMessage(
        err.message || "Unable to sign in. Please verify your email and password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !validateEmail(forgotEmail.trim())) {
      return;
    }
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotSubmitted(true);
    }, 800);
  };

  return (
    <div
      id="signin-screen"
      className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0B0F19] text-[#E2E8F0] font-body relative overflow-y-auto"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Sign In Container Card */}
      <div className="w-full max-w-[440px] bg-[#0F172A] border border-[#1E293B] rounded-2xl p-8 sm:p-10 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <button
            id="signin-brand-btn"
            onClick={() => onNavigate("landing")}
            className="flex items-center gap-2.5 mb-4 group cursor-pointer focus:outline-none"
            aria-label="Back to JobPal Homepage"
          >
            <img
              src="/logo.svg"
              alt="JobPal Logo"
              className="w-10 h-10 rounded-xl group-hover:scale-105 transition-transform"
            />
            <span className="font-headline text-[24px] font-bold text-[#93C5FD]">
              JobPal
            </span>
          </button>
          <h1 className="font-headline text-[24px] font-bold text-white tracking-tight">
            Welcome back
          </h1>
          <p className="font-body text-[14px] text-[#94A3B8] mt-1 text-center">
            Sign in to access your AI career co-pilot
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-5 bg-red-950/40 border border-red-500/40 rounded-xl p-3.5 flex items-start gap-2.5 text-red-200 text-[13px] animate-fade-in"
          >
            <span className="material-symbols-outlined text-[18px] text-red-400 shrink-0 mt-0.5">
              error
            </span>
            <div className="flex-1 leading-snug">{errorMessage}</div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-red-200 cursor-pointer p-0.5"
              aria-label="Dismiss error"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="signin-email"
              className="block font-headline text-[13px] font-semibold text-[#94A3B8] mb-1.5"
            >
              Email address
            </label>
            <input
              id="signin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="name@example.com"
              className="w-full bg-[#0B0F19]/80 border border-[#1E293B] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 text-white text-[14px] outline-none transition-all placeholder:text-slate-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
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
                className="font-body text-[12.5px] text-[#93C5FD] hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Enter your password"
                className="w-full bg-[#0B0F19]/80 border border-[#1E293B] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 pr-11 text-white text-[14px] outline-none transition-all placeholder:text-slate-500"
              />
              <button
                type="button"
                id="btn-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                id="signin-remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-[#0B0F19] border-[#1E293B] text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-[13px] text-[#94A3B8]">Remember my email</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            id="btn-submit-signin"
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-headline text-[14px] font-semibold py-3.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(37,99,235,0.25)] cursor-pointer mt-3 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">
                  progress_activity
                </span>
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center border-t border-[#1E293B]/70 pt-6">
          <p className="font-body text-[14px] text-[#94A3B8]">
            Don&apos;t have an account?{" "}
            <button
              id="link-go-to-signup"
              onClick={() => onNavigate("signup")}
              className="text-[#93C5FD] hover:underline font-semibold cursor-pointer"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 sm:p-7 shadow-2xl text-[#E2E8F0]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline text-[18px] font-bold text-white">
                Reset Password
              </h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="text-center py-4">
                <span className="material-symbols-outlined text-[#4edea3] text-[44px] mb-3">
                  mark_email_read
                </span>
                <h4 className="text-white font-bold text-[16px] mb-1">
                  Recovery instructions sent
                </h4>
                <p className="text-[#94A3B8] text-[13.5px] mb-5 leading-relaxed">
                  If an account exists for <span className="text-white font-semibold">{forgotEmail || email}</span>, you will receive a secure password reset link within moments.
                </p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit}>
                <p className="font-body text-[13.5px] text-[#94A3B8] mb-4 leading-relaxed">
                  Enter your account email address below and we will send you a link to reset your password.
                </p>
                <div className="mb-5">
                  <label
                    htmlFor="forgot-email-input"
                    className="block font-headline text-[12.5px] font-semibold text-[#94A3B8] mb-1.5"
                  >
                    Account Email
                  </label>
                  <input
                    id="forgot-email-input"
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#0B0F19]/80 border border-[#1E293B] rounded-xl px-4 py-2.5 text-white text-[14px] outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2.5 rounded-xl text-[#94A3B8] hover:bg-[#1E293B] text-[13px] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-semibold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {forgotLoading ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[16px]">
                          progress_activity
                        </span>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInView;
