import React, { useState } from 'react';
import { ScreenType, TailoredCvData } from '../types';

interface TailoredCvViewProps {
  cvData: TailoredCvData;
  onNavigate: (screen: ScreenType) => void;
  onUpdateCv: (data: TailoredCvData) => void;
  onDownload: () => void;
}

export const TailoredCvView: React.FC<TailoredCvViewProps> = ({
  cvData,
  onNavigate,
  onUpdateCv,
  onDownload,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<TailoredCvData>(cvData);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeTab, setActiveTab] = useState<'preview' | 'keywords'>('preview');

  const handleFieldChange = (field: keyof TailoredCvData, val: any) => {
    const updated = { ...formData, [field]: val };
    setFormData(updated);
    onUpdateCv(updated);
  };

  const handleExperienceBulletChange = (expIndex: number, bulletIndex: number, val: string) => {
    const nextExp = [...formData.experiences];
    nextExp[expIndex].bullets[bulletIndex] = val;
    const updated = { ...formData, experiences: nextExp };
    setFormData(updated);
    onUpdateCv(updated);
  };

  const handleSaveEdits = () => {
    setIsEditing(false);
    onUpdateCv(formData);
  };

  return (
    <div id="tailored-cv-screen" className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => onNavigate('ats-score')}
              className="text-[#8d90a0] hover:text-[#e5e2e1] transition-colors p-1 -ml-1 cursor-pointer"
              aria-label="Back to ATS Analysis"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <h1 className="font-headline text-[22px] sm:text-[28px] font-bold text-[#e5e2e1] tracking-tight">
              Tailored Resume / CV
            </h1>
          </div>
          <p className="font-body text-[13.5px] sm:text-[15px] text-[#c3c6d7]">
            Optimized for <span className="text-[#b4c5ff] font-semibold">{formData.role}</span> • Target: Acme Corp
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            id="btn-toggle-edit-cv"
            onClick={() => {
              if (isEditing) {
                handleSaveEdits();
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
            <span>{isEditing ? 'Save CV Edits' : 'Edit CV Content'}</span>
          </button>

          <button
            id="btn-goto-cover-letter"
            onClick={() => onNavigate('cover-letter')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#434655]/60 text-[#c3c6d7] hover:text-white font-headline text-[13px] font-semibold transition-all cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">mail</span>
            <span>Cover Letter</span>
          </button>

          <button
            id="btn-download-cv-pdf"
            onClick={onDownload}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-headline text-[13px] font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.35)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Document Sheet (7 cols) + AI Insights Panel (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Document Sheet Viewer */}
        <div className="lg:col-span-8 flex flex-col items-center">
          {/* Zoom & Document Toolbar */}
          <div className="w-full flex items-center justify-between bg-[#1c1b1b] border border-[#434655]/40 rounded-t-xl px-4 py-2.5 text-[13px] text-[#c3c6d7]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#4edea3]">
                verified
              </span>
              <span className="font-headline font-semibold text-[#e5e2e1]">
                Sarah_Jenkins_AcmeCorp_Tailored_CV.pdf
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#007d55]/30 text-[#4edea3] text-[11px] font-bold border border-[#007d55]">
                ATS Score: 96%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel(Math.max(75, zoomLevel - 10))}
                className="w-7 h-7 rounded hover:bg-[#353534] flex items-center justify-center text-[#c3c6d7] cursor-pointer"
                title="Zoom Out"
              >
                <span className="material-symbols-outlined text-[16px]">remove</span>
              </button>
              <span className="font-mono text-[12px] w-12 text-center">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(125, zoomLevel + 10))}
                className="w-7 h-7 rounded hover:bg-[#353534] flex items-center justify-center text-[#c3c6d7] cursor-pointer"
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>
          </div>

          {/* Paper Sheet Simulator */}
          <div className="w-full overflow-x-auto bg-[#0e0e0e] border-x border-b border-[#434655]/40 rounded-b-xl p-4 sm:p-8 flex justify-center shadow-2xl">
            <div
              id="printable-cv-paper"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="w-full max-w-[720px] bg-white text-[#1c1b1b] rounded-md p-8 sm:p-12 shadow-2xl font-sans transition-transform duration-200 selection:bg-[#b4c5ff] selection:text-[#002a78] space-y-6"
            >
              {/* CV Header */}
              <div className="border-b-2 border-gray-900 pb-4">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      className="text-[28px] font-bold text-gray-900 w-full border border-blue-400 p-1 rounded font-headline"
                    />
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => handleFieldChange('role', e.target.value)}
                      className="text-[16px] font-semibold text-blue-700 w-full border border-blue-400 p-1 rounded"
                    />
                  </div>
                ) : (
                  <div>
                    <h1 className="text-[28px] sm:text-[32px] font-extrabold text-gray-900 leading-tight tracking-tight">
                      {formData.name}
                    </h1>
                    <p className="text-[16px] font-bold text-[#1d4ed8] mt-0.5 tracking-wide uppercase">
                      {formData.role}
                    </p>
                  </div>
                )}

                {/* Contact Bar */}
                <div className="flex flex-wrap gap-y-1 gap-x-4 text-[12px] text-gray-600 mt-2.5 font-medium">
                  <span className="flex items-center gap-1">
                    <span>{formData.email}</span>
                  </span>
                  <span>•</span>
                  <span>{formData.phone}</span>
                  <span>•</span>
                  <span>{formData.location}</span>
                  <span>•</span>
                  <span className="text-[#1d4ed8]">{formData.linkedin}</span>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="space-y-1.5">
                <h2 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-1">
                  Professional Summary
                </h2>
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={formData.summary}
                    onChange={(e) => handleFieldChange('summary', e.target.value)}
                    className="w-full text-[13px] text-gray-700 border border-blue-400 p-2 rounded leading-relaxed"
                  />
                ) : (
                  <p className="text-[13px] text-gray-700 leading-relaxed font-normal">
                    {formData.summary}
                  </p>
                )}
              </div>

              {/* Core Technical & Professional Skills */}
              <div className="space-y-1.5">
                <h2 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-1">
                  Core Competencies & Skills
                </h2>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-0.5 bg-gray-100 text-gray-800 rounded text-[11px] font-semibold border border-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Work Experience Section */}
              <div className="space-y-4">
                <h2 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-1">
                  Professional Experience
                </h2>

                <div className="space-y-4">
                  {formData.experiences.map((exp, expIdx) => (
                    <div key={exp.id || expIdx} className="space-y-1.5">
                      <div className="flex justify-between items-baseline">
                        <div>
                          <span className="text-[14px] font-bold text-gray-900">
                            {exp.role}
                          </span>
                          <span className="text-[13px] font-semibold text-gray-600">
                            {' '}— {exp.company}
                          </span>
                        </div>
                        <span className="text-[12px] font-medium text-gray-500">
                          {exp.dates}
                        </span>
                      </div>

                      <ul className="list-disc pl-5 text-[12.5px] text-gray-700 space-y-1 leading-relaxed">
                        {exp.bullets.map((bullet, bIdx) => (
                          <li key={bIdx}>
                            {isEditing ? (
                              <textarea
                                rows={2}
                                value={bullet}
                                onChange={(e) =>
                                  handleExperienceBulletChange(expIdx, bIdx, e.target.value)
                                }
                                className="w-full border border-blue-400 p-1 rounded text-[12px]"
                              />
                            ) : (
                              <span>{bullet}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education Section */}
              <div className="space-y-2">
                <h2 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-1">
                  Education & Certifications
                </h2>
                <div className="space-y-1.5">
                  {formData.education.map((edu, idx) => (
                    <div key={edu.id || idx} className="flex justify-between items-baseline text-[13px]">
                      <div>
                        <span className="font-bold text-gray-900">{edu.degree}</span>
                        <span className="text-gray-600"> — {edu.school}</span>
                      </div>
                      <span className="text-[12px] text-gray-500 font-medium">{edu.dates}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Optimization Insights & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* ATS Score Card */}
          <div className="bg-[#1c1b1b] border border-[#007d55]/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4edea3]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="font-headline text-[12px] uppercase font-bold tracking-wider text-[#4edea3]">
                Tailored CV Match
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#007d55]/30 text-[#4edea3] text-[11px] font-bold border border-[#007d55]">
                Top Tier
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-headline text-[48px] font-black text-[#e5e2e1] leading-none">
                96%
              </span>
              <span className="font-body text-[13px] text-[#4edea3] font-semibold">
                +14% boost over base CV
              </span>
            </div>

            <p className="font-body text-[13px] text-[#c3c6d7] leading-relaxed">
              All 4 high-value keywords and quantifiable impact metrics have been integrated into this tailored version.
            </p>

            <div className="mt-5 pt-4 border-t border-[#434655]/40 space-y-2">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#8d90a0]">Keywords Match:</span>
                <span className="text-[#4edea3] font-bold font-headline">98% (14/14 Terms)</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#8d90a0]">Quantified Outcomes:</span>
                <span className="text-[#4edea3] font-bold font-headline">3 Metrics Embedded</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#8d90a0]">ATS Layout Score:</span>
                <span className="text-[#4edea3] font-bold font-headline">96% Parseable</span>
              </div>
            </div>
          </div>

          {/* Export & Next Step Actions */}
          <div className="bg-[#1c1b1b] border border-[#434655]/40 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-headline text-[16px] font-bold text-[#e5e2e1]">
              Export & Continue
            </h3>

            <div className="space-y-2.5">
              <button
                onClick={onDownload}
                className="w-full py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-headline text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Download PDF Resume</span>
              </button>

              <button
                onClick={() => onNavigate('cover-letter')}
                className="w-full py-2.5 rounded-xl bg-[#201f1f] hover:bg-[#2a2a2a] text-[#c3c6d7] hover:text-white font-headline text-[13px] font-semibold transition-colors flex items-center justify-center gap-2 border border-[#434655]/50 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">mail</span>
                <span>Generate Matching Cover Letter</span>
              </button>

              <button
                onClick={() => onNavigate('applications')}
                className="w-full py-2.5 rounded-xl bg-[#201f1f] hover:bg-[#2a2a2a] text-[#c3c6d7] hover:text-white font-headline text-[13px] font-semibold transition-colors flex items-center justify-center gap-2 border border-[#434655]/50 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                <span>Log in Application Tracker</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
