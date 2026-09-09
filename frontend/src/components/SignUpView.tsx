import React, { useState } from "react";
import { ScreenType, UserProfile } from "../types";
import { signupUser, saveStoredUserSession } from "../services/api";

interface SignUpViewProps {
  onNavigate: (screen: ScreenType) => void;
  onSignUpSuccess: (userData: Partial<UserProfile>) => void;
}

export const SignUpView: React.FC<SignUpViewProps> = ({
  onNavigate,
  onSignUpSuccess,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [primaryGoal, setPrimaryGoal] = useState<
    "actively_searching" | "career_pivot" | "exploring"
  >("actively_searching");
  const [experienceLevel, setExperienceLevel] = useState<
    "junior" | "mid" | "senior"
  >("mid");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const calculatePasswordStrength = (pwd: string): { score: number; label: string; color: string } => {
    if (!pwd) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 25, label: "Weak", color: "bg-red-500" };
    if (score === 2) return { score: 50, label: "Fair", color: "bg-amber-500" };
    if (score === 3) return { score: 75, label: "Good", color: "bg-blue-500" };
    return { score: 100, label: "Strong", color: "bg-emerald-500" };
  };

  const pwdStrength = calculatePasswordStrength(password);

  const validateEmail = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedName) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!trimmedEmail || !validateEmail(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    const fullPhone = trimmedPhone ? `${phoneCode} ${trimmedPhone}` : "";
    const defaultRole =
      experienceLevel === "senior"
        ? "Senior Professional"
        : experienceLevel === "mid"
          ? "Professional"
          : "Entry-Level Specialist";

    const userPayload: Partial<UserProfile> = {
      name: trimmedName,
      email: trimmedEmail,
      phone: fullPhone,
      state: "",
      country: "",
      primaryGoal,
      experienceLevel,
      role: defaultRole,
      skills: ["Problem Solving", "Strategic Planning", "Communication"],
    };

    try {
      await signupUser({
        name: trimmedName,
        email: trimmedEmail,
        password,
        phone: fullPhone,
        primaryGoal,
        role: defaultRole,
      });

      saveStoredUserSession(userPayload);
      onSignUpSuccess(userPayload);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="signup-screen"
      className="min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 bg-[#0B0F19] text-[#E2E8F0] font-body relative overflow-y-auto"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Sign Up Card */}
      <div className="w-full max-w-[520px] bg-[#0F172A] border border-[#1E293B] rounded-2xl p-7 sm:p-10 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <button
            id="signup-brand-btn"
            onClick={() => onNavigate("landing")}
            className="flex items-center gap-2.5 mb-3 group cursor-pointer focus:outline-none"
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
            Create your account
          </h1>
          <p className="font-body text-[14px] text-[#94A3B8] mt-1 text-center">
            Supercharge your job search with AI-powered resume tailoring
          </p>
        </div>

        {/* Error Message */}
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
          {/* Full Name */}
          <div>
            <label
              htmlFor="signup-name"
              className="block font-headline text-[13px] font-semibold text-[#94A3B8] mb-1.5"
            >
              Full Name
            </label>
            <input
              id="signup-name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="e.g. Alex Mercer"
              className="w-full bg-[#0B0F19]/80 border border-[#1E293B] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 text-white text-[14px] outline-none transition-all placeholder:text-slate-500"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="signup-email"
                className="block font-headline text-[13px] font-semibold text-[#94A3B8] mb-1.5"
              >
                Email Address
              </label>
              <input
                id="signup-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="name@example.com"
                className="w-full bg-[#0B0F19]/80 border border-[#1E293B] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 text-white text-[14px] outline-none transition-all placeholder:text-slate-500"
              />
            </div>
            <div>
              <label
                htmlFor="signup-phone-number"
                className="block font-headline text-[13px] font-semibold text-[#94A3B8] mb-1.5"
              >
                Phone Number (Optional)
              </label>
              <div className="flex gap-2 w-full">
                <input
                  id="signup-phone-code"
                  type="text"
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  placeholder="+1"
                  className="w-16 bg-[#0B0F19]/80 border border-[#1E293B] focus:border-blue-500 rounded-xl px-2 py-2.5 text-white text-[14px] text-center outline-none transition-all placeholder:text-slate-500"
                />
                <input
                  id="signup-phone-number"
                  type="tel"
                  autoComplete="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="555-0199"
                  className="flex-grow min-w-0 bg-[#0B0F19]/80 border border-[#1E293B] focus:border-blue-500 rounded-xl px-4 py-2.5 text-white text-[14px] outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Primary Goal & Experience Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="signup-goal"
                className="block font-headline text-[13px] font-semibold text-[#94A3B8] mb-1.5"
              >
                Primary Objective
              </label>
              <select
                id="signup-goal"
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value as any)}
                className="w-full bg-[#0B0F19]/80 border border-[#1E293B] focus:border-blue-500 rounded-xl px-3 py-2.5 text-white text-[13.5px] outline-none transition-all cursor-pointer"
              >
                <option value="actively_searching">Actively Applying (ATS Match)</option>
                <option value="career_pivot">Career Pivot (Transferable Skills)</option>
                <option value="exploring">Exploring Opportunities</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="signup-experience"
                className="block font-headline text-[13px] font-semibold text-[#94A3B8] mb-1.5"
              >
                Experience Level
              </label>
              <select
                id="signup-experience"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="w-full bg-[#0B0F19]/80 border border-[#1E293B] focus:border-blue-500 rounded-xl px-3 py-2.5 text-white text-[13.5px] outline-none transition-all cursor-pointer"
              >
                <option value="junior">Entry-Level (0 - 2 Years)</option>
                <option value="mid">Mid-Level (3 - 5 Years)</option>
                <option value="senior">Senior / Leadership (6+ Years)</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="signup-password"
              className="block font-headline text-[13px] font-semibold text-[#94A3B8] mb-1.5"
            >
              Password (min. 8 characters)
            </label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Create a strong password"
                className="w-full bg-[#0B0F19]/80 border border-[#1E293B] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 pr-11 text-white text-[14px] outline-none transition-all placeholder:text-slate-500"
              />
              <button
                type="button"
                id="signup-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined text-[19px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1 animate-fade-in">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${pwdStrength.color}`}
                    style={{ width: `${pwdStrength.score}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Strength</span>
                  <span className="font-semibold text-white">{pwdStrength.label}</span>
                </div>
              </div>
            )}
          </div>

          <button
            id="btn-submit-signup"
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-headline text-[14px] font-semibold py-3.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(37,99,235,0.25)] cursor-pointer mt-4 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">
                  progress_activity
                </span>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account & Continue</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center border-t border-[#1E293B]/70 pt-5">
          <p className="font-body text-[14px] text-[#94A3B8]">
            Already have an account?{" "}
            <button
              id="link-go-to-signin"
              onClick={() => onNavigate("signin")}
              className="text-[#93C5FD] hover:underline font-semibold cursor-pointer"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpView;
