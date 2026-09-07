import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ScreenType,
  UserProfile,
  AtsBreakdown,
  CoverLetterData,
  JobApplication,
  TailoredCvData,
  ParsedCareerProfile,
} from './types';
import {
  INITIAL_USER,
  INITIAL_ATS_DATA,
  INITIAL_TAILORED_CV,
  INITIAL_COVER_LETTER,
  INITIAL_APPLICATIONS,
} from './mockData';
import { Sidebar } from './components/Sidebar';
import { LandingView } from './components/LandingView';
import { SignInView } from './components/SignInView';
import { SignUpView } from './components/SignUpView';
import { OnboardingView } from './components/OnboardingView';
import { DashboardView } from './components/DashboardView';
import { ProfileView } from './components/ProfileView';
import { AtsScoreView } from './components/AtsScoreView';
import { TailoredCvView } from './components/TailoredCvView';
import { CoverLetterView } from './components/CoverLetterView';
import { ApplicationsView } from './components/ApplicationsView';
import { DocumentsView } from './components/DocumentsView';
import { SettingsView } from './components/SettingsView';
import { EditProfileModal } from './components/EditProfileModal';

const SCREEN_TO_PATH: Record<ScreenType, string> = {
  landing: '/',
  signin: '/signin',
  signup: '/signup',
  onboarding: '/onboarding',
  dashboard: '/dashboard',
  profile: '/profile',
  'ats-score': '/ats-score',
  'tailored-cv': '/tailored-cv',
  'cover-letter': '/cover-letter',
  applications: '/applications',
  documents: '/documents',
  settings: '/settings',
};

const PATH_TO_SCREEN: Record<string, ScreenType> = {
  '/': 'landing',
  '/signin': 'signin',
  '/signup': 'signup',
  '/onboarding': 'onboarding',
  '/dashboard': 'dashboard',
  '/profile': 'profile',
  '/ats-score': 'ats-score',
  '/tailored-cv': 'tailored-cv',
  '/cover-letter': 'cover-letter',
  '/applications': 'applications',
  '/documents': 'documents',
  '/settings': 'settings',
};

const APP_SCREENS = new Set<ScreenType>([
  'dashboard',
  'profile',
  'ats-score',
  'tailored-cv',
  'cover-letter',
  'applications',
  'documents',
  'settings',
]);

