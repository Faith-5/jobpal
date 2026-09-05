import React, { useState } from 'react';
import { JobApplication, ScreenType } from '../types';

interface ApplicationsViewProps {
  applications: JobApplication[];
  onNavigate: (screen: ScreenType) => void;
  onAddApplication: (app: JobApplication) => void;
  onUpdateStatus: (id: string, newStatus: JobApplication['status']) => void;
  onDeleteApplication?: (id: string) => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  onNavigate,
  onAddApplication,
  onUpdateStatus,
  onDeleteApplication,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [notes, setNotes] = useState('');
  const [filter, setFilter] = useState('All');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role) return;

    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      company,
      role,
      logoText: company.slice(0, 2).toUpperCase(),
      status: 'Applied',
      appliedDate: 'Just now',
      atsScore: Math.floor(Math.random() * 12) + 84, // 84-96%
      location: location || 'Remote',
      salary: salary || '$150,000 - $180,000',
      notes,
    };

    onAddApplication(newApp);
    setShowAddModal(false);
    setCompany('');
    setRole('');
    setLocation('');
    setSalary('');
    setNotes('');
  };

  const filtered = applications.filter((app) => (filter === 'All' ? true : app.status === filter));

  return (
    <div id="applications-screen" className="p-4 sm:p-6 md:p-8 max-w-[1240px] mx-auto space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline text-[24px] sm:text-[30px] font-bold text-[#e5e2e1] tracking-tight">
            Job Applications Tracker
          </h1>
          <p className="font-body text-[14px] sm:text-[15px] text-[#c3c6d7]">
            Manage your tailored applications, stages, and submissions
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-headline text-[13px] font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.35)] cursor-pointer active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add Application</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#1c1b1b] border border-[#434655]/40 rounded-xl p-4 shadow-md">
          <span className="text-[11.5px] font-headline text-[#8d90a0] uppercase font-semibold">Total Tracked</span>
          <div className="font-headline text-[22px] sm:text-[24px] font-bold text-[#e5e2e1] mt-1">{applications.length}</div>
        </div>
        <div className="bg-[#1c1b1b] border border-[#434655]/40 rounded-xl p-4 shadow-md">
          <span className="text-[11.5px] font-headline text-[#8d90a0] uppercase font-semibold">Interviewing</span>
          <div className="font-headline text-[22px] sm:text-[24px] font-bold text-[#b4c5ff] mt-1">
            {applications.filter((a) => a.status === 'Interviewing').length}
          </div>
        </div>
        <div className="bg-[#1c1b1b] border border-[#434655]/40 rounded-xl p-4 shadow-md">
          <span className="text-[11.5px] font-headline text-[#8d90a0] uppercase font-semibold">Offers Received</span>
          <div className="font-headline text-[22px] sm:text-[24px] font-bold text-[#4edea3] mt-1">
            {applications.filter((a) => a.status === 'Offer').length}
          </div>
        </div>
        <div className="bg-[#1c1b1b] border border-[#434655]/40 rounded-xl p-4 shadow-md">
          <span className="text-[11.5px] font-headline text-[#8d90a0] uppercase font-semibold">Avg. ATS Match</span>
          <div className="font-headline text-[22px] sm:text-[24px] font-bold text-[#e5e2e1] mt-1">
            {Math.round(applications.reduce((acc, curr) => acc + curr.atsScore, 0) / (applications.length || 1))}%
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#434655]/40 pb-3 overflow-x-auto">
        {['All', 'Interviewing', 'Applied', 'Offer', 'Draft'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl font-headline text-[12.5px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              filter === tab
                ? 'bg-[#3c4962] text-[#eeefff]'
                : 'text-[#8d90a0] hover:text-[#e5e2e1] hover:bg-[#201f1f]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid of Applications */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="bg-[#1c1b1b] border border-[#434655]/40 rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col justify-between space-y-4 hover:border-[#8d90a0]/60 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#353534] border border-[#434655]/50 flex items-center justify-center font-headline font-bold text-[#b4c5ff] text-[15px] shrink-0">
                      {app.logoText}
                    </div>
                    <div>
                      <h3 className="font-headline text-[16px] sm:text-[17px] font-bold text-[#e5e2e1]">
                        {app.role}
                      </h3>
                      <p className="font-body text-[13px] text-[#b4c5ff] font-medium">
                        {app.company}
                      </p>
                    </div>
                  </div>

                  {/* Stage dropdown & Delete Icon */}
                  <div className="flex items-center gap-2">
                    <select
                      value={app.status}
                      onChange={(e) => onUpdateStatus(app.id, e.target.value as any)}
                      className="bg-[#201f1f] text-[#e5e2e1] border border-[#434655] rounded-lg px-2.5 py-1 text-[11.5px] font-semibold font-headline outline-none cursor-pointer"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Applied">Applied</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    {/* Delete Application Button */}
                    {onDeleteApplication && (
                      <button
                        onClick={() => onDeleteApplication(app.id)}
                        className="w-7 h-7 rounded-lg hover:bg-red-950/40 text-[#8d90a0] hover:text-[#ffb4ab] border border-transparent hover:border-red-500/30 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        title="Delete application"
                        aria-label={`Delete application for ${app.company}`}
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[12px] text-[#c3c6d7] py-2.5 border-y border-[#434655]/30">
                  <div>
                    <span className="text-[#8d90a0]">Location: </span>
                    {app.location}
                  </div>
                  {app.salary && (
                    <div>
                      <span className="text-[#8d90a0]">Comp: </span>
                      {app.salary}
                    </div>
                  )}
                  <div>
                    <span className="text-[#8d90a0]">Applied: </span>
                    {app.appliedDate}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#8d90a0]">ATS Match: </span>
                    <span className="font-bold text-[#4edea3]">{app.atsScore}%</span>
                  </div>
                </div>

                {app.notes && (
                  <p className="font-body text-[12.5px] text-[#8d90a0] mt-2.5 italic">
                    &ldquo;{app.notes}&rdquo;
                  </p>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#434655]/20">
                <button
                  onClick={() => onNavigate('tailored-cv')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#353534] hover:bg-[#434655] text-[#b4c5ff] hover:text-white text-[12px] font-semibold transition-colors cursor-pointer"
                >
                  View Resume
                </button>
                <button
                  onClick={() => onNavigate('cover-letter')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[12px] font-semibold transition-colors cursor-pointer"
                >
                  Cover Letter
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-[#1c1b1b] border border-[#434655]/40 rounded-2xl p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#353534] flex items-center justify-center mx-auto text-[#8d90a0]">
            <span className="material-symbols-outlined text-[24px]">assignment_turned_in</span>
          </div>
          <h3 className="font-headline text-[16px] font-bold text-white">No applications found in &quot;{filter}&quot;</h3>
          <p className="text-[13px] text-[#8d90a0] max-w-sm mx-auto">
            Add a new role using the button above or apply from your tailored resume.
          </p>
        </div>
      )}

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#1c1b1b] border border-[#434655] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-[18px] font-bold text-[#e5e2e1]">
                Add New Job Application
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#8d90a0] hover:text-white p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-[12px] font-headline text-[#c3c6d7] font-semibold mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Stripe, Acme Corp"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-[#131313] border border-[#434655] rounded-xl px-3 py-2 text-[13px] text-[#e5e2e1] outline-none focus:border-[#b4c5ff]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-headline text-[#c3c6d7] font-semibold mb-1">
                  Target Role *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Machine Learning Engineer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#131313] border border-[#434655] rounded-xl px-3 py-2 text-[13px] text-[#e5e2e1] outline-none focus:border-[#b4c5ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-headline text-[#c3c6d7] font-semibold mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Remote / NYC"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#131313] border border-[#434655] rounded-xl px-3 py-2 text-[13px] text-[#e5e2e1] outline-none focus:border-[#b4c5ff]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-headline text-[#c3c6d7] font-semibold mb-1">
                    Est. Compensation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $160k - $190k"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full bg-[#131313] border border-[#434655] rounded-xl px-3 py-2 text-[13px] text-[#e5e2e1] outline-none focus:border-[#b4c5ff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-headline text-[#c3c6d7] font-semibold mb-1">
                  Notes / Referrals
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Referred by Alex; hiring manager is Sarah."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#131313] border border-[#434655] rounded-xl p-2.5 text-[12.5px] text-[#e5e2e1] outline-none focus:border-[#b4c5ff]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#434655]/40">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-[13px] text-[#c3c6d7] hover:bg-[#201f1f] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-headline text-[13px] font-bold shadow-md cursor-pointer"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsView;
