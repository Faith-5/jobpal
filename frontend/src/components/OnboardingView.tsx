import React, { useState } from "react";
import { ScreenType, ParsedCareerProfile } from "../types";
import { parseResumeFile } from "../services/api";

interface OnboardingViewProps {
  onNavigate: (screen: ScreenType) => void;
  onUploadSuccess: (filename: string) => void;
  onParsedProfileReady?: (parsed: ParsedCareerProfile) => void;
}

type OnboardingFlow = "choose" | "upload" | "manual";
type ManualStep = 1 | 2 | 3;

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onNavigate,
  onUploadSuccess,
  onParsedProfileReady,
}) => {
  const [flow, setFlow] = useState<OnboardingFlow>("choose");
  const [manualStep, setManualStep] = useState<ManualStep>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<number>(1);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Manual Form States
  const [role, setRole] = useState("Product Manager");
  const [summary, setSummary] = useState(
    "Detail-oriented professional with experience planning project timelines, coordinating cross-functional teams, and optimizing workflows to deliver projects on time."
  );
  const [company, setCompany] = useState("Apex Solutions");
  const [jobTitle, setJobTitle] = useState("Associate Project Manager");
  const [jobDates, setJobDates] = useState("2023 - Present");
  const [jobBullet, setJobBullet] = useState(
    "Coordinated project schedules for client deliverables, reducing project launch delays by 20%."
  );
  const [skills, setSkills] = useState(
    "Project Planning, Team Coordination, Agile Methodologies, Problem Solving, Product Strategy"
  );
  const [projectTitle, setProjectTitle] = useState("Operations Optimization");
  const [projectDesc, setProjectDesc] = useState(
    "Led internal process improvements resulting in 15% faster workflow execution across teams."
  );

  // Real File Upload & AI Engine Extraction Handler
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleRealCvUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleRealCvUpload(e.target.files[0]);
    }
  };

  const handleRealCvUpload = async (file: File) => {
    setIsProcessing(true);
    setUploadError(null);
    setUploadedFileName(file.name);
    setProcessingStage(1); // Reading document

    const stageTimer1 = setTimeout(() => {
      setProcessingStage(2); // Groq LLaMA 70B extraction
    }, 600);

    const stageTimer2 = setTimeout(() => {
      setProcessingStage(3); // Structuring profile
    }, 1500);

    try {
      const response = await parseResumeFile(file);
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      setProcessingStage(3);

      setTimeout(() => {
        setIsProcessing(false);
        onUploadSuccess(file.name);
        if (onParsedProfileReady && response.profile) {
          onParsedProfileReady(response.profile);
        }
      }, 500);

    } catch (err: any) {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      setIsProcessing(false);
      setUploadError(err.message || "Failed to process resume. Please ensure the file is a valid PDF or DOCX.");
    }
  };

  // Submit Manual Flow
  const handleManualSubmit = () => {
    onNavigate("dashboard");
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
          Choose the best way to get started. You can always change these details later.
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
              className="w-full text-left bg-[#0B0F19]/60 border border-blue-500/30 hover:border-blue-500 hover:bg-[#1E293B]/40 p-5 rounded-xl flex items-center gap-4 transition-all group cursor-pointer shadow-lg shadow-blue-950/30"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-[#38BDF8] flex-shrink-0 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[26px]">
                  cloud_upload
                </span>
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[16px] font-bold text-white">
                    Upload my existing CV
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    AI Automated
                  </span>
                </div>
                <p className="text-[13px] text-[#94A3B8]">
                  We will parse your PDF or Word document and extract your history.
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
                  Don't have a CV on hand? Fill in your key details step-by-step.
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
                  Go straight to your dashboard. You can add or update your qualifications later.
                </p>
              </div>
            </button>
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
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                isDragging
                  ? "border-blue-400 bg-blue-600/15 scale-[1.01]"
                  : "border-[#1E293B] hover:border-blue-500/60 bg-[#0B0F19]/40 hover:bg-[#1E293B]/20"
              }`}
              onClick={() => {
                if (!isProcessing) {
                  document.getElementById("cv-file-input")?.click();
                }
              }}
            >
              <input
                id="cv-file-input"
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                className="hidden"
                onChange={handleFileSelect}
                disabled={isProcessing}
              />

              {isProcessing ? (
                <div className="flex flex-col items-center py-6 space-y-4 max-w-sm">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[44px] text-blue-400 animate-spin">
                      progress_activity
                    </span>
                  </div>

                  <div className="space-y-2 text-center">
                    <h4 className="font-headline text-[17px] font-bold text-white">
                      {processingStage === 1 && "Extracting Document Content..."}
                      {processingStage === 2 && "AI Analyzing Career History..."}
                      {processingStage === 3 && "Building Master Profile..."}
                    </h4>

                    <p className="text-[13px] text-blue-300 font-mono animate-pulse">
                      {processingStage === 1 && `Reading text from ${uploadedFileName || "resume"}...`}
                      {processingStage === 2 && "Groq LLaMA 70B classifying skills, experience & metrics..."}
                      {processingStage === 3 && "Finalizing normalized career schema..."}
                    </p>
                  </div>

                  {/* Step Indicators */}
                  <div className="flex items-center gap-2 pt-2">
                    <span className={`w-2.5 h-2.5 rounded-full transition-all ${processingStage >= 1 ? "bg-blue-400 shadow-md shadow-blue-400/50 scale-110" : "bg-slate-700"}`} />
                    <span className={`w-6 h-0.5 transition-all ${processingStage >= 2 ? "bg-blue-400" : "bg-slate-800"}`} />
                    <span className={`w-2.5 h-2.5 rounded-full transition-all ${processingStage >= 2 ? "bg-blue-400 shadow-md shadow-blue-400/50 scale-110" : "bg-slate-700"}`} />
                    <span className={`w-6 h-0.5 transition-all ${processingStage >= 3 ? "bg-blue-400" : "bg-slate-800"}`} />
                    <span className={`w-2.5 h-2.5 rounded-full transition-all ${processingStage >= 3 ? "bg-emerald-400 shadow-md shadow-emerald-400/50 scale-110" : "bg-slate-700"}`} />
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mb-4 text-[#93C5FD]">
                    <span className="material-symbols-outlined text-[32px]">
                      cloud_upload
                    </span>
                  </div>
                  <h3 className="font-headline text-[18px] font-semibold text-white mb-1.5">
                    Upload your CV
                  </h3>
                  <p className="font-body text-[13px] text-[#94A3B8] mb-2">
                    Drag & drop here or{" "}
                    <span className="text-[#93C5FD] underline font-medium">
                      browse files
                    </span>
                  </p>
                  <span className="text-[11px] text-slate-500 font-mono">
                    PDF, DOCX, DOC up to 10MB
                  </span>
                </>
              )}
            </div>

            {uploadError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[13px] flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] flex-shrink-0">error</span>
                <span className="flex-1">{uploadError}</span>
              </div>
            )}

            <div className="flex justify-start items-center pt-2">
              <button
                type="button"
                onClick={() => setFlow("choose")}
                disabled={isProcessing}
                className="text-[13px] text-[#94A3B8] hover:text-white font-medium cursor-pointer flex items-center gap-1 disabled:opacity-50"
              >
                <span>← Back to options</span>
              </button>
            </div>
          </div>
        )}

        {/* MANUAL FLOW */}
        {flow === "manual" && (
          <div className="space-y-4">
            
            {/* STEP 1: TARGET ROLE & OBJECTIVE SUMMARY */}
            {manualStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block font-headline text-[13px] font-semibold text-[#94A3B8] mb-1.5">
                    What role or title are you targeting?
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Senior Software Engineer, Product Designer..."
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

            {/* STEP 2: EXPERIENCE */}
            {manualStep === 2 && (
              <div className="space-y-4">
                <span className="text-[11px] text-slate-500 block uppercase font-bold tracking-wider mb-2">
                  Key Experience (Work, Leadership, or Project Role)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-headline text-[12px] text-[#94A3B8] mb-1">
                      Organization / Company
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Acme Corp..."
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
                      placeholder="e.g. Lead Engineer..."
                      className="w-full bg-[#0B0F19]/60 border border-[#1E293B] rounded-xl px-3 py-2 text-white text-[13px] outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-headline text-[12px] text-[#94A3B8] mb-1">
                    Dates
                  </label>
                  <input
                    type="text"
                    value={jobDates}
                    onChange={(e) => setJobDates(e.target.value)}
                    placeholder="e.g. 2022 - Present"
                    className="w-full bg-[#0B0F19]/60 border border-[#1E293B] rounded-xl px-3 py-2 text-white text-[13px] outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-headline text-[12px] text-[#94A3B8] mb-1">
                    Key Achievement Bullet Point
                  </label>
                  <textarea
                    value={jobBullet}
                    onChange={(e) => setJobBullet(e.target.value)}
                    rows={2}
                    placeholder="Describe a key accomplishment with metrics..."
                    className="w-full bg-[#0B0F19]/60 border border-[#1E293B] rounded-xl px-3 py-2 text-white text-[13px] outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: SKILLS & FEATURED PROJECT */}
            {manualStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block font-headline text-[12px] text-[#94A3B8] mb-1">
                    Key Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. TypeScript, React, System Design, Communication..."
                    className="w-full bg-[#0B0F19]/60 border border-[#1E293B] rounded-xl px-3 py-2 text-white text-[13px] outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-2 border-t border-[#1E293B]">
                  <span className="text-[11px] text-slate-500 block uppercase font-bold tracking-wider mb-2">
                    Featured Project or Case Study (Optional)
                  </span>
                  <div className="space-y-3">
                    <div>
                      <label className="block font-headline text-[12px] text-[#94A3B8] mb-1">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="e.g. Cloud Infrastructure Migration"
                        className="w-full bg-[#0B0F19]/60 border border-[#1E293B] rounded-xl px-3 py-2 text-white text-[13px] outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block font-headline text-[12px] text-[#94A3B8] mb-1">
                        Project Summary
                      </label>
                      <textarea
                        value={projectDesc}
                        onChange={(e) => setProjectDesc(e.target.value)}
                        rows={2}
                        placeholder="Brief summary of what was accomplished..."
                        className="w-full bg-[#0B0F19]/60 border border-[#1E293B] rounded-xl px-3 py-2 text-white text-[13px] outline-none focus:border-blue-500 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Manual navigation buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-[#1E293B]">
              <button
                type="button"
                onClick={() => {
                  if (manualStep > 1) {
                    setManualStep((prev) => (prev - 1) as ManualStep);
                  } else {
                    setFlow("choose");
                  }
                }}
                className="text-[13px] text-[#94A3B8] hover:text-white font-medium cursor-pointer"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => {
                  if (manualStep < 3) {
                    setManualStep((prev) => (prev + 1) as ManualStep);
                  } else {
                    handleManualSubmit();
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-headline text-[13px] font-semibold transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                {manualStep < 3 ? "Next Step →" : "Complete Profile"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
