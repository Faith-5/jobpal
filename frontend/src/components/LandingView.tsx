import React from 'react';
import { ScreenType } from '../types';

interface LandingViewProps {
  onNavigate: (screen: ScreenType) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  return (
    <div id="landing-page" className="min-h-screen flex flex-col bg-[#0B0F19] text-[#E2E8F0] font-body selection:bg-blue-600/35 selection:text-white">
      {/* Top Navigation */}
      <header
        id="landing-header"
        className="bg-[#0B0F19]/80 backdrop-blur-md w-full top-0 sticky z-50 border-b border-[#1E293B]/70"
      >
        <div className="flex justify-between items-center px-6 py-4 max-w-[1280px] mx-auto">
          <button
            id="brand-logo-btn"
            onClick={() => onNavigate('landing')}
            className="font-headline text-[22px] font-bold text-[#93C5FD] flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span
              className="material-symbols-outlined text-[26px] text-[#38BDF8]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              work
            </span>
            <span>JobPal</span>
          </button>

          <nav id="landing-nav-links" className="hidden md:flex items-center gap-8 font-body text-[15px] font-medium">
            <a
              href="#preview"
              className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors"
            >
              How it works
            </a>
            <a
              href="#workspace"
              className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors"
            >
              What you get
            </a>
            <a
              href="#capabilities"
              className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors"
            >
              Features
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              id="landing-login-btn"
              onClick={() => onNavigate('signin')}
              className="hidden sm:block text-[#94A3B8] hover:text-[#38BDF8] font-body text-[15px] font-medium transition-colors cursor-pointer px-3 py-1.5"
            >
              Log In
            </button>
            <button
              id="landing-get-started-btn"
              onClick={() => onNavigate('signup')}
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-headline text-[13px] font-semibold hover:bg-blue-500 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(37,99,235,0.25)] cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col relative overflow-hidden">
        {/* Hero Section */}
        <section
          id="hero-section"
          className="relative pt-24 pb-12 px-6 bg-glow flex flex-col items-center justify-center text-center"
        >
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1E293B] bg-[#1E293B]/60 mb-6 shadow-sm">
            <span
              className="material-symbols-outlined text-[#38BDF8] text-[18px] animate-pulse"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            <span className="font-headline text-[11px] text-blue-300 tracking-wider uppercase font-bold">
              Tailor your CV with AI
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-headline text-[42px] sm:text-[56px] md:text-[68px] text-white max-w-4xl mb-6 font-bold leading-[1.08] tracking-tight">
            Stop sending resumes <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93C5FD] via-[#60A5FA] to-[#3B82F6]">
              that scanners ignore.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-body text-[17px] sm:text-[19px] text-[#94A3B8] max-w-2xl mb-10 leading-relaxed">
            One master profile. Infinite tailored variants. Optimize your achievements with hard metrics, auto-integrate critical keywords, and apply with confidence in under 60 seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center z-10">
            <button
              id="hero-start-tailoring-btn"
              onClick={() => onNavigate('signup')}
              className="bg-blue-600 text-white px-9 py-4 rounded-full font-headline text-[15px] font-semibold hover:bg-blue-500 active:scale-[0.98] hover:scale-[1.01] transition-all shadow-[0_8px_30px_rgba(37,99,235,0.3)] flex items-center justify-center gap-3 cursor-pointer w-full sm:w-auto"
            >
              <span>Build My CV Free</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
            <button
              id="hero-demo-dashboard-btn"
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-4 rounded-full border border-[#1E293B] bg-[#1E293B]/30 text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/60 font-headline text-[14px] font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <span>Launch Sandbox Demo</span>
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
            </button>
          </div>
        </section>

        {/* Platform Preview Panel */}
        <section id="preview" className="px-6 pb-20 relative max-w-[1000px] mx-auto w-full">
          <div className="relative rounded-2xl bg-[#0F172A]/50 border border-[#1E293B]/70 p-6 sm:p-8 backdrop-blur-md shadow-2xl flex flex-col md:flex-row gap-8 items-stretch group hover:border-blue-500/30 transition-all duration-500">
            
            {/* Subtle glow behind mockup */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-5 blur-xl group-hover:opacity-10 transition-opacity duration-1000" />
            
            {/* Left Panel: ATS Score Card Mockup */}
            <div className="flex-1 bg-[#0B0F19]/90 rounded-xl p-6 border border-[#1E293B] flex flex-col justify-between relative z-10">
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Target Job Matching</span>
                <h4 className="text-[17px] font-bold text-white mb-4">Senior Product Designer (Acme Corp)</h4>
                
                {/* Score circle simulation */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative w-20 h-20 rounded-full border-4 border-blue-500/20 border-t-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/10">
                    <span className="text-2xl font-bold text-white">94%</span>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-bold text-[14px] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span>
                      Ready to Apply
                    </span>
                    <p className="text-[12px] text-slate-400 mt-0.5 leading-tight">Your CV matches all primary keywords and formatting rules.</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#1E293B] pt-4 flex gap-4 text-[13px]">
                <div className="flex-1">
                  <span className="text-slate-400 block text-[11px]">Keywords Found</span>
                  <span className="text-white font-bold font-headline text-[15px]">97%</span>
                </div>
                <div className="flex-1 border-l border-[#1E293B] pl-4">
                  <span className="text-slate-400 block text-[11px]">Achievements Metrics</span>
                  <span className="text-white font-bold font-headline text-[15px]">88%</span>
                </div>
              </div>
            </div>

            {/* Right Panel: Suggestions */}
            <div className="flex-1 flex flex-col justify-between relative z-10">
              <div>
                <span className="text-[11px] text-[#38BDF8] font-bold uppercase tracking-wider block mb-2">Smart Recommendations</span>
                <p className="text-[#94A3B8] text-[13px] mb-4 leading-relaxed">JobPal automatically finds gaps in your CV and helps you fix them instantly.</p>
                
                {/* Suggestions items */}
                <div className="space-y-3">
                  <div className="bg-[#0B0F19]/40 border border-[#1E293B]/80 rounded-xl p-3.5 flex items-start gap-3 hover:border-blue-500/30 transition-colors">
                    <span className="material-symbols-outlined text-amber-400 text-[18px] mt-0.5">warning</span>
                    <div className="flex-grow">
                      <h5 className="text-[13px] font-bold text-white">Add numbers to your achievements</h5>
                      <p className="text-[11px] text-slate-400 mt-1">Change "Improved user retention" to "Improved user retention by 24% over 6 months."</p>
                    </div>
                  </div>

                  <div className="bg-[#0B0F19]/40 border border-blue-500/30 rounded-xl p-3.5 flex items-start gap-3">
                    <span className="material-symbols-outlined text-emerald-400 text-[18px] mt-0.5">verified</span>
                    <div className="flex-grow">
                      <h5 className="text-[13px] font-bold text-slate-300">Added keyword: "Prototyping"</h5>
                      <p className="text-[11px] text-slate-500 mt-1">Found 4 times in the job description; added to your skills list.</p>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => onNavigate('onboarding')}
                className="mt-6 w-full py-3 bg-[#1E293B] hover:bg-[#334155] text-white rounded-xl font-headline text-[13px] font-semibold border border-[#334155] transition-all cursor-pointer text-center"
              >
                Tailor My Resume
              </button>
            </div>

          </div>
        </section>

        {/* What You Enjoy Section */}
        <section id="workspace" className="py-20 px-6 max-w-[1280px] mx-auto w-full border-t border-[#1E293B]/60">
          <div className="text-center mb-16">
            <span className="text-[11px] text-[#38BDF8] font-bold uppercase tracking-wider block mb-2">Everything you need to succeed</span>
            <h2 className="font-headline text-[32px] sm:text-[38px] font-bold text-white mb-3">
              Built for your career journey
            </h2>
            <p className="font-body text-[16px] sm:text-[18px] text-[#94A3B8] max-w-xl mx-auto">
              Simple tools that take the stress out of applying for jobs, contracts, and proposals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tracker */}
            <div className="bg-[#0F172A]/40 border border-[#1E293B]/50 rounded-2xl p-8 flex items-start gap-5 hover:border-[#1E293B]/80 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[#38BDF8] flex-shrink-0">
                <span className="material-symbols-outlined text-[24px]">task_alt</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Job Application Tracker</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  Keep all your applications in one clean dashboard. Move cards from "Applied" to "Interviewing" and "Offers" as you progress, keeping your search simple and organized.
                </p>
              </div>
            </div>

            {/* Align */}
            <div className="bg-[#0F172A]/40 border border-[#1E293B]/50 rounded-2xl p-8 flex items-start gap-5 hover:border-[#1E293B]/80 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                <span className="material-symbols-outlined text-[24px]">tune</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Paste & Tailor Instantly</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  Just copy-paste any job description. JobPal automatically updates your skills list and experience text bullets to align perfectly with the target role.
                </p>
              </div>
            </div>

            {/* Living profile */}
            <div className="bg-[#0F172A]/40 border border-[#1E293B]/50 rounded-2xl p-8 flex items-start gap-5 hover:border-[#1E293B]/80 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <span className="material-symbols-outlined text-[24px]">sync</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Your Profile Grows With You</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  JobPal updates as you grow. Every resume change you accept automatically updates your master profile, keeping you ready for the next opportunity.
                </p>
              </div>
            </div>

            {/* Qualifications vault */}
            <div className="bg-[#0F172A]/40 border border-[#1E293B]/50 rounded-2xl p-8 flex items-start gap-5 hover:border-[#1E293B]/80 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
                <span className="material-symbols-outlined text-[24px]">lock</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Safe Qualifications Vault</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  More than just job hunting. Safely store your complete history of credentials, projects, and skills in one secure vault. Ready to export for contracts, speaking gigs, or promotions anytime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="capabilities" className="py-24 px-6 border-t border-[#1E293B]/60 bg-[#0F172A]/10 w-full">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline text-[32px] sm:text-[38px] font-bold text-white mb-3">
                Why job seekers love JobPal
              </h2>
              <p className="font-body text-[16px] sm:text-[18px] text-[#94A3B8] max-w-2xl mx-auto">
                No complex layouts or settings. Just high-impact features that make applying simple.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-[#0F172A]/50 border border-[#1E293B]/40 p-8 rounded-2xl shadow-sm hover:border-[#1E293B]/80 transition-all flex flex-col items-start">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-6 text-[#38BDF8]">
                  <span className="material-symbols-outlined text-[26px]">add_task</span>
                </div>
                <h3 className="font-headline text-[20px] font-bold text-white mb-3">
                  No Formatting Issues
                </h3>
                <p className="font-body text-[14px] text-[#94A3B8] leading-relaxed">
                  Our clean, structured layouts pass through automated screening filters (Taleo, Greenhouse, Workday) with ease, so human recruiters actually see your CV.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#0F172A]/50 border border-[#1E293B]/40 p-8 rounded-2xl shadow-sm hover:border-[#1E293B]/80 transition-all flex flex-col items-start">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 text-amber-400">
                  <span className="material-symbols-outlined text-[26px]">trending_up</span>
                </div>
                <h3 className="font-headline text-[20px] font-bold text-white mb-3">
                  Auto Keyword Ingestion
                </h3>
                <p className="font-body text-[14px] text-[#94A3B8] leading-relaxed">
                  JobPal automatically finds which required skills are missing from your resume and suggests exactly where to add them to boost compatibility.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#0F172A]/50 border border-[#1E293B]/40 p-8 rounded-2xl shadow-sm hover:border-[#1E293B]/80 transition-all flex flex-col items-start">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 text-emerald-400">
                  <span className="material-symbols-outlined text-[26px]">download</span>
                </div>
                <h3 className="font-headline text-[20px] font-bold text-white mb-3">
                  Quantified Achievements
                </h3>
                <p className="font-body text-[14px] text-[#94A3B8] leading-relaxed">
                  AI scans your descriptions, replacing weak phrases with concrete metrics and numbers, immediately highlighting your actual impact.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Centered CTA */}
        <section className="py-24 px-6 border-t border-[#1E293B]/60 text-center relative overflow-hidden bg-gradient-to-b from-transparent to-[#0F172A]/30">
          <div className="max-w-[700px] mx-auto z-10 relative">
            <h2 className="font-headline text-[32px] sm:text-[40px] font-bold text-white mb-4">Ready to simplify your applications?</h2>
            <p className="text-[#94A3B8] text-[16px] sm:text-[18px] mb-8 leading-relaxed">Join thousands of candidates who stopped manually formatting their resumes and started landing interviews.</p>
            <button
              onClick={() => onNavigate('signup')}
              className="bg-blue-600 text-white px-9 py-4 rounded-full font-headline text-[15px] font-semibold hover:bg-blue-500 active:scale-[0.98] transition-all shadow-[0_4px_25px_rgba(37,99,235,0.35)] cursor-pointer"
            >
              Get Started Instantly
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        id="landing-footer"
        className="bg-[#0B0F19] border-t border-[#1E293B]/50 w-full py-12"
      >
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-[1280px] mx-auto gap-6">
          <div className="font-headline text-[18px] font-bold text-white flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[22px] text-blue-500"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              work
            </span>
            <span>JobPal AI</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 font-body text-[14px] text-[#94A3B8] font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </nav>

          <div className="font-body text-[14px] text-[#64748B]">
            © {new Date().getFullYear()} JobPal AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingView;
