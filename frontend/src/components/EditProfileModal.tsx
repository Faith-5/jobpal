import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface EditProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: UserProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData(user);
      setNewSkill('');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed || formData.skills.includes(trimmed)) return;
    setFormData({
      ...formData,
      skills: [...formData.skills, trimmed],
    });
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#1c1b1b] border border-[#434655] rounded-2xl p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-[20px] font-bold text-[#e5e2e1]">
            Edit Master Profile
          </h3>
          <button
            onClick={onClose}
            className="text-[#8d90a0] hover:text-white p-1 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-headline text-[#c3c6d7] font-semibold mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#201f1f] border border-[#434655] rounded-xl px-3 py-2 text-[14px] text-[#e5e2e1] outline-none focus:border-[#b4c5ff]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-headline text-[#c3c6d7] font-semibold mb-1">
                Target Headline Role
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-[#201f1f] border border-[#434655] rounded-xl px-3 py-2 text-[14px] text-[#e5e2e1] outline-none focus:border-[#b4c5ff]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-headline text-[#c3c6d7] font-semibold mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#201f1f] border border-[#434655] rounded-xl px-3 py-2 text-[14px] text-[#e5e2e1] outline-none focus:border-[#b4c5ff]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-headline text-[#c3c6d7] font-semibold mb-1">
                Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#201f1f] border border-[#434655] rounded-xl px-3 py-2 text-[14px] text-[#e5e2e1] outline-none focus:border-[#b4c5ff]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[12px] font-headline text-[#c3c6d7] font-semibold mb-1">
                Roles Count
              </label>
              <input
                type="number"
                min="0"
                value={formData.experienceCount}
                onChange={(e) =>
                  setFormData({ ...formData, experienceCount: Math.max(0, Number(e.target.value)) })
                }
                className="w-full bg-[#201f1f] border border-[#434655] rounded-xl px-3 py-2 text-[14px] text-[#e5e2e1] outline-none focus:border-[#b4c5ff]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-headline text-[#c3c6d7] font-semibold mb-1">
                Degrees
              </label>
              <input
                type="number"
                min="0"
                value={formData.educationCount}
                onChange={(e) =>
                  setFormData({ ...formData, educationCount: Math.max(0, Number(e.target.value)) })
                }
                className="w-full bg-[#201f1f] border border-[#434655] rounded-xl px-3 py-2 text-[14px] text-[#e5e2e1] outline-none focus:border-[#b4c5ff]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-headline text-[#c3c6d7] font-semibold mb-1">
                Projects
              </label>
              <input
                type="number"
                min="0"
                value={formData.projectsCount}
                onChange={(e) =>
                  setFormData({ ...formData, projectsCount: Math.max(0, Number(e.target.value)) })
                }
                className="w-full bg-[#201f1f] border border-[#434655] rounded-xl px-3 py-2 text-[14px] text-[#e5e2e1] outline-none focus:border-[#b4c5ff]"
              />
            </div>
          </div>

          {/* Skills Management */}
          <div>
            <label className="block text-[12px] font-headline text-[#c3c6d7] font-semibold mb-1">
              Indexed Skills & Keywords
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g. Design Systems, Prototyping"
                className="flex-1 bg-[#201f1f] border border-[#434655] rounded-xl px-3 py-2 text-[13px] text-[#e5e2e1] outline-none focus:border-[#b4c5ff]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-[#353534] hover:bg-[#434655] text-[#b4c5ff] text-[13px] font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-[#131313] rounded-xl border border-[#434655]/40">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#353534] text-[#e5e2e1] text-[12px] border border-[#434655]"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-[#8d90a0] hover:text-[#ffb4ab] cursor-pointer"
                    aria-label={`Remove ${skill}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[#c3c6d7] hover:bg-[#201f1f] text-[13px] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[13px] font-semibold shadow-md transition-all cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
