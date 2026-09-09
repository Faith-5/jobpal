import React, { useState, useEffect } from 'react';
import {
  ScreenType,
  UserProfile,
  CvExperience,
  CvEducation,
  ProfileCertification,
  ProfileProject,
  TailoredCvData,
} from '../types';

interface ProfileViewProps {
  user: UserProfile;
  tailoredCv: TailoredCvData;
  onNavigate: (screen: ScreenType) => void;
  onUpdateProfile: (updatedUser: UserProfile, updatedCv?: TailoredCvData) => void;
  onExportPdf: (title?: string) => void;
  onExportDocx: (title?: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  tailoredCv,
  onNavigate,
  onUpdateProfile,
  onExportPdf,
  onExportDocx,
}) => {
  // Master Profile State
  const [profile, setProfile] = useState<UserProfile>({
    ...user,
    experiences: user.experiences || tailoredCv.experiences || [],
    education: user.education || tailoredCv.education || [],
    skills: user.skills || tailoredCv.skills || [],
    bio: user.bio || tailoredCv.summary || '',
    certifications: user.certifications || [],
    projects: user.projects || [],
    languages: user.languages || [],
  });

  // Sync state whenever the user prop updates (e.g. when resume is parsed)
  useEffect(() => {
    setProfile({
      ...user,
      experiences: user.experiences || [],
      education: user.education || [],
      skills: user.skills || [],
      bio: user.bio || '',
      certifications: user.certifications || [],
      projects: user.projects || [],
      languages: user.languages || [],
    });
    setHeaderForm({
      name: user.name || '',
      role: user.role || '',
      location: user.location || '',
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || '',
    });
  }, [user]);

  // Retractable section states (All retracted / collapsed by default for maximum speed and simplicity)
  const [openSections, setOpenSections] = useState({
    experience: false,
    education: false,
    skills: true, // Skills open by default for quick glance
    projects: false,
    certifications: false,
  });

  // UI Modals & Popups
  const [showSaveSuccessModal, setShowSaveSuccessModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Edit Header / Bio Modal
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [headerForm, setHeaderForm] = useState({
    name: profile.name,
    role: profile.role,
    location: profile.location || '',
    email: profile.email,
    phone: profile.phone,
    bio: profile.bio || '',
  });

  // Experience Modal
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [editingExpIndex, setEditingExpIndex] = useState<number | null>(null);
  const [expForm, setExpForm] = useState<CvExperience>({
    id: '',
    company: '',
    role: '',
    location: '',
    dates: '',
    bullets: [''],
  });

  // Education Modal
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [editingEduIndex, setEditingEduIndex] = useState<number | null>(null);
  const [eduForm, setEduForm] = useState<CvEducation>({
    id: '',
    school: '',
    degree: '',
    dates: '',
    fieldOfStudy: '',
  });

  // Project Modal
  const [projModalOpen, setProjModalOpen] = useState(false);
  const [editingProjIndex, setEditingProjIndex] = useState<number | null>(null);
  const [projForm, setProjForm] = useState<ProfileProject>({
    id: '',
    title: '',
    description: '',
    link: '',
    skills: [],
  });
  const [projSkillsInput, setProjSkillsInput] = useState('');

  // Cert Modal
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certForm, setCertForm] = useState<ProfileCertification>({
    id: '',
    title: '',
    issuer: '',
    date: '',
  });

  // Quick Skill input
  const [newSkillInput, setNewSkillInput] = useState('');

  // Toggle Section Collapse/Expand
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Expand / Collapse All
  const handleToggleAll = (expand: boolean) => {
    setOpenSections({
      experience: expand,
      education: expand,
      skills: expand,
      projects: expand,
      certifications: expand,
    });
  };

  // Save / Synchronize Profile Action (called from the bottom bar)
  const handleSaveProfile = () => {
    const updatedCv: TailoredCvData = {
      ...tailoredCv,
      name: profile.name,
      role: profile.role,
      email: profile.email,
      phone: profile.phone,
      location: profile.location || tailoredCv.location,
      summary: profile.bio || tailoredCv.summary,
      skills: profile.skills,
      experiences: profile.experiences || tailoredCv.experiences,
      education: profile.education || tailoredCv.education,
    };

    const updatedUser: UserProfile = {
      ...profile,
      experienceCount: profile.experiences?.length || 0,
      educationCount: profile.education?.length || 0,
      projectsCount: profile.projects?.length || 0,
    };

    onUpdateProfile(updatedUser, updatedCv);
    setShowSaveSuccessModal(true);
  };

  // Save Header edits
  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile((prev) => ({
      ...prev,
      name: headerForm.name,
      role: headerForm.role,
      location: headerForm.location,
      email: headerForm.email,
      phone: headerForm.phone,
      bio: headerForm.bio,
    }));
    setIsEditingHeader(false);
  };

  // Quick Skill Add / Remove
  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed || profile.skills.includes(trimmed)) return;
    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmed],
    }));
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  // Experience Handlers
  const handleOpenAddExp = () => {
    setEditingExpIndex(null);
    setExpForm({
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      location: profile.location || 'Remote',
      dates: 'Jan 2024 – Present',
      bullets: [''],
    });
    setExpModalOpen(true);
  };

  const handleOpenEditExp = (index: number) => {
    const item = profile.experiences?.[index];
    if (!item) return;
    setEditingExpIndex(index);
    setExpForm({ ...item, bullets: [...item.bullets] });
    setExpModalOpen(true);
  };

  const handleDeleteExp = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      experiences: prev.experiences?.filter((_, i) => i !== index),
    }));
  };

  const handleSaveExpModal = (e: React.FormEvent) => {
    e.preventDefault();
    const currentExps = [...(profile.experiences || [])];
    const cleanBullets = expForm.bullets.filter((b) => b.trim().length > 0);
    const updated = {
      ...expForm,
      bullets: cleanBullets.length > 0 ? cleanBullets : ['Executed key responsibilities.'],
    };

    if (editingExpIndex !== null) {
      currentExps[editingExpIndex] = updated;
    } else {
      currentExps.unshift(updated);
    }
    setProfile((prev) => ({ ...prev, experiences: currentExps }));
    setExpModalOpen(false);
  };

  // Education Handlers
  const handleOpenAddEdu = () => {
    setEditingEduIndex(null);
    setEduForm({
      id: `edu-${Date.now()}`,
      school: '',
      degree: '',
      dates: '2020 – 2024',
      fieldOfStudy: '',
    });
    setEduModalOpen(true);
  };

  const handleOpenEditEdu = (index: number) => {
    const item = profile.education?.[index];
    if (!item) return;
    setEditingEduIndex(index);
    setEduForm({ ...item });
    setEduModalOpen(true);
  };

  const handleDeleteEdu = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education?.filter((_, i) => i !== index),
    }));
  };

  const handleSaveEduModal = (e: React.FormEvent) => {
    e.preventDefault();
    const currentEdus = [...(profile.education || [])];
    if (editingEduIndex !== null) {
      currentEdus[editingEduIndex] = eduForm;
    } else {
      currentEdus.unshift(eduForm);
    }
    setProfile((prev) => ({ ...prev, education: currentEdus }));
    setEduModalOpen(false);
  };

  // Project Handlers
  const handleOpenAddProj = () => {
    setEditingProjIndex(null);
    setProjForm({
      id: `proj-${Date.now()}`,
      title: '',
      description: '',
      link: '',
      skills: [],
    });
    setProjSkillsInput('');
    setProjModalOpen(true);
  };

  const handleOpenEditProj = (index: number) => {
    const item = profile.projects?.[index];
    if (!item) return;
    setEditingProjIndex(index);
    setProjForm({ ...item });
    setProjSkillsInput(item.skills.join(', '));
    setProjModalOpen(true);
  };

  const handleDeleteProj = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      projects: prev.projects?.filter((_, i) => i !== index),
    }));
  };

  const handleSaveProjModal = (e: React.FormEvent) => {
    e.preventDefault();
    const skillList = projSkillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const updated = { ...projForm, skills: skillList };
    const current = [...(profile.projects || [])];
    if (editingProjIndex !== null) {
      current[editingProjIndex] = updated;
    } else {
      current.unshift(updated);
    }
    setProfile((prev) => ({ ...prev, projects: current }));
    setProjModalOpen(false);
  };

  // Certification Handlers
  const handleOpenAddCert = () => {
    setCertForm({
      id: `cert-${Date.now()}`,
      title: '',
      issuer: '',
      date: 'Issued ' + new Date().getFullYear(),
    });
    setCertModalOpen(true);
  };

  const handleDeleteCert = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      certifications: prev.certifications?.filter((c) => c.id !== id),
    }));
  };

  const handleSaveCertModal = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile((prev) => ({
      ...prev,
      certifications: [...(prev.certifications || []), certForm],
    }));
    setCertModalOpen(false);
  };

  const allExpanded = Object.values(openSections).every(Boolean);

  return (
    <div id="master-profile-screen" className="p-4 sm:p-6 md:p-8 max-w-[1080px] mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* ========================================================================= */}
      {/* 1. CLEAN IDENTITY & SUMMARY CARD (WITH "VIEW STORED CVS" AT TOP) */}
      {/* ========================================================================= */}
      <div className="bg-[#1c1b1b] border border-[#434655]/50 rounded-2xl p-5 sm:p-7 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#434655]/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2563eb] to-[#38bdf8] flex items-center justify-center text-white font-headline text-[20px] font-bold shadow-md shrink-0">
              {profile.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline text-[22px] sm:text-[24px] font-bold text-white tracking-tight">
                  {profile.name}
                </h1>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 font-semibold">
                  Master Profile
                </span>
              </div>
              <p className="font-body text-[14.5px] font-semibold text-[#b4c5ff] mt-0.5">
                {profile.role}
              </p>
            </div>
          </div>

          {/* Top Header Actions: Export + Edit Info */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-start sm:justify-end">
            {/* Export Dropdown / Action */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#434655]/60 text-[#c3c6d7] hover:text-white text-[13px] font-headline font-semibold transition-all cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[17px]">download</span>
                <span>Export</span>
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>

              {showExportMenu && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowExportMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-44 bg-[#1c1b1b] border border-[#434655] rounded-xl shadow-2xl py-1.5 z-30 animate-fade-in text-[12.5px]">
                    <button
                      onClick={() => {
                        setShowExportMenu(false);
                        onExportPdf(`${profile.name.replace(/\s+/g, '_')}_Master_CV.pdf`);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-[#2a2a2a] text-[#c3c6d7] hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#ffb4ab]">picture_as_pdf</span>
                      <span>Download PDF</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowExportMenu(false);
                        onExportDocx(`${profile.name.replace(/\s+/g, '_')}_Master_CV.docx`);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-[#2a2a2a] text-[#c3c6d7] hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#38bdf8]">article</span>
                      <span>Download DOCX</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => {
                setHeaderForm({
                  name: profile.name,
                  role: profile.role,
                  location: profile.location || 'San Francisco, CA',
                  email: profile.email,
                  phone: profile.phone,
                  bio: profile.bio || '',
                });
                setIsEditingHeader(true);
              }}
              className="p-2 rounded-xl bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#434655]/60 text-[#c3c6d7] hover:text-white transition-all cursor-pointer"
              title="Edit headline & contact details"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
          </div>
        </div>

        {/* Contact Information Row */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-[12.5px] text-[#8d90a0]">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#38bdf8]">location_on</span>
            <span className="text-[#c3c6d7]">{profile.location || 'San Francisco, CA'}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#38bdf8]">mail</span>
            <span className="text-[#c3c6d7]">{profile.email}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#38bdf8]">call</span>
            <span className="text-[#c3c6d7]">{profile.phone}</span>
          </span>
        </div>

        {/* Bio Snippet */}
        <div className="text-[13px] text-[#c3c6d7] leading-relaxed bg-[#141414] p-3.5 rounded-xl border border-[#434655]/30">
          <p className="line-clamp-2">{profile.bio}</p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. RETRACTABLE SECTIONS HEADER */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[12px] font-headline font-semibold text-[#8d90a0] uppercase tracking-wider">
          Career Qualifications ({profile.experiences?.length || 0} Roles • {profile.education?.length || 0} Degrees • {profile.skills.length} Skills)
        </span>
        <button
          onClick={() => handleToggleAll(!allExpanded)}
          className="text-[12px] text-[#38bdf8] hover:underline font-semibold cursor-pointer flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[15px]">
            {allExpanded ? 'unfold_less' : 'unfold_more'}
          </span>
          <span>{allExpanded ? 'Retract All' : 'Expand All'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. RETRACTABLE SECTION 1: WORK EXPERIENCE */}
      {/* ========================================================================= */}
      <div className="bg-[#1c1b1b] border border-[#434655]/50 rounded-2xl overflow-hidden shadow-md transition-all">
        <div
          onClick={() => toggleSection('experience')}
          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none hover:bg-[#201f1f] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#2563eb]/20 text-[#38bdf8] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">work</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline text-[16px] font-bold text-white">
                  Work Experience
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#353534] text-[#c3c6d7] font-semibold">
                  {profile.experiences?.length || 0}
                </span>
              </div>
              {!openSections.experience && profile.experiences && profile.experiences.length > 0 && (
                <p className="text-[12px] text-[#8d90a0] truncate max-w-md mt-0.5">
                  Latest: {profile.experiences[0].role} at {profile.experiences[0].company} ({profile.experiences[0].dates})
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenAddExp();
              }}
              className="px-3 py-1 rounded-lg bg-[#353534] hover:bg-[#434655] text-[#38bdf8] text-[12px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">add</span>
              <span>Add Role</span>
            </button>
            <span className="material-symbols-outlined text-[20px] text-[#8d90a0] transition-transform duration-200">
              {openSections.experience ? 'expand_less' : 'expand_more'}
            </span>
          </div>
        </div>

        {openSections.experience && (
          <div className="p-4 sm:p-5 pt-0 border-t border-[#434655]/30 space-y-3 animate-fade-in">
            {profile.experiences && profile.experiences.length > 0 ? (
              profile.experiences.map((exp, idx) => (
                <div
                  key={exp.id || idx}
                  className="p-4 rounded-xl bg-[#141414] border border-[#434655]/40 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-headline text-[15px] font-bold text-white">
                          {exp.role}
                        </span>
                        <span className="text-[#8d90a0]">•</span>
                        <span className="font-headline text-[13.5px] font-semibold text-[#38bdf8]">
                          {exp.company}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#8d90a0] mt-0.5">
                        {exp.dates} {exp.location ? `• ${exp.location}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditExp(idx)}
                        className="w-7 h-7 rounded-lg hover:bg-[#353534] text-[#c3c6d7] hover:text-white flex items-center justify-center cursor-pointer"
                        title="Edit Experience"
                      >
                        <span className="material-symbols-outlined text-[15px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteExp(idx)}
                        className="w-7 h-7 rounded-lg hover:bg-[#353534] text-[#8d90a0] hover:text-[#ffb4ab] flex items-center justify-center cursor-pointer"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[15px]">delete</span>
                      </button>
                    </div>
                  </div>

                  <ul className="list-disc pl-5 text-[12.5px] text-[#c3c6d7] space-y-1 pt-1">
                    {exp.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <div className="text-center py-5 text-[13px] text-[#8d90a0]">
                No experience added yet. Click &quot;Add Role&quot; above to record your employment history.
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. RETRACTABLE SECTION 2: EDUCATION */}
      {/* ========================================================================= */}
      <div className="bg-[#1c1b1b] border border-[#434655]/50 rounded-2xl overflow-hidden shadow-md transition-all">
        <div
          onClick={() => toggleSection('education')}
          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none hover:bg-[#201f1f] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#10b981]/20 text-[#4edea3] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">school</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline text-[16px] font-bold text-white">
                  Education & Degrees
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#353534] text-[#c3c6d7] font-semibold">
                  {profile.education?.length || 0}
                </span>
              </div>
              {!openSections.education && profile.education && profile.education.length > 0 && (
                <p className="text-[12px] text-[#8d90a0] truncate max-w-md mt-0.5">
                  {profile.education[0].degree} — {profile.education[0].school} ({profile.education[0].dates})
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenAddEdu();
              }}
              className="px-3 py-1 rounded-lg bg-[#353534] hover:bg-[#434655] text-[#4edea3] text-[12px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">add</span>
              <span>Add Degree</span>
            </button>
            <span className="material-symbols-outlined text-[20px] text-[#8d90a0] transition-transform duration-200">
              {openSections.education ? 'expand_less' : 'expand_more'}
            </span>
          </div>
        </div>

        {openSections.education && (
          <div className="p-4 sm:p-5 pt-0 border-t border-[#434655]/30 space-y-3 animate-fade-in">
            {profile.education && profile.education.length > 0 ? (
              profile.education.map((edu, idx) => (
                <div
                  key={edu.id || idx}
                  className="p-3.5 rounded-xl bg-[#141414] border border-[#434655]/40 flex items-start justify-between gap-2"
                >
                  <div>
                    <span className="font-headline text-[14.5px] font-bold text-white block">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                    </span>
                    <span className="text-[13px] text-[#38bdf8]">{edu.school}</span>
                    <span className="text-[12px] text-[#8d90a0] block">{edu.dates}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditEdu(idx)}
                      className="w-7 h-7 rounded-lg hover:bg-[#353534] text-[#c3c6d7] hover:text-white flex items-center justify-center cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteEdu(idx)}
                      className="w-7 h-7 rounded-lg hover:bg-[#353534] text-[#8d90a0] hover:text-[#ffb4ab] flex items-center justify-center cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">delete</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5 text-[13px] text-[#8d90a0]">
                No education added. Click &quot;Add Degree&quot; to include university or college credentials.
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. RETRACTABLE SECTION 3: CORE SKILLS & KEYWORDS */}
      {/* ========================================================================= */}
      <div className="bg-[#1c1b1b] border border-[#434655]/50 rounded-2xl overflow-hidden shadow-md transition-all">
        <div
          onClick={() => toggleSection('skills')}
          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none hover:bg-[#201f1f] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#8b5cf6]/20 text-[#a78bfa] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline text-[16px] font-bold text-white">
                  Core Skills & Keywords
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#353534] text-[#c3c6d7] font-semibold">
                  {profile.skills.length}
                </span>
              </div>
              <p className="text-[12px] text-[#8d90a0] mt-0.5">
                Targeted keywords evaluated during AI ATS scoring
              </p>
            </div>
          </div>

          <span className="material-symbols-outlined text-[20px] text-[#8d90a0] transition-transform duration-200">
            {openSections.skills ? 'expand_less' : 'expand_more'}
          </span>
        </div>

        {openSections.skills && (
          <div className="p-4 sm:p-5 pt-0 border-t border-[#434655]/30 space-y-3 animate-fade-in">
            <div className="flex flex-wrap gap-1.5 pt-1">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#141414] text-[#e5e2e1] text-[12px] font-medium border border-[#434655]/60 hover:border-[#38bdf8] transition-colors"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-[#8d90a0] hover:text-[#ffb4ab] cursor-pointer ml-0.5 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 max-w-md pt-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Type a skill and press Enter..."
                className="flex-1 bg-[#141414] border border-[#434655] rounded-xl px-3 py-1.5 text-[13px] text-white outline-none focus:border-[#38bdf8]"
              />
              <button
                onClick={handleAddSkill}
                className="px-3.5 py-1.5 bg-[#353534] hover:bg-[#434655] text-[#38bdf8] text-[12.5px] font-bold rounded-xl transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 6. RETRACTABLE SECTION 4: PROJECTS */}
      {/* ========================================================================= */}
      <div className="bg-[#1c1b1b] border border-[#434655]/50 rounded-2xl overflow-hidden shadow-md transition-all">
        <div
          onClick={() => toggleSection('projects')}
          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none hover:bg-[#201f1f] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#f59e0b]/20 text-[#fbbf24] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">folder_special</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline text-[16px] font-bold text-white">
                  Key Projects & Highlights
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#353534] text-[#c3c6d7] font-semibold">
                  {profile.projects?.length || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenAddProj();
              }}
              className="px-3 py-1 rounded-lg bg-[#353534] hover:bg-[#434655] text-[#fbbf24] text-[12px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">add</span>
              <span>Add Project</span>
            </button>
            <span className="material-symbols-outlined text-[20px] text-[#8d90a0] transition-transform duration-200">
              {openSections.projects ? 'expand_less' : 'expand_more'}
            </span>
          </div>
        </div>

        {openSections.projects && (
          <div className="p-4 sm:p-5 pt-0 border-t border-[#434655]/30 space-y-3 animate-fade-in">
            {profile.projects && profile.projects.length > 0 ? (
              profile.projects.map((proj, idx) => (
                <div
                  key={proj.id || idx}
                  className="p-3.5 rounded-xl bg-[#141414] border border-[#434655]/40 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-headline text-[14.5px] font-bold text-white">
                      {proj.title}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditProj(idx)}
                        className="w-7 h-7 rounded-lg hover:bg-[#353534] text-[#c3c6d7] hover:text-white flex items-center justify-center cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProj(idx)}
                        className="w-7 h-7 rounded-lg hover:bg-[#353534] text-[#8d90a0] hover:text-[#ffb4ab] flex items-center justify-center cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">delete</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[12.5px] text-[#c3c6d7] leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-[#201f1f] text-[#38bdf8] text-[10.5px] font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5 text-[13px] text-[#8d90a0]">
                No projects added yet.
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 7. RETRACTABLE SECTION 5: CERTIFICATIONS */}
      {/* ========================================================================= */}
      <div className="bg-[#1c1b1b] border border-[#434655]/50 rounded-2xl overflow-hidden shadow-md transition-all">
        <div
          onClick={() => toggleSection('certifications')}
          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none hover:bg-[#201f1f] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#ec4899]/20 text-[#f472b6] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline text-[16px] font-bold text-white">
                  Certifications
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#353534] text-[#c3c6d7] font-semibold">
                  {profile.certifications?.length || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenAddCert();
              }}
              className="px-3 py-1 rounded-lg bg-[#353534] hover:bg-[#434655] text-[#f472b6] text-[12px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">add</span>
              <span>Add Cert</span>
            </button>
            <span className="material-symbols-outlined text-[20px] text-[#8d90a0] transition-transform duration-200">
              {openSections.certifications ? 'expand_less' : 'expand_more'}
            </span>
          </div>
        </div>

        {openSections.certifications && (
          <div className="p-4 sm:p-5 pt-0 border-t border-[#434655]/30 space-y-2 animate-fade-in">
            {profile.certifications && profile.certifications.length > 0 ? (
              profile.certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="p-3 rounded-xl bg-[#141414] border border-[#434655]/40 flex items-center justify-between"
                >
                  <div>
                    <span className="font-headline text-[14px] font-bold text-white block">
                      {cert.title}
                    </span>
                    <span className="text-[12px] text-[#38bdf8]">{cert.issuer}</span>
                    <span className="text-[11px] text-[#8d90a0] ml-2">({cert.date})</span>
                  </div>

                  <button
                    onClick={() => handleDeleteCert(cert.id)}
                    className="w-7 h-7 rounded-lg hover:bg-[#353534] text-[#8d90a0] hover:text-[#ffb4ab] flex items-center justify-center cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">delete</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-[13px] text-[#8d90a0]">
                No certifications recorded.
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 8. PROMINENT BOTTOM ACTION BAR (UPDATE PROFILE) */}
      {/* ========================================================================= */}
      <div className="bg-[#1c1b1b] border border-[#2563eb]/40 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <h4 className="font-headline text-[15px] font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <span>Ready to save your updates?</span>
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-ping" />
          </h4>
          <p className="text-[12.5px] text-[#8d90a0]">
            Updates will instantly synchronize across your live Master CV and AI application engines.
          </p>
        </div>

        <button
          id="btn-update-profile-bottom"
          onClick={handleSaveProfile}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-headline text-[14px] font-bold transition-all shadow-[0_0_25px_rgba(37,99,235,0.45)] cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2.5 shrink-0"
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          <span>Update Profile & Sync CV</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* CELEBRATORY SAVE SUCCESS MODAL */}
      {/* ========================================================================= */}
      {showSaveSuccessModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div className="w-full max-w-md bg-[#1c1b1b] border border-[#10b981]/60 rounded-2xl p-6 sm:p-7 shadow-[0_0_50px_rgba(16,185,129,0.25)] space-y-5 text-center relative overflow-hidden">
            <div className="w-14 h-14 rounded-full bg-[#10b981]/20 border-2 border-[#10b981] flex items-center justify-center mx-auto text-[#4edea3] shadow-lg">
              <span
                className="material-symbols-outlined text-[32px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-headline text-[20px] font-bold text-white tracking-tight">
                Profile Saved Successfully!
              </h3>
              <p className="text-[13px] text-[#c3c6d7] leading-relaxed">
                All profile updates have been synchronized with your Master Resume and are ready for tailoring.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                id="btn-modal-view-cv"
                onClick={() => {
                  setShowSaveSuccessModal(false);
                  onNavigate('tailored-cv');
                }}
                className="w-full py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-headline text-[13.5px] font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">description</span>
                <span>View Updated CV</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onExportPdf(`${profile.name.replace(/\s+/g, '_')}_Master_CV.pdf`);
                  }}
                  className="py-2.5 rounded-xl bg-[#201f1f] hover:bg-[#2a2a2a] text-[#c3c6d7] hover:text-white font-headline text-[12px] font-semibold transition-colors flex items-center justify-center gap-1.5 border border-[#434655]/50 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
                  <span>Export PDF</span>
                </button>

                <button
                  onClick={() => {
                    onExportDocx(`${profile.name.replace(/\s+/g, '_')}_Master_CV.docx`);
                  }}
                  className="py-2.5 rounded-xl bg-[#201f1f] hover:bg-[#2a2a2a] text-[#c3c6d7] hover:text-white font-headline text-[12px] font-semibold transition-colors flex items-center justify-center gap-1.5 border border-[#434655]/50 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">article</span>
                  <span>Export DOCX</span>
                </button>
              </div>

              <button
                onClick={() => setShowSaveSuccessModal(false)}
                className="w-full py-2 text-[12.5px] text-[#8d90a0] hover:text-white font-medium cursor-pointer transition-colors"
              >
                Continue Editing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT USER DETAILS & BIO */}
      {/* ========================================================================= */}
      {isEditingHeader && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div className="w-full max-w-lg bg-[#1c1b1b] border border-[#434655] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-[18px] font-bold text-white">
                Edit Personal Info & Bio
              </h3>
              <button
                onClick={() => setIsEditingHeader(false)}
                className="text-[#8d90a0] hover:text-white p-1 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveHeader} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-headline font-semibold text-[#c3c6d7] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={headerForm.name}
                    onChange={(e) => setHeaderForm({ ...headerForm, name: e.target.value })}
                    className="w-full bg-[#141414] border border-[#434655] rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-headline font-semibold text-[#c3c6d7] mb-1">
                    Target Role
                  </label>
                  <input
                    type="text"
                    required
                    value={headerForm.role}
                    onChange={(e) => setHeaderForm({ ...headerForm, role: e.target.value })}
                    className="w-full bg-[#141414] border border-[#434655] rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#38bdf8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-headline font-semibold text-[#c3c6d7] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={headerForm.email}
                    onChange={(e) => setHeaderForm({ ...headerForm, email: e.target.value })}
                    className="w-full bg-[#141414] border border-[#434655] rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-headline font-semibold text-[#c3c6d7] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={headerForm.location}
                    onChange={(e) => setHeaderForm({ ...headerForm, location: e.target.value })}
                    className="w-full bg-[#141414] border border-[#434655] rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#38bdf8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-headline font-semibold text-[#c3c6d7] mb-1">
                  Professional Bio
                </label>
                <textarea
                  rows={4}
                  value={headerForm.bio}
                  onChange={(e) => setHeaderForm({ ...headerForm, bio: e.target.value })}
                  className="w-full bg-[#141414] border border-[#434655] rounded-xl p-2.5 text-[12.5px] text-white outline-none focus:border-[#38bdf8] leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#434655]/40">
                <button
                  type="button"
                  onClick={() => setIsEditingHeader(false)}
                  className="px-3.5 py-1.5 rounded-xl text-[#c3c6d7] hover:bg-[#201f1f] text-[12.5px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[12.5px] font-bold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT WORK EXPERIENCE */}
      {/* ========================================================================= */}
      {expModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div className="w-full max-w-lg bg-[#1c1b1b] border border-[#434655] rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-[18px] font-bold text-white">
                {editingExpIndex !== null ? 'Edit Experience' : 'Add Work Experience'}
              </h3>
              <button
                onClick={() => setExpModalOpen(false)}
                className="text-[#8d90a0] hover:text-white p-1 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveExpModal} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-headline font-semibold text-[#c3c6d7] mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={expForm.role}
                    onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                    placeholder="e.g. Lead Engineer"
                    className="w-full bg-[#141414] border border-[#434655] rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-headline font-semibold text-[#c3c6d7] mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={expForm.company}
                    onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                    placeholder="e.g. Nexus Systems"
                    className="w-full bg-[#141414] border border-[#434655] rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#38bdf8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-headline font-semibold text-[#c3c6d7] mb-1">
                    Dates *
                  </label>
                  <input
                    type="text"
                    required
                    value={expForm.dates}
                    onChange={(e) => setExpForm({ ...expForm, dates: e.target.value })}
                    placeholder="e.g. Oct 2022 – Present"
                    className="w-full bg-[#141414] border border-[#434655] rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-headline font-semibold text-[#c3c6d7] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={expForm.location}
                    onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                    placeholder="e.g. Remote / San Francisco"
                    className="w-full bg-[#141414] border border-[#434655] rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#38bdf8]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[12px] font-headline font-semibold text-[#c3c6d7]">
                    Key Responsibilities / Bullets
                  </label>
                  <button
                    type="button"
                    onClick={() => setExpForm({ ...expForm, bullets: [...expForm.bullets, ''] })}
                    className="text-[11.5px] text-[#38bdf8] hover:underline cursor-pointer"
                  >
                    + Add bullet
                  </button>
                </div>

                {expForm.bullets.map((b, bIdx) => (
                  <div key={bIdx} className="flex gap-2">
                    <textarea
                      rows={2}
                      value={b}
                      onChange={(e) => {
                        const next = [...expForm.bullets];
                        next[bIdx] = e.target.value;
                        setExpForm({ ...expForm, bullets: next });
                      }}
                      className="flex-1 bg-[#141414] border border-[#434655] rounded-xl p-2 text-[12.5px] text-white outline-none focus:border-[#38bdf8]"
                    />
                    {expForm.bullets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setExpForm({
                            ...expForm,
                            bullets: expForm.bullets.filter((_, i) => i !== bIdx),
                          });
                        }}
                        className="text-[#8d90a0] hover:text-[#ffb4ab] self-center p-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#434655]/40">
                <button
                  type="button"
                  onClick={() => setExpModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-[#c3c6d7] hover:bg-[#201f1f] text-[12.5px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[12.5px] font-bold"
                >
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT EDUCATION */}
      {/* ========================================================================= */}
      {eduModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div className="w-full max-w-md bg-[#1c1b1b] border border-[#434655] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-[18px] font-bold text-white">
                {editingEduIndex !== null ? 'Edit Degree' : 'Add Degree'}
              </h3>
              <button
                onClick={() => setEduModalOpen(false)}
                className="text-[#8d90a0] hover:text-white p-1 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEduModal} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-headline font-semibold text-[#c3c6d7] mb-1">
                  School / University *
                </label>
                <input
                  type="text"
                  required
                  value={eduForm.school}
                  onChange={(e) => setEduForm({ ...eduForm, school: e.target.value })}
                  placeholder="e.g. UC Berkeley"
                  className="w-full bg-[#141414] border border-[#434655] rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-headline font-semibold text-[#c3c6d7] mb-1">
                    Degree *
                  </label>
                  <input
                    type="text"
                    required
                    value={eduForm.degree}
                    onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                    placeholder="e.g. B.S."
                    className="w-full bg-[#141414] border border-[#434655] rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-headline font-semibold text-[#c3c6d7] mb-1">
                    Dates *
                  </label>
                  <input
                    type="text"
                    required
                    value={eduForm.dates}
                    onChange={(e) => setEduForm({ ...eduForm, dates: e.target.value })}
                    placeholder="e.g. 2018 – 2022"
                    className="w-full bg-[#141414] border border-[#434655] rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#38bdf8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-headline font-semibold text-[#c3c6d7] mb-1">
                  Field of Study
                </label>
                <input
                  type="text"
                  value={eduForm.fieldOfStudy || ''}
                  onChange={(e) => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })}
                  placeholder="e.g. Computer Science"
                  className="w-full bg-[#141414] border border-[#434655] rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#434655]/40">
                <button
                  type="button"
                  onClick={() => setEduModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-[#c3c6d7] hover:bg-[#201f1f] text-[12.5px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[12.5px] font-bold"
                >
                  Save Degree
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT PROJECT */}
      {/* ========================================================================= */}
      {projModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div className="w-full max-w-md bg-[#1c1b1b] border border-[#434655] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-[18px] font-bold text-white">
                {editingProjIndex !== null ? 'Edit Project' : 'Add Project'}
              </h3>
              <button
                onClick={() => setProjModalOpen(false)}
                className="text-[#8d90a0] hover:text-white p-1 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProjModal} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-headline font-semibold text-[#c3c6d7] mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={projForm.title}
                  onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                  placeholder="e.g. Real-time Analytics Dashboard"
                  className="w-full bg-[#141414] border border-[#434655] rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-headline font-semibold text-[#c3c6d7] mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={projForm.description}
                  onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                  placeholder="Summarize the project outcome..."
                  className="w-full bg-[#141414] border border-[#434655] rounded-xl p-2.5 text-[12.5px] text-white outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-headline font-semibold text-[#c3c6d7] mb-1">
                  Skills Used (comma-separated)
                </label>
                <input
                  type="text"
                  value={projSkillsInput}
                  onChange={(e) => setProjSkillsInput(e.target.value)}
                  placeholder="e.g. Python, FastAPI, Docker"
                  className="w-full bg-[#141414] border border-[#434655] rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#434655]/40">
                <button
                  type="button"
                  onClick={() => setProjModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-[#c3c6d7] hover:bg-[#201f1f] text-[12.5px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[12.5px] font-bold"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD CERTIFICATION */}
      {/* ========================================================================= */}
      {certModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div className="w-full max-w-md bg-[#1c1b1b] border border-[#434655] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-[18px] font-bold text-white">
                Add Certification
              </h3>
              <button
                onClick={() => setCertModalOpen(false)}
                className="text-[#8d90a0] hover:text-white p-1 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveCertModal} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-headline font-semibold text-[#c3c6d7] mb-1">
                  Certification Title *
                </label>
                <input
                  type="text"
                  required
                  value={certForm.title}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="w-full bg-[#141414] border border-[#434655] rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-headline font-semibold text-[#c3c6d7] mb-1">
                  Issuer / Organization *
                </label>
                <input
                  type="text"
                  required
                  value={certForm.issuer}
                  onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                  placeholder="e.g. Amazon Web Services"
                  className="w-full bg-[#141414] border border-[#434655] rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#434655]/40">
                <button
                  type="button"
                  onClick={() => setCertModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-[#c3c6d7] hover:bg-[#201f1f] text-[12.5px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[12.5px] font-bold"
                >
                  Save Cert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfileView;