export function App() {
  const [currentScreen, setCurrentScreenState] = useState<ScreenType>('landing');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [atsData, setAtsData] = useState<AtsBreakdown>(INITIAL_ATS_DATA);
  const [tailoredCv, setTailoredCv] = useState<TailoredCvData>(INITIAL_TAILORED_CV);
  const [coverLetter, setCoverLetter] = useState<CoverLetterData>(INITIAL_COVER_LETTER);
  const [applications, setApplications] = useState<JobApplication[]>(INITIAL_APPLICATIONS);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  // Theme Management (Dark / Light Mode)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('jobpal_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('jobpal_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToastMessage(msg);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 3500);
  }, []);

  const setCurrentScreen = useCallback((screen: ScreenType) => {
    setCurrentScreenState(screen);
    const path = SCREEN_TO_PATH[screen] || '/';
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const screen = PATH_TO_SCREEN[window.location.pathname] || 'landing';
      setCurrentScreenState(screen);
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Sync state between Tailored CV and Master Profile
  const handleUpdateCv = (updated: TailoredCvData) => {
    setTailoredCv(updated);
    setUser((prev) => ({
      ...prev,
      name: updated.name || prev.name,
      role: updated.role || prev.role,
      email: updated.email || prev.email,
      phone: updated.phone || prev.phone,
      skills: updated.skills || prev.skills,
    }));
  };

  // Commit AI-parsed career profile to UserProfile and TailoredCv
  const handleApplyParsedProfile = (parsed: ParsedCareerProfile) => {
    const experiences = (parsed.experiences || []).map((exp) => ({
      id: exp.id || Math.random().toString(),
      company: exp.company,
      role: exp.role,
      location: exp.location || '',
      dates: exp.dates,
      bullets: exp.bullets || [],
    }));

    const education = (parsed.education || []).map((edu) => ({
      id: edu.id || Math.random().toString(),
      school: edu.institution,
      degree: edu.degree,
      dates: edu.dates,
      fieldOfStudy: edu.fieldOfStudy || '',
    }));

    setUser((prev) => ({
      ...prev,
      name: parsed.contact.name || prev.name,
      role: parsed.contact.role || prev.role,
      email: parsed.contact.email || prev.email,
      phone: parsed.contact.phone || prev.phone,
      location: parsed.contact.location || prev.location,
      state: parsed.contact.state || prev.state,
      country: parsed.contact.country || prev.country,
      bio: parsed.summary || prev.bio,
      skills: parsed.allSkills && parsed.allSkills.length > 0 ? parsed.allSkills : prev.skills,
      experienceLevel: parsed.detectedSeniority === 'senior' ? 'senior' : parsed.detectedSeniority === 'junior' ? 'junior' : 'mid',
      experienceCount: experiences.length || prev.experienceCount,
      educationCount: education.length || prev.educationCount,
      projectsCount: (parsed.projects || []).length || prev.projectsCount,
      experiences: experiences.length > 0 ? experiences : prev.experiences,
      education: education.length > 0 ? education : prev.education,
      certifications: (parsed.certifications && parsed.certifications.length > 0) ? parsed.certifications : prev.certifications,
      projects: (parsed.projects && parsed.projects.length > 0) ? parsed.projects : prev.projects,
      languages: (parsed.languages && parsed.languages.length > 0) ? parsed.languages : prev.languages,
    }));

    setTailoredCv((prev) => ({
      ...prev,
      name: parsed.contact.name || prev.name,
      role: parsed.contact.role || prev.role,
      email: parsed.contact.email || prev.email,
      phone: parsed.contact.phone || prev.phone,
      location: parsed.contact.location || prev.location,
      summary: parsed.summary || prev.summary,
      skills: parsed.allSkills && parsed.allSkills.length > 0 ? parsed.allSkills : prev.skills,
      experiences: experiences.length > 0 ? experiences : prev.experiences,
      education: education.length > 0 ? education : prev.education,
    }));

    showToast(`Career profile successfully parsed & synchronized for ${parsed.contact.name || 'your profile'}!`);
    setCurrentScreen('profile');
  };

  // Auth & Navigation handlers
  const handleLoginSuccess = (email: string) => {
    setUser((prev) => ({ ...prev, email }));
    showToast(`Signed in successfully as ${user.name}`);
    setCurrentScreen('dashboard');
  };

  const handleSignUpSuccess = (userData: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...userData }));
    showToast(`Account created for ${userData.name || 'you'}!`);
    setCurrentScreen('onboarding');
  };

  const handleUploadSuccess = (filename: string) => {
    showToast(`Successfully extracted career data from "${filename}"`);
    setCurrentScreen('profile');
  };

  // ATS Suggestions toggle actions
  const handleApplySuggestion = (id: string) => {
    setAtsData((prev) => {
      let isNowApplied = false;
      const nextSuggestions = prev.suggestions.map((s) => {
        if (s.id === id) {
          isNowApplied = !s.applied;
          return { ...s, applied: !s.applied };
        }
        return s;
      });

      let overall = 82;
      let impact = 65;
      let keywords = 90;
      let formatting = 88;

      nextSuggestions.forEach((s) => {
        if (s.applied) {
          if (s.id === 'sug-1') {
            impact += 15;
            overall += 4;
          } else if (s.id === 'sug-2') {
            keywords += 6;
            overall += 4;
          } else if (s.id === 'sug-3') {
            impact += 10;
            overall += 3;
          } else if (s.id === 'sug-4') {
            formatting += 6;
            overall += 3;
          }
        }
      });

      const finalOverall = Math.min(96, overall);
      const appliedCount = nextSuggestions.filter((s) => s.applied).length;

      showToast(
        isNowApplied
          ? 'AI improvement applied to Master CV.'
          : 'Suggestion reverted.'
      );

      return {
        ...prev,
        overallScore: finalOverall,
        impactScore: Math.min(92, impact),
        keywordsScore: Math.min(98, keywords),
        formattingScore: Math.min(96, formatting),
        suggestions: nextSuggestions,
        scoreStatus: finalOverall >= 90 ? 'Excellent' : 'Good',
        summary:
          appliedCount === nextSuggestions.length
            ? 'All 4 recommendations incorporated! Your resume ATS pass probability is maximized at 96%.'
            : appliedCount > 0
            ? `${appliedCount} of ${nextSuggestions.length} optimizations active. Resume strongly matched against target keywords & quantifiable metrics.`
            : 'Your resume aligns with core qualifications. Apply the AI recommendations below to boost your score to 96%.',
      };
    });
  };

  const handleApplyAll = () => {
    setAtsData((prev) => ({
      ...prev,
      overallScore: 96,
      impactScore: 90,
      keywordsScore: 98,
      formattingScore: 96,
      scoreStatus: 'Excellent',
      suggestions: prev.suggestions.map((s) => ({ ...s, applied: true })),
      summary:
        'All 4 recommendations incorporated! Your resume ATS pass probability is maximized at 96%.',
    }));
    showToast('All 4 AI suggestions applied! ATS Score boosted to 96%.');
  };

  const handleAnalyzeJob = (_jobText: string) => {
    setAtsData((prev) => ({
      ...prev,
      targetRole: 'Senior Product Designer (Acme Corp)',
    }));
  };

  const handleDownloadPdf = (docTitle = 'JobPal_Tailored_Document.pdf') => {
    showToast(`Exported "${docTitle}" successfully.`);
  };

  const handleConfirmSignOut = () => {
    setShowSignOutConfirm(false);
    showToast('Signed out of JobPal AI.');
    setCurrentScreen('landing');
  };

  const isAppView = APP_SCREENS.has(currentScreen);

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] font-body flex flex-col relative selection:bg-[#2563eb] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 right-5 z-50 bg-[#1c1b1b] border border-[#2563eb] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in"
        >
          <span
            className="material-symbols-outlined text-[#4edea3] text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          <span className="font-headline text-[13px] font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#8d90a0] hover:text-white ml-2 cursor-pointer"
            aria-label="Close notification"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div className="w-full max-w-sm bg-[#1c1b1b] border border-[#434655] rounded-2xl p-6 shadow-2xl space-y-5 text-center relative overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-[#ffb4ab]/15 border border-[#ffb4ab]/30 flex items-center justify-center mx-auto text-[#ffb4ab]">
              <span className="material-symbols-outlined text-[24px]">logout</span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-headline text-[18px] font-bold text-white tracking-tight">
                Sign Out of JobPal AI?
              </h3>
              <p className="text-[12.5px] text-[#c3c6d7] leading-relaxed">
                Are you sure you want to end your current session? You can sign back in at any time.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSignOutConfirm(false)}
                className="py-2.5 px-4 rounded-xl bg-[#201f1f] hover:bg-[#2a2a2a] text-[#c3c6d7] hover:text-white font-headline text-[13px] font-semibold border border-[#434655]/50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                id="btn-confirm-signout"
                onClick={handleConfirmSignOut}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-headline text-[13px] font-bold transition-all shadow-md cursor-pointer active:scale-[0.98]"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen Render Switch */}
      {isAppView ? (
        <div className="flex min-h-screen">
          {/* Persistent Sidebar */}
          <Sidebar
            currentScreen={currentScreen}
            onNavigate={setCurrentScreen}
            user={user}
            onSignOut={() => setShowSignOutConfirm(true)}
          />

          {/* Main App Content Area */}
          <main className="flex-1 ml-0 md:ml-64 min-h-screen bg-[#131313] pt-14 md:pt-0 pb-24 md:pb-12 max-w-full overflow-x-hidden">
            {currentScreen === 'dashboard' && (
              <DashboardView
                user={user}
                applications={applications}
                onNavigate={setCurrentScreen}
                onEditProfile={() => setIsEditProfileOpen(true)}
                onAnalyzeJob={handleAnalyzeJob}
                onExportDocuments={() => handleDownloadPdf('Sarah_Jenkins_Master_Pack.zip')}
              />
            )}

            {currentScreen === 'profile' && (
              <ProfileView
                user={user}
                tailoredCv={tailoredCv}
                onNavigate={setCurrentScreen}
                onUpdateProfile={(updatedUser, updatedCv) => {
                  setUser(updatedUser);
                  if (updatedCv) setTailoredCv(updatedCv);
                  showToast('Master profile and CV details synchronized!');
                }}
                onExportPdf={(title) => handleDownloadPdf(title || `${user.name.replace(/\s+/g, '_')}_Master_CV.pdf`)}
                onExportDocx={(title) => handleDownloadPdf(title || `${user.name.replace(/\s+/g, '_')}_Master_CV.docx`)}
              />
            )}

            {currentScreen === 'ats-score' && (
              <AtsScoreView
                atsData={atsData}
                onNavigate={setCurrentScreen}
                onApplySuggestion={handleApplySuggestion}
                onApplyAll={handleApplyAll}
              />
            )}

            {currentScreen === 'tailored-cv' && (
              <TailoredCvView
                cvData={tailoredCv}
                onNavigate={setCurrentScreen}
                onUpdateCv={setTailoredCv}
                onDownload={() => handleDownloadPdf('Sarah_Jenkins_AcmeCorp_Tailored_CV.pdf')}
              />
            )}

            {currentScreen === 'cover-letter' && (
              <CoverLetterView
                coverLetter={coverLetter}
                onNavigate={setCurrentScreen}
                onUpdateCoverLetter={setCoverLetter}
                onDownload={() => handleDownloadPdf('Alex_Mercer_AcmeCorp_CoverLetter.pdf')}
              />
            )}

            {currentScreen === 'applications' && (
              <ApplicationsView
                applications={applications}
                onNavigate={setCurrentScreen}
                onAddApplication={(newApp) => {
                  setApplications((prev) => [newApp, ...prev]);
                  showToast(`Added application for ${newApp.company}`);
                }}
                onUpdateStatus={(id, newStatus) => {
                  setApplications((prev) =>
                    prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
                  );
                  showToast(`Updated application status to ${newStatus}`);
                }}
                onDeleteApplication={(id) => {
                  setApplications((prev) => prev.filter((a) => a.id !== id));
                  showToast('Application deleted');
                }}
              />
            )}

            {currentScreen === 'documents' && (
              <DocumentsView
                onNavigate={setCurrentScreen}
                onDownloadItem={(title) => handleDownloadPdf(title)}
              />
            )}

            {currentScreen === 'settings' && (
              <SettingsView
                user={user}
                currentTheme={theme}
                onToggleTheme={(newTheme) => {
                  setTheme(newTheme);
                  showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
                }}
                onUpdateUser={(updated) => {
                  setUser(updated);
                  showToast('User settings and AI preferences updated.');
                }}
                onNavigate={setCurrentScreen}
              />
            )}
          </main>
        </div>
      ) : (
        /* Full screen views without sidebar */
        <div className="flex-1">
          {currentScreen === 'landing' && <LandingView onNavigate={setCurrentScreen} />}

          {currentScreen === 'signin' && (
            <SignInView
              onNavigate={setCurrentScreen}
              onLoginSuccess={handleLoginSuccess}
            />
          )}

          {currentScreen === 'signup' && (
            <SignUpView
              onNavigate={setCurrentScreen}
              onSignUpSuccess={handleSignUpSuccess}
            />
          )}

          {currentScreen === 'onboarding' && (
            <OnboardingView
              onNavigate={setCurrentScreen}
              onUploadSuccess={handleUploadSuccess}
              onParsedProfileReady={handleApplyParsedProfile}
            />
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        user={user}
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={(updated) => {
          setUser(updated);
          showToast('Profile information successfully saved!');
        }}
      />
    </div>
  );
}

export default App;

