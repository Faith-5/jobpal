import React, { useState } from 'react';
import { ScreenType, CoverLetterData } from '../types';

interface CoverLetterViewProps {
  coverLetter: CoverLetterData;
  onNavigate: (screen: ScreenType) => void;
  onUpdateCoverLetter: (data: CoverLetterData) => void;
  onDownload: () => void;
}

export const CoverLetterView: React.FC<CoverLetterViewProps> = ({
  coverLetter,
  onNavigate,
  onUpdateCoverLetter,
  onDownload,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CoverLetterData>(coverLetter);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeSuggestionModal, setActiveSuggestionModal] = useState<string | null>(null);

  const handleParagraphChange = (index: number, val: string) => {
    const nextParas = [...formData.paragraphs];
    nextParas[index] = val;
    const updated = { ...formData, paragraphs: nextParas };
    setFormData(updated);
    onUpdateCoverLetter(updated);
  };

  const handleSaveContent = () => {
    setIsEditing(false);
    onUpdateCoverLetter(formData);
  };

  const applyAlternateOpening = (newText: string) => {
    handleParagraphChange(0, newText);
    setActiveSuggestionModal(null);
  };

  return (
    <div id="cover-letter-screen" className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => onNavigate('ats-score')}
              className="text-[#8d90a0] hover:text-[#e5e2e1] transition-colors p-1 -ml-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <h1 className="font-headline text-[26px] sm:text-[30px] font-bold text-[#e5e2e1] tracking-tight">
              Tailored Cover Letter
            </h1>
          </div>
          <p className="font-body text-[15px] text-[#c3c6d7]">
            Generated for <span className="text-[#b4c5ff] font-semibold">{formData.companyName}</span> •{' '}
            <span>{formData.applicantTitle}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-toggle-edit-cover-letter"
            onClick={() => {
              if (isEditing) {
                handleSaveContent();
              } else {
                setIsEditing(true);
              }
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-headline text-[13px] font-semibold transition-all cursor-pointer shadow-sm ${
              isEditing
                ? 'bg-[#4edea3] text-[#003824] hover:brightness-105'
                : 'bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#434655]/60 text-[#c3c6d7] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isEditing ? 'check' : 'edit_document'}
            </span>
            <span>{isEditing ? 'Save Edits' : 'Edit Content'}</span>
          </button>
          <button
            id="btn-download-cover-letter"
            onClick={onDownload}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-headline text-[13px] font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.35)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Document Viewer on Left (7 cols), Side Insights on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Printable Document Sheet */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* Zoom & Document Toolbar */}
          <div className="w-full flex items-center justify-between bg-[#1c1b1b] border border-[#434655]/40 rounded-t-xl px-4 py-2 text-[13px] text-[#c3c6d7]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#4edea3]">
                verified
              </span>
              <span className="font-headline font-semibold text-[#e5e2e1]">
                Cover_Letter_AcmeCorp.pdf
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel(Math.max(75, zoomLevel - 10))}
                className="w-7 h-7 rounded hover:bg-[#353534] flex items-center justify-center text-[#c3c6d7]"
                title="Zoom Out"
              >
                <span className="material-symbols-outlined text-[16px]">remove</span>
              </button>
              <span className="font-mono text-[12px] w-12 text-center">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(125, zoomLevel + 10))}
                className="w-7 h-7 rounded hover:bg-[#353534] flex items-center justify-center text-[#c3c6d7]"
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>
          </div>

          {/* Paper Sheet Simulator */}
          <div className="w-full overflow-x-auto bg-[#0e0e0e] border-x border-b border-[#434655]/40 rounded-b-xl p-4 sm:p-8 flex justify-center shadow-2xl">
            <div
              id="printable-cover-letter-paper"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="w-full max-w-[620px] bg-white text-[#1c1b1b] rounded-md p-8 sm:p-12 shadow-2xl font-sans transition-transform duration-200 selection:bg-[#b4c5ff] selection:text-[#002a78]"
            >
              {/* Letterhead */}
              <div className="border-b-2 border-gray-900 pb-4 mb-6">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.applicantName}
                      onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                      className="w-full font-bold text-2xl tracking-wider text-gray-900 border-b border-gray-300 outline-none uppercase"
                    />
                    <input
                      type="text"
                      value={formData.applicantTitle}
                      onChange={(e) => setFormData({ ...formData, applicantTitle: e.target.value })}
                      className="w-full text-sm font-semibold text-gray-600 border-b border-gray-300 outline-none"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="font-bold text-2xl tracking-wider text-gray-900 uppercase">
                      {formData.applicantName}
                    </h2>
                    <p className="text-sm font-semibold text-gray-600">
                      {formData.applicantTitle}
                    </p>
                  </>
                )}

                <div className="text-[12px] text-gray-500 mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  <span>{formData.email}</span>
                  <span>•</span>
                  <span>{formData.phone}</span>
                  <span>•</span>
                  <span>{formData.location}</span>
                  <span>•</span>
                  <span>{formData.linkedin}</span>
                </div>
              </div>

              {/* Date & Recipient */}
              <div className="text-xs text-gray-700 mb-6 space-y-1">
                <p className="font-medium">{formData.date}</p>
                <div className="pt-2">
                  <p className="font-semibold text-gray-900">{formData.hiringManager}</p>
                  <p>{formData.companyName}</p>
                  <p>{formData.companyAddress}</p>
                  <p>{formData.cityStateZip}</p>
                </div>
              </div>

              {/* Salutation */}
              <p className="text-xs font-semibold text-gray-900 mb-4">
                Dear {formData.hiringManager},
              </p>

              {/* Paragraphs */}
              <div className="space-y-4 text-xs text-gray-800 leading-relaxed text-justify">
                {formData.paragraphs.map((para, idx) => (
                  <div key={idx}>
                    {isEditing ? (
                      <textarea
                        rows={4}
                        value={para}
                        onChange={(e) => handleParagraphChange(idx, e.target.value)}
                        className="w-full p-2 border border-blue-400 rounded text-xs leading-relaxed text-gray-900 bg-blue-50/20 outline-none"
                      />
                    ) : (
                      <p>{para}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Sign-off */}
              <div className="mt-8 text-xs text-gray-800 space-y-1">
                <p>Sincerely,</p>
                <div className="pt-6 font-bold text-gray-900 text-sm">
                  {formData.signatureName}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Match Analysis & AI Enhancements */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Match Analysis */}
          <div className="bg-[#1c1b1b] border border-[#434655]/40 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4edea3] text-[22px]">
                  analytics
                </span>
                <h3 className="font-headline text-[18px] font-bold text-[#e5e2e1]">
                  Match Analysis
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#007d55]/30 text-[#4edea3] font-headline text-[13px] font-bold border border-[#007d55]">
                90% Excellent Fit
              </span>
            </div>

            <div className="space-y-3 font-body text-[13px]">
              <div className="flex justify-between items-center py-2 border-b border-[#434655]/30">
                <span className="text-[#c3c6d7]">Target Keywords Found</span>
                <span className="font-headline font-bold text-[#e5e2e1]">12 / 15</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#434655]/30">
                <span className="text-[#c3c6d7]">Tone & Voice Alignment</span>
                <span className="font-headline font-bold text-[#4edea3]">
                  Professional & Confident
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#434655]/30">
                <span className="text-[#c3c6d7]">Company Customization</span>
                <span className="font-headline font-bold text-[#b4c5ff]">
                  High (Specific to Acme Corp)
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: AI Enhancements */}
          <div className="bg-[#1c1b1b] border border-[#434655]/40 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-[#b4c5ff] text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
                <h3 className="font-headline text-[18px] font-bold text-[#e5e2e1]">
                  AI Enhancements Applied
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-[#201f1f] border border-[#434655]/40 rounded-xl p-3.5 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#4edea3] text-[18px] mt-0.5 shrink-0">
                  check_circle
                </span>
                <div>
                  <h4 className="font-headline text-[14px] font-semibold text-[#e5e2e1]">
                    Emphasized SaaS design experience
                  </h4>
                  <p className="font-body text-[12px] text-[#c3c6d7] mt-0.5">
                    Prioritized enterprise metrics in Paragraph 1 to match Acme Corp&apos;s lead requirements.
                  </p>
                </div>
              </div>

              <div className="bg-[#201f1f] border border-[#434655]/40 rounded-xl p-3.5 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#4edea3] text-[18px] mt-0.5 shrink-0">
                  check_circle
                </span>
                <div>
                  <h4 className="font-headline text-[14px] font-semibold text-[#e5e2e1]">
                    Highlighted 40% onboarding reduction
                  </h4>
                  <p className="font-body text-[12px] text-[#c3c6d7] mt-0.5">
                    Included verified outcome numbers to build credibility with hiring managers.
                  </p>
                </div>
              </div>

              <div className="bg-[#201f1f] border border-[#434655]/40 rounded-xl p-3.5 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#4edea3] text-[18px] mt-0.5 shrink-0">
                  check_circle
                </span>
                <div>
                  <h4 className="font-headline text-[14px] font-semibold text-[#e5e2e1]">
                    Direct WCAG & Accessibility Alignment
                  </h4>
                  <p className="font-body text-[12px] text-[#c3c6d7] mt-0.5">
                    Referenced Acme Corp&apos;s published commitment to inclusive design.
                  </p>
                </div>
              </div>
            </div>

            {/* Alternate Openers Generator */}
            <div className="pt-3 border-t border-[#434655]/30">
              <button
                onClick={() => setActiveSuggestionModal('openers')}
                className="w-full py-2.5 rounded-xl bg-[#353534]/70 hover:bg-[#353534] text-[#b4c5ff] font-headline text-[13px] font-semibold transition-colors border border-[#434655]/50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">cached</span>
                <span>Generate Alternative Openings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alternative Openers Modal */}
      {activeSuggestionModal === 'openers' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#1c1b1b] border border-[#434655] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#b4c5ff]">auto_awesome</span>
                <h3 className="font-headline text-[18px] font-bold text-[#e5e2e1]">
                  Choose an Opening Hook
                </h3>
              </div>
              <button
                onClick={() => setActiveSuggestionModal(null)}
                className="text-[#8d90a0] hover:text-white p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div
                onClick={() =>
                  applyAlternateOpening(
                    'As a Senior Product Designer with eight years of experience building scalable SaaS products that reduced onboarding drop-off by 40%, I was thrilled to see Acme Corp expanding its core design team.'
                  )
                }
                className="p-4 rounded-xl bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#434655]/50 hover:border-[#b4c5ff] transition-all cursor-pointer"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4edea3]">
                  Option A • High-Impact Metric Focus
                </span>
                <p className="text-[13px] text-[#e5e2e1] mt-1">
                  &ldquo;As a Senior Product Designer with eight years of experience building scalable SaaS products that reduced onboarding drop-off by 40%, I was thrilled to see Acme Corp expanding its core design team.&rdquo;
                </p>
              </div>

              <div
                onClick={() =>
                  applyAlternateOpening(
                    'With a deep passion for human-centered design systems and a track record of driving 25% user growth through intuitive enterprise interfaces, I am eager to apply for the Senior Product Designer role at Acme Corp.'
                  )
                }
                className="p-4 rounded-xl bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#434655]/50 hover:border-[#b4c5ff] transition-all cursor-pointer"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#b4c5ff]">
                  Option B • Design Philosophy Focus
                </span>
                <p className="text-[13px] text-[#e5e2e1] mt-1">
                  &ldquo;With a deep passion for human-centered design systems and a track record of driving 25% user growth through intuitive enterprise interfaces, I am eager to apply for the Senior Product Designer role at Acme Corp.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
