import React, { useState } from 'react';
import { UserProfile, ScreenType } from '../types';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onNavigate: (screen: ScreenType) => void;
  currentTheme?: 'dark' | 'light';
  onToggleTheme?: (theme: 'dark' | 'light') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  onNavigate,
  currentTheme = 'dark',
  onToggleTheme,
}) => {
  // Theme State
  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light'>(currentTheme);

  // Experience / Seniority Level (Simple 3 options: Beginner, Intermediate, Advanced)
  const [seniorityLevel, setSeniorityLevel] = useState<'beginner' | 'intermediate' | 'advanced'>(
    user.experienceLevel === 'junior'
      ? 'beginner'
      : user.experienceLevel === 'mid'
      ? 'intermediate'
      : 'advanced'
  );

  // AI Tailoring Toggles
  const [aiToggles, setAiToggles] = useState({
    autoQuantify: true,
    strictKeywordMatch: true,
    standardHeadings: true,
  });

  // Cover Letter Tone
  const [coverLetterTone, setCoverLetterTone] = useState<'impact' | 'direct' | 'conversational'>('impact');

  // Export Defaults
  const [defaultFormat, setDefaultFormat] = useState<'pdf' | 'docx'>('pdf');
  const [paperSize, setPaperSize] = useState<'letter' | 'a4'>('letter');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggle = (key: keyof typeof aiToggles) => {
    setAiToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleThemeChange = (theme: 'dark' | 'light') => {
    setSelectedTheme(theme);
    onToggleTheme?.(theme);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const mappedLevel =
      seniorityLevel === 'beginner' ? 'junior' : seniorityLevel === 'intermediate' ? 'mid' : 'senior';
    
    onUpdateUser({
      ...user,
      experienceLevel: mappedLevel,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div id="settings-screen" className="p-4 sm:p-6 md:p-8 max-w-[960px] mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <h1 className="font-headline text-[24px] sm:text-[30px] font-bold text-[#e5e2e1] tracking-tight">
          Settings & Preferences
        </h1>
        <p className="font-body text-[14px] sm:text-[15px] text-[#c3c6d7] mt-0.5">
          Customize your workspace appearance, AI tailoring parameters, and document generation rules
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ========================================================================= */}
        {/* 1. TOP PRIORITY: THEME & WORKSPACE APPEARANCE */}
        {/* ========================================================================= */}
        <div className="bg-[#1c1b1b] border border-[#434655]/40 rounded-2xl p-5 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#434655]/30">
            <div className="w-9 h-9 rounded-xl bg-[#8b5cf6]/20 text-[#a78bfa] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">palette</span>
            </div>
            <div>
              <h3 className="font-headline text-[16px] sm:text-[17px] font-bold text-white">
                Workspace Appearance & Theme
              </h3>
              <p className="text-[12px] text-[#8d90a0]">
                Choose your preferred interface theme across JobPal AI
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Dark Theme Option */}
            <div
              onClick={() => handleThemeChange('dark')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                selectedTheme === 'dark'
                  ? 'bg-[#141414] border-[#2563eb] shadow-md'
                  : 'bg-[#141414]/60 border-[#434655]/40 hover:border-[#434655]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#131313] border border-[#434655] flex items-center justify-center text-[#b4c5ff]">
                  <span className="material-symbols-outlined text-[22px]">dark_mode</span>
                </div>
                <div>
                  <div className="font-headline text-[14.5px] font-bold text-white">Dark Mode</div>
                  <div className="text-[11.5px] text-[#8d90a0]">Sleek dark obsidian palette</div>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedTheme === 'dark' ? 'border-[#2563eb] bg-[#2563eb]' : 'border-[#434655]'
                }`}
              >
                {selectedTheme === 'dark' && <span className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>

            {/* Light Theme Option */}
            <div
              onClick={() => handleThemeChange('light')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                selectedTheme === 'light'
                  ? 'bg-[#141414] border-[#2563eb] shadow-md'
                  : 'bg-[#141414]/60 border-[#434655]/40 hover:border-[#434655]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#f8fafc] border border-[#cbd5e1] flex items-center justify-center text-[#f59e0b]">
                  <span className="material-symbols-outlined text-[22px]">light_mode</span>
                </div>
                <div>
                  <div className="font-headline text-[14.5px] font-bold text-white">Light Mode</div>
                  <div className="text-[11.5px] text-[#8d90a0]">Crisp, clean high-contrast style</div>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedTheme === 'light' ? 'border-[#2563eb] bg-[#2563eb]' : 'border-[#434655]'
                }`}
              >
                {selectedTheme === 'light' && <span className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. CORE AI RESUME ENGINE & SENIORITY LEVEL */}
        {/* ========================================================================= */}
        <div className="bg-[#1c1b1b] border border-[#434655]/40 rounded-2xl p-5 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-[#434655]/30">
            <div className="w-9 h-9 rounded-xl bg-[#2563eb]/20 text-[#38bdf8] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
            </div>
            <div>
              <h3 className="font-headline text-[16px] sm:text-[17px] font-bold text-white">
                AI Resume Tailoring Engine & Level
              </h3>
              <p className="text-[12px] text-[#8d90a0]">
                Configure target career stage and algorithmic optimization rules
              </p>
            </div>
          </div>

          {/* Simple Target Seniority Level: Beginner, Intermediate, Advanced */}
          <div className="space-y-2">
            <label className="block text-[13px] font-headline font-semibold text-[#c3c6d7]">
              Default Target Seniority Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'beginner',
                  label: 'Beginner / Entry',
                  desc: '0–2 years of experience • Highlights foundational skills & academic projects',
                  icon: 'school',
                },
                {
                  id: 'intermediate',
                  label: 'Intermediate',
                  desc: '2–5 years of experience • Focuses on independent ownership & tech stacks',
                  icon: 'trending_up',
                },
                {
                  id: 'advanced',
                  label: 'Advanced / Senior',
                  desc: '5+ years of experience • Emphasizes leadership, architecture & business ROI',
                  icon: 'military_tech',
                },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSeniorityLevel(lvl.id as any)}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    seniorityLevel === lvl.id
                      ? 'bg-[#2563eb]/20 border-[#2563eb] text-white shadow-sm'
                      : 'bg-[#141414] border-[#434655]/50 text-[#8d90a0] hover:border-[#434655] hover:text-[#c3c6d7]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#38bdf8]">{lvl.icon}</span>
                    <span className="font-headline text-[14px] font-bold text-white">{lvl.label}</span>
                  </div>
                  <p className="text-[11.5px] leading-relaxed text-[#8d90a0]">{lvl.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* AI Tailoring Feature Toggles */}
          <div className="space-y-3 pt-2">
            <label className="block text-[13px] font-headline font-semibold text-[#c3c6d7]">
              Active AI Tailoring Rules
            </label>

            <div
              onClick={() => handleToggle('autoQuantify')}
              className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-[#141414] border border-[#434655]/40 hover:border-[#434655] cursor-pointer transition-colors"
            >
              <div className="space-y-0.5">
                <span className="font-headline text-[13.5px] font-semibold text-white block">
                  Auto-Quantify Career Achievements
                </span>
                <span className="text-[12px] text-[#8d90a0] block leading-relaxed">
                  Converts responsibility descriptions into metric-driven action verbs and quantified impact.
                </span>
              </div>
              <div
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 mt-0.5 ${
                  aiToggles.autoQuantify ? 'bg-[#2563eb]' : 'bg-[#353534]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform transform mt-0.5 ml-0.5 ${
                    aiToggles.autoQuantify ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>

            <div
              onClick={() => handleToggle('strictKeywordMatch')}
              className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-[#141414] border border-[#434655]/40 hover:border-[#434655] cursor-pointer transition-colors"
            >
              <div className="space-y-0.5">
                <span className="font-headline text-[13.5px] font-semibold text-white block">
                  Strict ATS Keyword Matching
                </span>
                <span className="text-[12px] text-[#8d90a0] block leading-relaxed">
                  Extracts and aligns exact skill synonyms from the job posting to pass Taleo, Workday, and Greenhouse.
                </span>
              </div>
              <div
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 mt-0.5 ${
                  aiToggles.strictKeywordMatch ? 'bg-[#2563eb]' : 'bg-[#353534]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform transform mt-0.5 ml-0.5 ${
                    aiToggles.strictKeywordMatch ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>

            <div
              onClick={() => handleToggle('standardHeadings')}
              className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-[#141414] border border-[#434655]/40 hover:border-[#434655] cursor-pointer transition-colors"
            >
              <div className="space-y-0.5">
                <span className="font-headline text-[13.5px] font-semibold text-white block">
                  Standardized ATS Header Hierarchy
                </span>
                <span className="text-[12px] text-[#8d90a0] block leading-relaxed">
                  Enforces clean chronological date formats and standard section titles for seamless parser ingestion.
                </span>
              </div>
              <div
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 mt-0.5 ${
                  aiToggles.standardHeadings ? 'bg-[#2563eb]' : 'bg-[#353534]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform transform mt-0.5 ml-0.5 ${
                    aiToggles.standardHeadings ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. COVER LETTER TONE OF VOICE */}
        {/* ========================================================================= */}
        <div className="bg-[#1c1b1b] border border-[#434655]/40 rounded-2xl p-5 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#434655]/30">
            <div className="w-9 h-9 rounded-xl bg-[#007d55]/20 text-[#4edea3] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">mail</span>
            </div>
            <div>
              <h3 className="font-headline text-[16px] sm:text-[17px] font-bold text-white">
                Cover Letter Tone of Voice
              </h3>
              <p className="text-[12px] text-[#8d90a0]">
                Choose the default narrative style for tailored cover letters
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'impact',
                title: 'Metrics & Impact',
                desc: 'Focuses heavily on business ROI, quantifiable statistics, and technical leadership.',
              },
              {
                id: 'direct',
                title: 'Executive & Concise',
                desc: 'Short, sharp, to-the-point paragraphs tailored for busy hiring managers.',
              },
              {
                id: 'conversational',
                title: 'Story & Culture',
                desc: 'Connects personal passion and mission alignment with the target company.',
              },
            ].map((tone) => (
              <button
                key={tone.id}
                type="button"
                onClick={() => setCoverLetterTone(tone.id as any)}
                className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  coverLetterTone === tone.id
                    ? 'bg-[#007d55]/20 border-[#007d55] text-white shadow-sm'
                    : 'bg-[#141414] border-[#434655]/50 text-[#8d90a0] hover:border-[#434655] hover:text-[#c3c6d7]'
                }`}
              >
                <div className="font-headline text-[13.5px] font-bold">{tone.title}</div>
                <div className="text-[11.5px] leading-relaxed mt-1 text-[#8d90a0]">{tone.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. EXPORT & DOCUMENT DEFAULTS */}
        {/* ========================================================================= */}
        <div className="bg-[#1c1b1b] border border-[#434655]/40 rounded-2xl p-5 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#434655]/30">
            <div className="w-9 h-9 rounded-xl bg-[#f59e0b]/20 text-[#fbbf24] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">download</span>
            </div>
            <div>
              <h3 className="font-headline text-[16px] sm:text-[17px] font-bold text-white">
                Export & Document Defaults
              </h3>
              <p className="text-[12px] text-[#8d90a0]">
                Configure download formats and page sizing standards
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12.5px] font-headline font-semibold text-[#c3c6d7] mb-1.5">
                Primary Export Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDefaultFormat('pdf')}
                  className={`py-2 px-3 rounded-xl text-[12.5px] font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    defaultFormat === 'pdf'
                      ? 'bg-[#2563eb]/20 border-[#2563eb] text-[#38bdf8]'
                      : 'bg-[#141414] border-[#434655]/50 text-[#8d90a0]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] text-[#ffb4ab]">picture_as_pdf</span>
                  <span>PDF Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDefaultFormat('docx')}
                  className={`py-2 px-3 rounded-xl text-[12.5px] font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    defaultFormat === 'docx'
                      ? 'bg-[#2563eb]/20 border-[#2563eb] text-[#38bdf8]'
                      : 'bg-[#141414] border-[#434655]/50 text-[#8d90a0]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] text-[#38bdf8]">article</span>
                  <span>Word (.docx)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[12.5px] font-headline font-semibold text-[#c3c6d7] mb-1.5">
                Page Size Standard
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaperSize('letter')}
                  className={`py-2 px-3 rounded-xl text-[12.5px] font-semibold border transition-all cursor-pointer ${
                    paperSize === 'letter'
                      ? 'bg-[#2563eb]/20 border-[#2563eb] text-[#38bdf8]'
                      : 'bg-[#141414] border-[#434655]/50 text-[#8d90a0]'
                  }`}
                >
                  US Letter (8.5 × 11 in)
                </button>
                <button
                  type="button"
                  onClick={() => setPaperSize('a4')}
                  className={`py-2 px-3 rounded-xl text-[12.5px] font-semibold border transition-all cursor-pointer ${
                    paperSize === 'a4'
                      ? 'bg-[#2563eb]/20 border-[#2563eb] text-[#38bdf8]'
                      : 'bg-[#141414] border-[#434655]/50 text-[#8d90a0]'
                  }`}
                >
                  A4 (210 × 297 mm)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. PLAN & MEMBERSHIP OVERVIEW */}
        {/* ========================================================================= */}
        <div className="bg-[#1c1b1b] border border-[#2563eb]/40 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#2563eb]/20 border border-[#2563eb]/50 flex items-center justify-center text-[#38bdf8] shrink-0">
              <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline text-[16px] font-bold text-white">
                  JobPal Pro Access
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#007d55]/30 text-[#4edea3] text-[11px] font-bold border border-[#007d55]">
                  Active
                </span>
              </div>
              <p className="text-[12.5px] text-[#c3c6d7] mt-0.5">
                Unlimited ATS resume tailoring, cover letter generations, and DOCX exports.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="px-4 py-2 rounded-xl bg-[#201f1f] hover:bg-[#2a2a2a] text-[#b4c5ff] hover:text-white font-headline text-[12.5px] font-semibold transition-colors border border-[#434655]/60 cursor-pointer"
          >
            Edit Master Profile
          </button>
        </div>

        {/* ========================================================================= */}
        {/* SAVE PREFERENCES ACTION BAR */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-[#4edea3] text-[13px] font-semibold flex items-center gap-1.5 animate-fade-in">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Preferences saved successfully!</span>
            </span>
          ) : (
            <span className="text-[12px] text-[#8d90a0]">
              Settings apply immediately across all future tailoring workflows.
            </span>
          )}

          <button
            type="submit"
            id="btn-save-settings"
            className="px-6 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-headline text-[13.5px] font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] cursor-pointer active:scale-[0.98]"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsView;
