import React, { useState } from "react";
import { ScreenType } from "../types";

interface OnboardingViewProps {
  onNavigate: (screen: ScreenType) => void;
  onUploadSuccess: (filename: string) => void;
}

type OnboardingFlow = "choose" | "upload" | "manual";
type ManualStep = 1 | 2 | 3;

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onNavigate,
  onUploadSuccess,
}) => {
  const [flow, setFlow] = useState<OnboardingFlow>("choose");
  const [manualStep, setManualStep] = useState<ManualStep>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Manual Form States
  const [role, setRole] = useState("Project Manager");
  const [summary, setSummary] = useState(
    "Detail-oriented Project Manager with experience planning project timelines, coordinating cross-functional teams, and optimizing workflows to deliver projects on time.",
  );
  const [company, setCompany] = useState("Apex Solutions");
  const [jobTitle, setJobTitle] = useState("Associate Project Manager");
  const [jobDates, setJobDates] = useState("2023 - Present");
  const [jobBullet, setJobBullet] = useState(
    "Coordinated project schedules for 3 client deliverables, reducing project launch delays by 20%.",
  );
  const [skills, setSkills] = useState(
    "Project Planning, Team Coordination, Microsoft Office, Agile Methodologies, Problem Solving",
  );
  const [projectTitle, setProjectTitle] = useState(
    "Operations Database Upgrade",
  );
  const [projectDesc, setProjectDesc] = useState(
    "Led the migration of the internal communication database to a new cloud system, training 40+ employees on new software protocols.",
  );

  // File Upload Handlers
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0].name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0].name);
    }
  };

  const processFile = (fileName: string) => {
    setIsProcessing(true);
    setUploadedFile(fileName);
    setTimeout(() => {
      setIsProcessing(false);
      onUploadSuccess(fileName);
    }, 1200);
  };

  // Submit Manual Flow
  const handleManualSubmit = () => {
    onNavigate("dashboard");
  };

  // Pre-fill form with general-purpose business/operations sample data
  const loadSampleData = () => {
    setRole("Operations Associate");
    setSummary(
      "Motivated operations professional with 3+ years of experience analyzing operational data, managing logistics schedules, and coordinating customer support operations.",
    );
    setCompany("Global Logistics Corp");
    setJobTitle("Operations Coordinator");
    setJobDates("2021 - 2024");
    setJobBullet(
      "Improved supply chain dispatch efficiency by 15% through route analysis and coordinating driver dispatch schedules.",
    );
    setSkills(
      "Operations Coordination, Data Analysis, Logistics, Customer Service, Team Collaboration",
    );
    setProjectTitle("Fleet Tracking Migration");
    setProjectDesc(
      "Successfully implemented new tracking devices for 50 vehicles, managing scheduling and system training for the operations team.",
    );
  };

  return (
    <div
      id="onboarding-screen"
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0B0F19] text-[#E2E8F0] font-body relative overflow-y-auto"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center max-w-xl mb-6 relative z-10">
        <button
          onClick={() => onNavigate("landing")}
          className="inline-flex items-center gap-2 mb-3 group cursor-pointer"
        >
          <img
            src="/logo.svg"
            alt=""
            className="w-8 h-8 rounded-lg group-hover:scale-105 transition-transform"
          />
          <span className="font-headline text-[22px] font-bold text-[#93C5FD]">
            JobPal
          </span>
        </button>
        <h1 className="font-headline text-[32px] sm:text-[38px] font-bold text-white mb-2 tracking-tight">
          Let's build your profile
        </h1>
        <p className="font-body text-[15px] text-[#94A3B8]">
          Choose the best way to get started. You can always change these
          details later.
        </p>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-xl bg-[#0F172A] border border-[#1E293B]/70 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 transition-all duration-300">
        {/* Progress Bar (Visible during manual steps) */}
        {flow === "manual" && (
          <div className="w-full bg-[#0B0F19] h-1.5 rounded-full mb-6 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${(manualStep / 3) * 100}%` }}
            />
          </div>
        )}

        {/* FLOW SELECTOR PANEL */}
        {flow === "choose" && (
          <div className="space-y-4">
            {/* Option 1: Upload CV */}
            <button
              onClick={() => setFlow("upload")}
              className="w-full text-left bg-[#0B0F19]/40 border border-[#1E293B] hover:border-blue-500/50 hover:bg-[#1E293B]/20 p-5 rounded-xl flex items-center gap-4 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-[#38BDF8] flex-shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">
                  cloud_upload
                </span>
              </div>
              <div className="flex-grow">
                <h3 className="text-[16px] font-bold text-white mb-1">
                  Upload my existing CV
                </h3>
                <p className="text-[13px] text-[#94A3B8]">
                  We will parse your PDF or Word document and extract your
                  history.
                </p>
              </div>
            </button>

            {/* Option 2: Fill Manually */}
            <button
              onClick={() => setFlow("manual")}
              className="w-full text-left bg-[#0B0F19]/40 border border-[#1E293B] hover:border-blue-500/50 hover:bg-[#1E293B]/20 p-5 rounded-xl flex items-center gap-4 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-emerald-600/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">
                  edit_note
                </span>
              </div>
              <div className="flex-grow">
                <h3 className="text-[16px] font-bold text-white mb-1">
                  Create profile manually
                </h3>
                <p className="text-[13px] text-[#94A3B8]">
                  Don't have a CV on hand? Fill in your key details
                  step-by-step.
                </p>
              </div>
            </button>

            {/* Option 3: Skip Onboarding */}
            <button
              onClick={() => onNavigate("dashboard")}
              className="w-full text-left bg-[#0B0F19]/40 border border-[#1E293B] hover:border-blue-500/50 hover:bg-[#1E293B]/20 p-5 rounded-xl flex items-center gap-4 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">
                  arrow_forward
                </span>
              </div>
              <div className="flex-grow">
                <h3 className="text-[16px] font-bold text-white mb-1">
                  Skip onboarding for now
                </h3>
                <p className="text-[13px] text-[#94A3B8]">
                  Go straight to your dashboard. You can add or update your
                  qualifications later.
                </p>
              </div>
            </button>

            {/* In-box Hint Note */}
            <div className="border-t border-[#1E293B] pt-4 mt-2 text-center">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Short on time? No worries. You can skip onboarding now and fill
                or update your qualifications inside your profile dashboard
                anytime.
              </p>
            </div>
          </div>
        )}

        {/* UPLOAD FLOW */}
        {flow === "upload" && (
          <div className="space-y-4">
            <div
              id="dropzone-cv"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                isDragging
                  ? "border-blue-400 bg-blue-600/10 scale-[1.01]"
                  : "border-[#1E293B] hover:border-slate-500 hover:bg-[#1E293B]/20"
              }`}
              onClick={() => document.getElementById("cv-file-input")?.click()}
            >
              <input
                id="cv-file-input"
                type="file"
                accept=".pdf,.docx,.doc"
                className="hidden"
                onChange={handleFileSelect}
              />

              {isProcessing ? (
                <div className="flex flex-col items-center py-4">
                  <span className="material-symbols-outlined text-[40px] text-blue-400 animate-spin mb-3">
                    progress_activity
                  </span>
                  <p className="font-headline text-[15px] font-semibold text-white">
                    Parsing & Extracting details...
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-[#1E293B] flex items-center justify-center mb-3 text-[#93C5FD]">
                    <span className="material-symbols-outlined text-[28px]">
                      cloud_upload
                    </span>
                  </div>
                  <h3 className="font-headline text-[17px] font-semibold text-white mb-1">
                    Upload your CV
                  </h3>
                  <p className="font-body text-[13px] text-[#94A3B8] mb-1">
                    Drag & drop here or{" "}
                    <span className="text-[#93C5FD] underline font-medium">
                      browse
                    </span>
                  </p>
                  <span className="text-[11px] text-slate-500">
                    PDF, DOCX up to 10MB
                  </span>
                </>
              )}
            </div>

            <div className="flex justify-start items-center pt-2">
              <button
                onClick={() => setFlow("choose")}
                className="text-[13px] text-[#94A3B8] hover:text-white font-medium cursor-pointer flex items-center gap-1"
              >
                <span>← Back to options</span>
              </button>
            </div>
          </div>
        )}

        {/* MANUAL FLOW (General-purpose step-by-step layout) */}
        {flow === "manual" && (
          <div className="space-y-4">
            {/* STEP 1: TARGET ROLE & OBJECTIVE SUMMARY */}
            {manualStep === 1 && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-headline text-[13px] font-semibold text-[#94A3B8]">
                      What role or title are you targeting?
                    </label>
                    <button
                      type="button"
                      onClick={loadSampleData}
                      className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        bolt
                      </span>
                      Fill with sample data
                    </button>
                  </div>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Project Manager, Operations Coordinator..."
                    className="w-full bg-[#0B0F19]/60 border border-[#1E293B] rounded-xl px-4 py-2.5 text-white text-[14px] outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-headline text-[13px] font-semibold text-[#94A3B8] mb-1.5">
                    Professional Objective & Summary
                  </label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={4}
                    placeholder="Briefly describe your objectives, key skills, or core professional focus..."
                    className="w-full bg-[#0B0F19]/60 border border-[#1E293B] rounded-xl px-4 py-2.5 text-white text-[14px] outline-none focus:border-blue-500 resize-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: GENERAL EXPERIENCE (PROFESSIONAL / LEADERSHIP) */}
            {manualStep === 2 && (
              <div className="space-y-4">
                <span className="text-[11px] text-slate-500 block uppercase font-bold tracking-wider mb-2">
                  Key Experience (Work, Leadership, or Project Role)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-headline text-[12px] text-[#94A3B8] mb-1">
                      Organization / Company / School
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Apex Solutions, University..."
                      className="w-full bg-[#0B0F19]/60 border border-[#1E293B] rounded-xl px-3 py-2 text-white text-[13px] outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-headline text-[12px] text-[#94A3B8] mb-1">
                      Role / Title
                    </label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Coordinator, Associate, Lead..."
                      className="w-full bg-[#0B0F19]/60 border border-[#1E293B] rounded-xl px-3 py-2 text-white text-[13px] outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-headline text-[12px] text-[#94A3B8] mb-1">
                    Dates Active / Timeline
                  </label>
                  <input
                    type="text"
                    value={jobDates}
                    onChange={(e) => setJobDates(e.target.value)}
                    placeholder="e.g. Jan 2023 - Present"
                    className="w-full bg-[#0B0F19]/60 border border-[#1E293B] rounded-xl px-3 py-2 text-white text-[13px] outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-headline text-[12px] text-[#94A3B8] mb-1">
                    Key Achievement / Major Responsibility
                  </label>
                  <textarea
                    value={jobBullet}
                    onChange={(e) => setJobBullet(e.target.value)}
                    rows={3}
                    placeholder="Describe a key achievement or the positive impact you made..."
                    className="w-full bg-[#0B0F19]/60 border border-[#1E293B] rounded-xl px-3 py-2 text-white text-[13px] outline-none focus:border-blue-500 resize-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: SKILLS & HIGHLIGHT PROJECT */}
            {manualStep === 3 && (
              <div className="space-y-4">
                <span className="text-[11px] text-slate-500 block uppercase font-bold tracking-wider mb-2">
                  Skills & Highlight Project
                </span>
                <div>
                  <label className="block font-headline text-[12px] text-[#94A3B8] mb-1">
                    Core Skills & Strengths (separated by commas)
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. Project Planning, Team Coordination, Microsoft Office"
                    className="w-full bg-[#0B0F19]/60 border border-[#1E293B] rounded-xl px-3 py-2 text-white text-[13px] outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-headline text-[12px] text-[#94A3B8] mb-1">
                    Highlight Project / Campaign Title
                  </label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Operations Database Upgrade..."
                    className="w-full bg-[#0B0F19]/60 border border-[#1E293B] rounded-xl px-3 py-2 text-white text-[13px] outline-none focus:border-blue-500 mb-3"
                  />
                </div>
                <div>
                  <label className="block font-headline text-[12px] text-[#94A3B8] mb-1">
                    Project Achievements & Description
                  </label>
                  <textarea
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    rows={2}
                    placeholder="Detail your contribution and outcomes for this project..."
                    className="w-full bg-[#0B0F19]/60 border border-[#1E293B] rounded-xl px-3 py-2 text-white text-[13px] outline-none focus:border-blue-500 resize-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* STEP NAVIGATION BUTTONS */}
            <div className="flex justify-between items-center pt-4 border-t border-[#1E293B]/70">
              <button
                type="button"
                onClick={() => {
                  if (manualStep === 1) {
                    setFlow("choose");
                  } else {
                    setManualStep((prev) => (prev - 1) as any);
                  }
                }}
                className="text-[13px] text-[#94A3B8] hover:text-white font-medium cursor-pointer"
              >
                ← Back
              </button>

              <div className="flex gap-2">
                {manualStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setManualStep((prev) => (prev + 1) as any)}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-headline text-[13px] font-semibold rounded-xl cursor-pointer"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleManualSubmit}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-headline text-[13px] font-semibold rounded-xl cursor-pointer shadow-[0_4px_15px_rgba(37,99,235,0.25)]"
                  >
                    Generate CV & Finish
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingView;
