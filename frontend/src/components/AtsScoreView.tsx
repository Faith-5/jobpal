import React, { useState } from 'react';
import { ScreenType, AtsBreakdown, SuggestionItem } from '../types';

interface AtsScoreViewProps {
  atsData: AtsBreakdown;
  onNavigate: (screen: ScreenType) => void;
  onApplySuggestion: (id: string) => void;
  onApplyAll: () => void;
}

export const AtsScoreView: React.FC<AtsScoreViewProps> = ({
  atsData,
  onNavigate,
  onApplySuggestion,
  onApplyAll,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customEdits, setCustomEdits] = useState<Record<string, string>>({});
  const [isFixingAll, setIsFixingAll] = useState(false);
  
  // Retractable suggestions state (retracted by default for a clean, non-overwhelming overview)
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const appliedCount = atsData.suggestions.filter((s) => s.applied).length;
  const totalCount = atsData.suggestions.length;
  const isAllApplied = appliedCount === totalCount && totalCount > 0;

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleAll = (expand: boolean) => {
    const next: Record<string, boolean> = {};
    atsData.suggestions.forEach((s) => {
      next[s.id] = expand;
    });
    setExpandedIds(next);
  };

  const allExpanded =
    atsData.suggestions.length > 0 &&
    atsData.suggestions.every((s) => expandedIds[s.id]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-[#4edea3]';
    if (score >= 75) return 'text-[#b4c5ff]';
    return 'text-[#ffb4ab]';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 85) return 'bg-[#4edea3]';
    if (score >= 75) return 'bg-[#b4c5ff]';
    return 'bg-[#ffb4ab]';
  };

  const getCategoryBadge = (cat: SuggestionItem['category']) => {
    switch (cat) {
      case 'impact':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-headline font-semibold bg-[#ffb4ab]/15 text-[#ffb4ab] border border-[#ffb4ab]/30 flex items-center gap-1 shrink-0">
            <span className="material-symbols-outlined text-[13px]">trending_up</span>
            <span>Impact & Metrics</span>
          </span>
        );
      case 'keyword':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-headline font-semibold bg-[#b4c5ff]/15 text-[#b4c5ff] border border-[#b4c5ff]/30 flex items-center gap-1 shrink-0">
            <span className="material-symbols-outlined text-[13px]">key</span>
            <span>Keywords Match</span>
          </span>
        );
      case 'format':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-headline font-semibold bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/30 flex items-center gap-1 shrink-0">
            <span className="material-symbols-outlined text-[13px]">view_compact</span>
            <span>ATS Formatting</span>
          </span>
        );
    }
  };

  const handleToggle = (sug: SuggestionItem) => {
    onApplySuggestion(sug.id);
  };

  const handleFixAllClick = () => {
    if (isAllApplied) return;
    setIsFixingAll(true);
    setTimeout(() => {
      onApplyAll();
      setIsFixingAll(false);
    }, 500);
  };

  const handleSaveCustomEdit = (id: string) => {
    onApplySuggestion(id);
    setEditingId(null);
  };

  return (
    <div id="ats-score-screen" className="p-4 sm:p-6 md:p-8 max-w-[1200px] mx-auto space-y-6 sm:space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-[#8d90a0] hover:text-[#e5e2e1] transition-colors p-1 -ml-1 cursor-pointer"
              aria-label="Back to Dashboard"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <h1 className="font-headline text-[24px] sm:text-[28px] font-bold text-[#e5e2e1] tracking-tight">
              Resume ATS Analysis & Scoring
            </h1>
          </div>
          <p className="font-body text-[14px] text-[#c3c6d7]">
            Benchmarked against:{' '}
            <span className="text-[#b4c5ff] font-semibold">
              {atsData.targetRole}
            </span>
          </p>
        </div>

        {/* Status Badge in Top Header */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1b1b] border border-[#434655]/60 text-[12.5px] text-[#c3c6d7]">
          <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
          <span>Real-time ATS Benchmark Active</span>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className="bg-[#1c1b1b] border border-[#434655]/50 rounded-2xl p-5 sm:p-7 shadow-xl flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#4edea3]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Circular Radial Gauge */}
        <div className="relative w-36 h-36 sm:w-40 sm:h-40 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r="68"
              stroke="#353534"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Value Track */}
            <circle
              cx="80"
              cy="80"
              r="68"
              stroke={atsData.overallScore >= 85 ? '#4edea3' : '#b4c5ff'}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 68}
              strokeDashoffset={2 * Math.PI * 68 * (1 - atsData.overallScore / 100)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Central Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-headline text-[38px] sm:text-[42px] font-extrabold text-[#e5e2e1] leading-none">
              {atsData.overallScore}
            </span>
            <span className="font-body text-[12px] text-[#8d90a0] font-medium">/ 100</span>
            <span className="font-headline text-[12px] font-bold text-[#4edea3] mt-0.5 tracking-wide uppercase">
              {atsData.scoreStatus}
            </span>
          </div>
        </div>

        {/* Text Breakdown */}
        <div className="flex-1 text-center md:text-left space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#007d55]/20 border border-[#007d55]/40 text-[#4edea3] text-[12px] font-semibold font-headline">
            <span
              className="material-symbols-outlined text-[15px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span>
              {atsData.overallScore >= 90
                ? 'ATS Pass Rate: Excellent (Top 5%)'
                : 'ATS Pass Rate: Highly Probable'}
            </span>
          </div>
          <h2 className="font-headline text-[20px] sm:text-[22px] font-bold text-[#e5e2e1]">
            Overall Compatibility Score: {atsData.overallScore}%
          </h2>
          <p className="font-body text-[14px] text-[#c3c6d7] max-w-2xl leading-relaxed">
            {atsData.summary}
          </p>

          <div className="pt-1 flex flex-wrap gap-4 justify-center md:justify-start text-[12.5px] text-[#8d90a0]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4edea3]" />
              {appliedCount} of {totalCount} AI recommendations applied
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#b4c5ff]" />
              Screened against 24 standard ATS algorithmic parsers
            </span>
          </div>
        </div>
      </div>

      {/* 3 Metric Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Keywords */}
        <div className="bg-[#1c1b1b] border border-[#434655]/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4edea3] text-[20px]">
                  key
                </span>
                <h3 className="font-headline text-[15px] font-semibold text-[#e5e2e1]">
                  Keywords Match
                </h3>
              </div>
              <span className={`font-headline text-[17px] font-bold ${getScoreColor(atsData.keywordsScore)}`}>
                {atsData.keywordsScore}/100
              </span>
            </div>
            <div className="w-full bg-[#131313] h-2 rounded-full overflow-hidden border border-[#434655]/30 mb-3">
              <div
                className={`h-full ${getScoreBarColor(atsData.keywordsScore)} transition-all duration-700`}
                style={{ width: `${atsData.keywordsScore}%` }}
              />
            </div>
            <p className="font-body text-[12.5px] text-[#c3c6d7] leading-relaxed">
              {atsData.keywordsSummary}
            </p>
          </div>
          <div className="pt-2 border-t border-[#434655]/30 flex items-center justify-between text-[11.5px] text-[#8d90a0]">
            <span>Hard & Soft Skills</span>
            <span className="text-[#4edea3] font-medium font-headline">{atsData.keywordsScore}% Match</span>
          </div>
        </div>

        {/* Formatting */}
        <div className="bg-[#1c1b1b] border border-[#434655]/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#b4c5ff] text-[20px]">
                  view_compact
                </span>
                <h3 className="font-headline text-[15px] font-semibold text-[#e5e2e1]">
                  Formatting & Structure
                </h3>
              </div>
              <span className={`font-headline text-[17px] font-bold ${getScoreColor(atsData.formattingScore)}`}>
                {atsData.formattingScore}/100
              </span>
            </div>
            <div className="w-full bg-[#131313] h-2 rounded-full overflow-hidden border border-[#434655]/30 mb-3">
              <div
                className={`h-full ${getScoreBarColor(atsData.formattingScore)} transition-all duration-700`}
                style={{ width: `${atsData.formattingScore}%` }}
              />
            </div>
            <p className="font-body text-[12.5px] text-[#c3c6d7] leading-relaxed">
              {atsData.formattingSummary}
            </p>
          </div>
          <div className="pt-2 border-t border-[#434655]/30 flex items-center justify-between text-[11.5px] text-[#8d90a0]">
            <span>Layout Consistency</span>
            <span className="text-[#4edea3] font-medium font-headline">Parsed Cleanly</span>
          </div>
        </div>

        {/* Impact & Metrics */}
        <div className="bg-[#1c1b1b] border border-[#434655]/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-3 sm:col-span-2 md:col-span-1">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffb4ab] text-[20px]">
                  trending_up
                </span>
                <h3 className="font-headline text-[15px] font-semibold text-[#e5e2e1]">
                  Impact & Metrics
                </h3>
              </div>
              <span className={`font-headline text-[17px] font-bold ${getScoreColor(atsData.impactScore)}`}>
                {atsData.impactScore}/100
              </span>
            </div>
            <div className="w-full bg-[#131313] h-2 rounded-full overflow-hidden border border-[#434655]/30 mb-3">
              <div
                className={`h-full ${getScoreBarColor(atsData.impactScore)} transition-all duration-700`}
                style={{ width: `${atsData.impactScore}%` }}
              />
            </div>
            <p className="font-body text-[12.5px] text-[#c3c6d7] leading-relaxed">
              {atsData.impactSummary}
            </p>
          </div>
          <div className="pt-2 border-t border-[#434655]/30 flex items-center justify-between text-[11.5px] text-[#8d90a0]">
            <span>Quantified Metrics</span>
            <span className={atsData.impactScore >= 85 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'}>
              {atsData.impactScore >= 85 ? 'Optimized' : 'Action Recommended'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RETRACTABLE AI SUGGESTIONS SECTION (DESKTOP + MOBILE OPTIMIZED) */}
      {/* ========================================================================= */}
      <div className="bg-[#1c1b1b] border border-[#434655]/50 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-5">
        {/* Section Header with Fix All Action & Expand/Retract Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#434655]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563eb]/20 border border-[#2563eb]/40 flex items-center justify-center text-[#b4c5ff] shrink-0">
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-headline text-[18px] sm:text-[20px] font-bold text-[#e5e2e1]">
                  AI Suggestions & Enhancements
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#353534] text-[#b4c5ff] text-[11.5px] font-bold border border-[#434655]">
                  {appliedCount}/{totalCount} Applied
                </span>
              </div>
              <p className="font-body text-[12.5px] text-[#c3c6d7] mt-0.5">
                Click any suggestion to expand the comparison and view recommended wording.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            {/* Expand / Retract All Toggle */}
            <button
              onClick={() => handleToggleAll(!allExpanded)}
              className="text-[12px] text-[#38bdf8] hover:underline font-semibold cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">
                {allExpanded ? 'unfold_less' : 'unfold_more'}
              </span>
              <span>{allExpanded ? 'Retract All' : 'Expand All'}</span>
            </button>

            {/* Fix All Button */}
            <button
              id="btn-apply-all-fixes"
              onClick={handleFixAllClick}
              disabled={isFixingAll || isAllApplied}
              className={`px-4 py-2 rounded-xl font-headline text-[12.5px] font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                isAllApplied
                  ? 'bg-[#007d55]/30 text-[#4edea3] border border-[#007d55] cursor-default'
                  : 'bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-[0.98] text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
              }`}
            >
              {isFixingAll ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">
                    progress_activity
                  </span>
                  <span>Applying...</span>
                </>
              ) : (
                <>
                  <span
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {isAllApplied ? 'check_circle' : 'bolt'}
                  </span>
                  <span>{isAllApplied ? 'All Applied' : 'Apply All'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Retractable Suggestion Accordion Cards */}
        <div className="space-y-3">
          {atsData.suggestions.map((sug) => {
            const isExpanded = expandedIds[sug.id] ?? false;
            const isEditing = editingId === sug.id;
            const currentText = customEdits[sug.id] ?? sug.suggestedFix;

            return (
              <div
                key={sug.id}
                className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                  sug.applied
                    ? 'bg-[#141414] border-[#007d55]/60 shadow-sm'
                    : 'bg-[#181818] border-[#434655]/50 hover:border-[#8d90a0]'
                }`}
              >
                {/* Accordion Header Row (Click to toggle expansion) */}
                <div
                  onClick={() => toggleExpand(sug.id)}
                  className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer select-none hover:bg-[#201f1f]/60 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 overflow-hidden w-full sm:w-auto">
                    {/* Apply Checkbox Indicator */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(sug);
                      }}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                        sug.applied
                          ? 'bg-[#4edea3] border-[#4edea3] text-[#003824] shadow-[0_0_8px_rgba(78,222,163,0.4)]'
                          : 'bg-[#131313] border-[#434655] hover:border-[#38bdf8] text-transparent'
                      }`}
                      title={sug.applied ? 'Click to revert' : 'Click to apply'}
                    >
                      <span className="material-symbols-outlined text-[16px] font-bold">
                        check
                      </span>
                    </button>

                    <div className="flex flex-wrap items-center gap-2 overflow-hidden flex-1">
                      <h4 className="font-headline text-[14px] sm:text-[15px] font-bold text-[#e5e2e1] truncate">
                        {sug.title}
                      </h4>
                      {getCategoryBadge(sug.category)}
                      {sug.impactBoost && (
                        <span className="px-2 py-0.5 rounded-full bg-[#2563eb]/20 text-[#b4c5ff] text-[10.5px] font-bold border border-[#2563eb]/40 shrink-0">
                          {sug.impactBoost}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Chevron */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(sug);
                      }}
                      className={`px-3 py-1 rounded-lg font-headline text-[11.5px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        sug.applied
                          ? 'bg-[#007d55]/30 text-[#4edea3] border border-[#007d55]'
                          : 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        {sug.applied ? 'done' : 'add'}
                      </span>
                      <span>{sug.applied ? 'Applied' : 'Apply'}</span>
                    </button>

                    <span className="material-symbols-outlined text-[18px] text-[#8d90a0] transition-transform duration-200">
                      {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>
                </div>

                {/* Accordion Expandable Body */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 pt-0 border-t border-[#434655]/30 space-y-3.5 animate-fade-in">
                    {/* Responsive Comparison Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                      {/* Detected Issue Container */}
                      <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-3.5 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-red-400">
                          <span
                            className="material-symbols-outlined text-[16px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            error
                          </span>
                          <span className="font-headline text-[11.5px] font-bold uppercase tracking-wider">
                            Detected Issue
                          </span>
                        </div>
                        <p className="font-body text-[12.5px] text-red-200/90 leading-relaxed">
                          {sug.problem}
                        </p>
                      </div>

                      {/* AI Suggested Fix Container */}
                      <div className="bg-emerald-950/25 border border-emerald-500/40 rounded-xl p-3.5 space-y-1.5">
                        <div className="flex items-center justify-between text-emerald-400">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="material-symbols-outlined text-[16px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              check_circle
                            </span>
                            <span className="font-headline text-[11.5px] font-bold uppercase tracking-wider">
                              AI Suggested Fix
                            </span>
                          </div>
                          {sug.applied && (
                            <span className="text-[10px] font-headline font-bold text-[#4edea3] uppercase">
                              Active in CV
                            </span>
                          )}
                        </div>
                        <p className="font-body text-[12.5px] text-emerald-200/95 leading-relaxed font-medium">
                          {sug.suggestedFix}
                        </p>
                      </div>
                    </div>

                    {/* Quick Customize Toggle Button */}
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingId(isEditing ? null : sug.id)}
                        className="text-[12px] text-[#38bdf8] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                        <span>{isEditing ? 'Close Custom Editor' : 'Customize Wording'}</span>
                      </button>
                    </div>

                    {/* Inline Customization Editor */}
                    {isEditing && (
                      <div className="pt-2 border-t border-[#434655]/40 space-y-2.5">
                        <label className="block text-[11.5px] font-headline text-[#c3c6d7] font-semibold">
                          Custom Replacement Text:
                        </label>
                        <textarea
                          rows={3}
                          value={currentText}
                          onChange={(e) =>
                            setCustomEdits({ ...customEdits, [sug.id]: e.target.value })
                          }
                          className="w-full bg-[#131313] border border-[#2563eb]/60 rounded-xl p-2.5 text-[12.5px] text-[#e5e2e1] outline-none focus:ring-1 focus:ring-[#2563eb]"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 rounded-lg text-[11.5px] text-[#8d90a0] hover:bg-[#353534]"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveCustomEdit(sug.id)}
                            className="px-3.5 py-1 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[11.5px] font-semibold shadow-md"
                          >
                            Save & Apply Custom Text
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM ACTION BAR: DIRECT NEXT STEPS (TAILORED CV & COVER LETTER) */}
      {/* ========================================================================= */}
      <div className="bg-[#1c1b1b] border border-[#2563eb]/50 rounded-2xl p-5 sm:p-6 shadow-[0_0_40px_rgba(37,99,235,0.2)] flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#4edea3]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-0.5 text-center sm:text-left relative z-10">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="material-symbols-outlined text-[#4edea3] text-[20px]">
              task_alt
            </span>
            <h3 className="font-headline text-[17px] font-bold text-[#e5e2e1]">
              Ready for Application Packaging
            </h3>
          </div>
          <p className="font-body text-[13px] text-[#c3c6d7]">
            Active AI enhancements have been incorporated into your tailored resume.
          </p>
        </div>

        {/* Action Buttons: View Tailored CV & Generate Cover Letter */}
        <div className="flex flex-wrap items-center gap-3 relative z-10 w-full sm:w-auto justify-center">
          <button
            id="btn-view-tailored-cv"
            onClick={() => onNavigate('tailored-cv')}
            className="px-6 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-headline text-[13.5px] font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">description</span>
            <span>View Tailored CV</span>
          </button>

          <button
            id="btn-continue-application"
            onClick={() => onNavigate('cover-letter')}
            className="px-5 py-2.5 rounded-xl bg-[#007d55] hover:bg-[#009b6b] text-white font-headline text-[13.5px] font-bold transition-all shadow-[0_0_20px_rgba(0,125,85,0.35)] flex items-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <span>Generate Cover Letter</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AtsScoreView;
