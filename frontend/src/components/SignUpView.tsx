import React, { useState } from "react";
import { ScreenType, UserProfile } from "../types";

interface SignUpViewProps {
  onNavigate: (screen: ScreenType) => void;
  onSignUpSuccess: (userData: Partial<UserProfile>) => void;
}

export const SignUpView: React.FC<SignUpViewProps> = ({
  onNavigate,
  onSignUpSuccess,
}) => {
  const [name, setName] = useState("Sarah Jenkins");
  const [email, setEmail] = useState("sarah.jenkins@example.com");
  const [phoneCode, setPhoneCode] = useState("+234");
  const [phoneNumber, setPhoneNumber] = useState("9000000000");
  const [primaryGoal, setPrimaryGoal] = useState<
    "actively_searching" | "career_pivot" | "exploring"
  >("actively_searching");
  const [experienceLevel, setExperienceLevel] = useState<
    "junior" | "mid" | "senior"
  >("mid");
  const [password, setPassword] = useState("SecurePass123!");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignUpSuccess({
      name,
      email,
      phone: `${phoneCode} ${phoneNumber}`,
      state: "",
      country: "",
      primaryGoal,
      experienceLevel,
      role:
        experienceLevel === "senior"
          ? "Senior Product Designer"
          : experienceLevel === "mid"
            ? "Product Designer"
            : "Junior Product Designer",
    });
  };

  return (
    <div
      id="signup-screen"
      className="min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 bg-[#0B0F19] text-[#E2E8F0] font-body relative overflow-y-auto"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Sign Up Card */}
      <div className="w-full max-w-[540px] bg-[#0F172A] border border-[#1E293B] rounded-2xl p-7 sm:p-10 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <button
            id="signup-brand-btn"
            onClick={() => onNavigate("landing")}
            className="flex items-center gap-2 mb-3 group cursor-pointer"
          >
            <img
              src="/logo.svg"
              alt=""
              className="w-9 h-9 rounded-xl group-hover:scale-110 transition-transform"
            />
            <span className="font-headline text-[24px] font-bold text-[#93C5FD]">
              JobPal
            </span>
          </button>
          <h2 className="font-headline text-[24px] font-semibold text-white">
            Create Account
          </h2>
          <p className="font-body text-[14px] text-[#94A3B8] mt-1 text-center">
            Start tailoring your career applications today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Mercer"
              className="w-full bg-[#0B0F19]/60 border border-[#1E293B]/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 text-white text-[14px] outline-none transition-all placeholder:text-slate-500"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#0B0F19]/60 border border-[#1E293B]/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 text-white text-[14px] outline-none transition-all placeholder:text-slate-500"
              />
            </div>
            <div>
              <label
                htmlFor="signup-phone-number"
                className="block font-headline text-[13px] font-semibold text-[#94A3B8] mb-1.5"
              >
                Phone Number
              </label>
              <div className="flex gap-2 w-full">
                <input
                  id="signup-phone-code"
                  type="text"
                  required
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  placeholder="+234"
                  className="w-20 bg-[#0B0F19]/60 border border-[#1E293B]/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2.5 text-white text-[14px] text-center outline-none transition-all placeholder:text-slate-500"
                />
                <input
                  id="signup-phone-number"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="9000000000"
                  className="flex-grow min-w-0 bg-[#0B0F19]/60 border border-[#1E293B]/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 text-white text-[14px] outline-none transition-all placeholder:text-slate-500"
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
                Reason for Joining
              </label>
              <select
                id="signup-goal"
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value as any)}
                className="w-full bg-[#0B0F19]/60 border border-[#1E293B]/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 text-white text-[14px] outline-none transition-all cursor-pointer"
              >
                <option value="actively_searching">
                  Actively applying (ATS match)
                </option>
                <option value="career_pivot">
                  Pivoting careers (Transferable skills)
                </option>
                <option value="exploring">
                  Passive exploring (Skill matches)
                </option>
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
                className="w-full bg-[#0B0F19]/60 border border-[#1E293B]/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 text-white text-[14px] outline-none transition-all cursor-pointer"
              >
                <option value="junior">Entry-Level (Focus on projects)</option>
                <option value="mid">Mid-Level (Focus on execution)</option>
                <option value="senior">
                  Senior / Exec (Focus on leadership)
                </option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="signup-password"
              className="block font-headline text-[13px] font-semibold text-[#94A3B8] mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full bg-[#0B0F19]/60 border border-[#1E293B]/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 pr-11 text-white text-[14px] outline-none transition-all placeholder:text-slate-500"
              />
              <button
                type="button"
                id="signup-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer p-1"
              >
                <span className="material-symbols-outlined text-[19px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <button
            id="btn-submit-signup"
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-headline text-[14px] font-semibold py-3 rounded-xl transition-all shadow-[0_4px_20px_rgba(37,99,235,0.25)] cursor-pointer mt-4"
          >
            Create Account & Continue
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center border-t border-[#1E293B]/70 pt-5">
          <p className="font-body text-[14px] text-[#94A3B8]">
            Already have an account?{" "}
            <button
              id="link-go-to-signin"
              onClick={() => onNavigate("signin")}
              className="text-[#93C5FD] hover:underline font-medium cursor-pointer"
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
