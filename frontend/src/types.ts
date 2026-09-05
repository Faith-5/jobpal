export type ScreenType =
  | 'landing'
  | 'signin'
  | 'signup'
  | 'onboarding'
  | 'dashboard'
  | 'profile'
  | 'ats-score'
  | 'tailored-cv'
  | 'cover-letter'
  | 'applications'
  | 'documents'
  | 'settings';

export interface ProfileLanguage {
  id: string;
  language: string;
  proficiency: 'Native or Bilingual' | 'Fluent' | 'Conversational' | 'Basic';
}

export interface ProfileCertification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  credentialId?: string;
}

export interface ProfileProject {
  id: string;
  title: string;
  description: string;
  role?: string;
  link?: string;
  skills: string[];
  status?: 'Published' | 'Draft';
}

export interface ProfileTestimonial {
  id: string;
  clientName: string;
  clientRole: string;
  feedback: string;
  date: string;
}

export interface ProfileAccount {
  id: string;
  provider: 'GitHub' | 'LinkedIn' | 'StackOverflow' | 'Portfolio' | 'Dribbble' | 'Twitter';
  username: string;
  url: string;
  verified: boolean;
  sinceYear?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  state: string;
  country: string;
  primaryGoal: 'actively_searching' | 'career_pivot' | 'exploring';
  experienceLevel: 'junior' | 'mid' | 'senior';
  role: string;
  avatarUrl: string;
  plan: string;
  experienceCount: number;
  educationCount: number;
  projectsCount: number;
  skills: string[];
  // Upwork-style profile extensions
  hourlyRate?: string;
  hoursPerWeek?: string;
  availabilityStatus?: string;
  bio?: string;
  location?: string;
  workingStyles?: string[];
  languages?: ProfileLanguage[];
  certifications?: ProfileCertification[];
  projects?: ProfileProject[];
  testimonials?: ProfileTestimonial[];
  linkedAccounts?: ProfileAccount[];
  experiences?: CvExperience[];
  education?: CvEducation[];
}

export interface SuggestionItem {
  id: string;
  type: 'warning' | 'lightbulb' | 'check';
  title: string;
  category: 'impact' | 'keyword' | 'format';
  problem: string;
  suggestedFix: string;
  impactBoost?: string;
  applied: boolean;
}

export interface CoverLetterData {
  applicantName: string;
  applicantTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  date: string;
  hiringManager: string;
  companyName: string;
  companyAddress: string;
  cityStateZip: string;
  paragraphs: string[];
  signatureName: string;
}

export interface CvExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  dates: string;
  bullets: string[];
}

export interface CvEducation {
  id: string;
  school: string;
  degree: string;
  dates: string;
  fieldOfStudy?: string;
  description?: string;
}

export interface TailoredCvData {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  skills: string[];
  experiences: CvExperience[];
  education: CvEducation[];
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  logoText: string;
  status: 'Draft' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
  appliedDate: string;
  atsScore: number;
  location: string;
  salary?: string;
  notes?: string;
}

export interface AtsBreakdown {
  overallScore: number;
  scoreStatus: 'Excellent' | 'Good' | 'Needs Work';
  summary: string;
  keywordsScore: number;
  keywordsSummary: string;
  formattingScore: number;
  formattingSummary: string;
  impactScore: number;
  impactSummary: string;
  targetRole: string;
  suggestions: SuggestionItem[];
}
