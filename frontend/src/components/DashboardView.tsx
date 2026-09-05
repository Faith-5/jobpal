import React, { useState, useEffect, useRef } from 'react';
import { ScreenType, UserProfile, JobApplication } from '../types';

interface DashboardViewProps {
  user: UserProfile;
  applications: JobApplication[];
  onNavigate: (screen: ScreenType) => void;
  onEditProfile?: () => void;
  onAnalyzeJob: (jobText: string) => void;
  onExportDocuments: () => void;
}

const ANALYSIS_MILESTONES = [
  {
    step: 1,
    title: 'Parsing Target Role Requirements',
    description: 'Extracting key competencies, technical qualifications, and core duties...',
    icon: 'manage_search',
  },
  {
    step: 2,
    title: 'Scanning 24 Standard ATS Filter Rules',
    description: 'Checking document layout, header taxonomy, and section parseability...',
    icon: 'rule',
  },
  {
    step: 3,
    title: 'Analyzing Keyword & Skill Gaps',
    description: 'Evaluating keyword density for high-priority hard & soft skills...',
    icon: 'key',
  },
  {
    step: 4,
    title: 'Formulating Quantifiable Impact Fixes',
    description: 'Detecting unquantified achievements and recommending actionable metrics...',
    icon: 'trending_up',
  },
  {
    step: 5,
    title: 'Finalizing Tailored ATS Compatibility Report',
    description: 'Calculating composite score and generating tailored improvements...',
    icon: 'auto_awesome',
  },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  applications,
  onNavigate,
  onAnalyzeJob,
  onExportDocuments,
}) => {
  const [jobInput, setJobInput] = useState(
    'Senior Product Designer at Acme Corp - Seeking an experienced designer with 5+ years of UX/UI systems, prototyping in Figma, WCAG accessibility, and data dashboard workflows.'
  );
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const timerRef = useRef<number | null>(null);

  // Analysis Milestone progression
  useEffect(() => {
    if (!isAnalyzing) {
      setCurrentMilestoneIndex(0);
      setProgressPercent(0);
      return;
    }

    const totalSteps = ANALYSIS_MILESTONES.length;
    const stepDuration = 600; // 600ms per step = 3.0s total

    const interval = window.setInterval(() => {
      setCurrentMilestoneIndex((prev) => {
        const next = prev + 1;
        if (next >= totalSteps) {
          window.clearInterval(interval);
          setProgressPercent(100);
          timerRef.current = window.setTimeout(() => {
            setIsAnalyzing(false);
            onAnalyzeJob(jobInput);
            onNavigate('ats-score');
          }, 500);
          return totalSteps - 1;
        }
        setProgressPercent(Math.round(((next + 1) / totalSteps) * 100));
        return next;
      });
    }, stepDuration);

    return () => {
      window.clearInterval(interval);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [isAnalyzing, jobInput, onAnalyzeJob, onNavigate]);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobInput.trim()) return;
    setIsAnalyzing(true);
    setCurrentMilestoneIndex(0);
    setProgressPercent(20);
  };

  const filteredApps = applications.filter((app) => {
    if (statusFilter === 'All') return true;
    return app.status === statusFilter;
  });

  const getStatusBadge = (status: JobApplication['status']) => {
    switch (status) {
      case 'Offer':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#007d55]/30 text-[#4edea3] border border-[#007d55]">
            Offer
          </span>
        );
      case 'Interviewing':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#2563eb]/20 text-[#b4c5ff] border border-[#2563eb]/50">
            Interviewing
          </span>
        );
      case 'Applied':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#3c4962]/40 text-[#c3c6d7] border border-[#434655]">
            Applied
          </span>
        );
      case 'Draft':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#353534] text-[#8d90a0] border border-[#434655]">
            Draft
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#353534] text-[#c3c6d7]">
            {status}
          </span>
        );
    }
  };

  return (
    <div id="dashboard-view" className="p-4 sm:p-6 md:p-8 max-w-[1240px] mx-auto space-y-6 sm:space-y-8 relative animate-fade-in">
      {/* Analyzing Milestone Overlay Modal */}
      {isAnalyzing && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div className="w-full max-w-xl bg-[#1c1b1b] border border-[#2563eb]/50 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(37,99,235,0.3)] space-y-6 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#2563eb]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#4edea3]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header with Radial Spinner & Percentage */}
            <div className="flex items-center gap-4 relative z-10">
              <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#353534"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#2563eb"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 20}
                    strokeDashoffset={2 * Math.PI * 20 * (1 - progressPercent / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-300 ease-out"
                  />
                </svg>
                <span className="absolute font-headline text-[12px] font-bold text-[#b4c5ff]">
                  {progressPercent}%
                </span>
              </div>

              <div>
                <h3 className="font-headline text-[19px] font-bold text-white flex items-center gap-2">
                  <span>AI Resume Engine Analyzing</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-[#4edea3] animate-ping" />
                </h3>
                <p className="font-body text-[13px] text-[#c3c6d7] mt-0.5">
                  Tailoring master profile against role specifications...
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#131313] h-2 rounded-full overflow-hidden border border-[#434655]/40 relative z-10">
              <div
                className="h-full bg-gradient-to-r from-[#2563eb] via-[#60a5fa] to-[#4edea3] transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Milestone List */}
            <div className="space-y-3 relative z-10">
              {ANALYSIS_MILESTONES.map((m, idx) => {
                const isDone = idx < currentMilestoneIndex || progressPercent === 100;
                const isCurrent = idx === currentMilestoneIndex && progressPercent < 100;

                return (
                  <div
                    key={m.step}
                    className={`flex items-start gap-3.5 p-3 rounded-xl transition-all duration-300 ${
                      isCurrent
                        ? 'bg-[#2563eb]/15 border border-[#2563eb]/40 text-white shadow-sm'
                        : isDone
                        ? 'bg-[#131313]/60 border border-[#007d55]/30 text-[#c3c6d7]'
                        : 'bg-[#131313]/30 border border-[#434655]/20 text-[#8d90a0] opacity-50'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isDone
                          ? 'bg-[#007d55]/30 text-[#4edea3]'
                          : isCurrent
                          ? 'bg-[#2563eb] text-white animate-pulse'
                          : 'bg-[#353534] text-[#8d90a0]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isDone ? 'check' : isCurrent ? 'hourglass_top' : m.icon}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-headline text-[13px] font-semibold ${
                            isCurrent
                              ? 'text-[#b4c5ff]'
                              : isDone
                              ? 'text-[#e5e2e1]'
                              : 'text-[#8d90a0]'
                          }`}
                        >
                          {m.title}
                        </span>
                        {isDone && (
                          <span className="text-[11px] font-headline font-semibold text-[#4edea3] uppercase tracking-wider">
                            Done
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[11px] font-headline font-semibold text-[#b4c5ff] animate-pulse uppercase tracking-wider">
                            In Progress...
                          </span>
                        )}
                      </div>
                      <p className="font-body text-[12px] text-[#8d90a0] mt-0.5 leading-tight">
                        {m.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline text-[26px] sm:text-[30px] font-bold text-[#e5e2e1] tracking-tight">
            Welcome back, {user.name.split(' ')[0]}.
          </h1>
          <p className="font-body text-[15px] text-[#c3c6d7]">
            Let&apos;s craft and optimize your next winning application.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-goto-profile"
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#434655]/60 text-[#c3c6d7] hover:text-white font-headline text-[13px] font-semibold transition-all cursor-pointer shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
            <span>Master Profile</span>
            <span className="material-symbols-outlined text-[16px] text-[#8d90a0]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* PRIMARY FIRST SECTION: Large Job Description Textbox & Action Bar */}
      <div className="bg-[#1c1b1b] border border-[#434655]/50 hover:border-[#2563eb]/50 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden transition-all">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2563eb]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2563eb]/20 border border-[#2563eb]/40 flex items-center justify-center text-[#b4c5ff]">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
            </div>
            <div>
              <h2 className="font-headline text-[18px] sm:text-[20px] font-bold text-[#e5e2e1]">
                Target Job Description
              </h2>
              <p className="font-body text-[13px] text-[#c3c6d7]">
                Paste a job description to tailor your CV and optimize your ATS score.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-4 relative z-10">
          <div className="relative">
            <textarea
              id="dashboard-job-input"
              rows={4}
              value={jobInput}
              onChange={(e) => setJobInput(e.target.value)}
              placeholder="Paste job description or requirements here..."
              className="w-full bg-[#131313]/90 border border-[#434655]/70 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/30 rounded-xl p-4 text-[#e5e2e1] text-[14px] leading-relaxed outline-none transition-all placeholder:text-[#8d90a0] resize-y min-h-[110px]"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-1">
            <div className="flex items-center gap-2 text-[12px] text-[#8d90a0] self-start sm:self-center">
              <span className="material-symbols-outlined text-[17px] text-[#4edea3]">
                verified
              </span>
              <span>
                Matching with <strong className="text-[#e5e2e1]">{user.name}</strong> Master Profile
              </span>
            </div>

            <button
              id="btn-analyze-job"
              type="submit"
              disabled={isAnalyzing || !jobInput.trim()}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-[0.98] text-white font-headline text-[14px] font-bold flex items-center justify-center gap-2.5 transition-all shadow-[0_0_25px_rgba(37,99,235,0.45)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              <span>Analyze & Tailor CV</span>
            </button>
          </div>
        </form>
      </div>

      {/* Recent Applications Section */}
      <div className="bg-[#1c1b1b] border border-[#434655]/40 rounded-2xl p-6 sm:p-7 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-headline text-[18px] font-bold text-[#e5e2e1]">
              Recent Job Applications
            </h3>
            <p className="font-body text-[13px] text-[#c3c6d7]">
              Tailored resumes and live application status tracking
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-[#131313] rounded-xl border border-[#434655]/40">
            {['All', 'Interviewing', 'Offer', 'Applied', 'Draft'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded-lg text-[12px] font-headline font-semibold transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-[#2563eb] text-white shadow-sm'
                    : 'text-[#8d90a0] hover:text-[#e5e2e1]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-3">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              onClick={() => onNavigate('applications')}
              className="p-4 rounded-xl bg-[#201f1f] border border-[#434655]/40 hover:border-[#8d90a0]/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#353534] border border-[#434655]/50 flex items-center justify-center font-headline font-bold text-[#b4c5ff] text-[15px] shrink-0">
                  {app.logoText}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h4 className="font-headline text-[15px] font-bold text-[#e5e2e1]">
                      {app.company}
                    </h4>
                    {getStatusBadge(app.status)}
                  </div>
                  <p className="font-body text-[13px] text-[#b4c5ff] font-medium mt-0.5">
                    {app.role} • <span className="text-[#8d90a0]">{app.location}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 self-end sm:self-center">
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-[11px] text-[#8d90a0] font-headline uppercase font-semibold">
                      ATS Match:
                    </span>
                    <span className="font-headline text-[14px] font-bold text-[#4edea3]">
                      {app.atsScore}%
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8d90a0]">Applied {app.appliedDate}</span>
                </div>
                <span className="material-symbols-outlined text-[#8d90a0] text-[18px]">
                  chevron_right
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
