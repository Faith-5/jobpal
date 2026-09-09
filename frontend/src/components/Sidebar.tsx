import React, { useState } from "react";
import { ScreenType, UserProfile } from "../types";
import { usePWAInstallPrompt } from "../pwa";

interface SidebarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  user: UserProfile;
  onSignOut: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  user,
  onSignOut,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { isInstallable, promptInstall } = usePWAInstallPrompt();

  const navItems: { screen: ScreenType; label: string; icon: string }[] = [
    { screen: "dashboard", label: "Dashboard", icon: "dashboard" },
    { screen: "profile", label: "Profile", icon: "account_circle" },
    { screen: "ats-score", label: "ATS Score", icon: "analytics" },
    {
      screen: "applications",
      label: "Applications",
      icon: "assignment_turned_in",
    },
    { screen: "documents", label: "Documents", icon: "folder_open" },
    { screen: "settings", label: "Settings", icon: "settings" },
  ];

  const handleNavClick = (screen: ScreenType) => {
    onNavigate(screen);
    setMobileDrawerOpen(false);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MOBILE TOP APP BAR (VISIBLE ON < md SCREENS) */}
      {/* ========================================================================= */}
      <header className="md:hidden bg-[#1c1b1b] border-b border-[#434655]/40 h-14 fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 select-none shadow-md">
        <div
          onClick={() => handleNavClick("dashboard")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src="/logo.svg"
            alt=""
            className="w-8 h-8 rounded-xl shadow-sm"
          />
          <span className="font-headline text-[16px] font-bold text-white tracking-tight">
            JobPal AI
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isInstallable && (
            <button
              onClick={promptInstall}
              id="btn-mobile-pwa-install"
              className="bg-blue-600/90 text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
              title="Install JobPal App"
            >
              <span className="material-symbols-outlined text-[15px]">download</span>
              <span>Install</span>
            </button>
          )}

          <button
            onClick={() => handleNavClick("profile")}
            className="w-8 h-8 rounded-full overflow-hidden border border-[#8d90a0]/40 shrink-0"
            title="Go to Profile"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </button>

          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="w-9 h-9 rounded-xl bg-[#201f1f] text-[#c3c6d7] hover:text-white flex items-center justify-center border border-[#434655]/40 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[20px]">
              {mobileDrawerOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MOBILE DRAWER OVERLAY & MENU (SLIDE-IN) */}
      {/* ========================================================================= */}
      {mobileDrawerOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="md:hidden fixed top-0 right-0 bottom-0 w-72 bg-[#1c1b1b] border-l border-[#434655]/50 z-50 flex flex-col p-5 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#434655]/40 mb-3">
              <div
                onClick={() => handleNavClick("profile")}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#8d90a0]/40">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-headline text-[14px] font-bold text-white truncate max-w-[140px]">
                    {user.name}
                  </h4>
                  <span className="text-[11px] text-[#4edea3] font-semibold">
                    {user.plan}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#201f1f] text-[#8d90a0] hover:text-white flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>

            <nav className="flex-1 space-y-1.5 overflow-y-auto py-2">
              {navItems.map((item) => {
                const isActive = currentScreen === item.screen;
                return (
                  <button
                    key={item.screen}
                    onClick={() => handleNavClick(item.screen)}
                    className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-headline text-[14px] font-semibold transition-all cursor-pointer text-left ${
                      isActive
                        ? "bg-[#2563eb] text-white shadow-md"
                        : "text-[#c3c6d7] hover:bg-[#201f1f] hover:text-white"
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{
                        fontVariationSettings: isActive
                          ? "'FILL' 1"
                          : "'FILL' 0",
                      }}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-[#434655]/40 space-y-1">
              {isInstallable && (
                <button
                  id="btn-drawer-pwa-install"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    promptInstall();
                  }}
                  className="w-full flex items-center gap-3.5 px-3.5 py-2.5 bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 rounded-xl transition-all font-headline text-[13.5px] font-semibold cursor-pointer text-left border border-blue-500/30"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    download
                  </span>
                  <span>Install JobPal App</span>
                </button>
              )}

              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  onSignOut();
                }}
                className="w-full flex items-center gap-3.5 px-3.5 py-2.5 text-[#ffb4ab] hover:bg-red-950/30 rounded-xl transition-all font-headline text-[13.5px] font-semibold cursor-pointer text-left"
              >
                <span className="material-symbols-outlined text-[20px]">
                  logout
                </span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 3. MOBILE BOTTOM NAVIGATION BAR (FIXED ON PHONES) */}
      {/* ========================================================================= */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#1c1b1b] border-t border-[#434655]/40 flex items-center justify-around z-40 select-none shadow-2xl px-1"
      >
        {navItems.map((item) => {
          const isActive = currentScreen === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => handleNavClick(item.screen)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
                isActive
                  ? "text-[#38bdf8]"
                  : "text-[#8d90a0] hover:text-[#c3c6d7]"
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-headline font-semibold mt-0.5 truncate max-w-[54px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ========================================================================= */}
      {/* 4. DESKTOP PERMANENT SIDEBAR (HIDDEN ON MOBILE, VISIBLE ON md+ SCREENS) */}
      {/* ========================================================================= */}
      <aside
        id="sidebar-navigation"
        className="hidden md:flex bg-[#1c1b1b] border-r border-[#434655]/40 h-screen w-64 fixed left-0 top-0 flex-col p-4 gap-2 z-40 select-none shadow-xl"
      >
        {/* User / Brand Profile Area */}
        <div
          id="sidebar-user-header"
          onClick={() => onNavigate("profile")}
          className="flex items-center gap-3 mb-4 p-2 rounded-xl hover:bg-[#353534]/50 cursor-pointer transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#353534] flex items-center justify-center overflow-hidden shrink-0 border border-[#8d90a0]/30 shadow-md">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-headline text-[15px] font-bold text-[#b4c5ff] truncate leading-tight">
              {user.name}
            </h1>
            <p className="font-headline text-[11px] font-semibold text-[#4edea3] tracking-wide truncate">
              {user.plan}
            </p>
          </div>
        </div>

        {/* Nav items */}
        <nav id="sidebar-nav-links" className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = currentScreen === item.screen;
            return (
              <button
                key={item.screen}
                id={`nav-link-${item.screen}`}
                onClick={() => onNavigate(item.screen)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-headline text-[13px] font-semibold transition-all cursor-pointer text-left ${
                  isActive
                    ? "bg-[#3c4962] text-[#eeefff] shadow-inner scale-[0.99]"
                    : "text-[#c3c6d7] hover:bg-[#353534]/70 hover:text-[#e5e2e1]"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Navigation */}
        <div
          id="sidebar-footer-links"
          className="mt-auto border-t border-[#434655]/40 pt-2 space-y-1"
        >
          {isInstallable && (
            <button
              id="sidebar-pwa-install-btn"
              onClick={promptInstall}
              className="w-full flex items-center gap-3.5 px-3.5 py-2 text-[#93c5fd] hover:bg-[#2563eb]/20 hover:text-white rounded-xl transition-all font-headline text-[13px] font-semibold cursor-pointer text-left border border-[#2563eb]/30"
            >
              <span className="material-symbols-outlined text-[20px] text-[#60a5fa]">
                download
              </span>
              <span>Install Desktop App</span>
            </button>
          )}

          <button
            id="nav-link-help"
            onClick={() =>
              alert(
                "JobPal AI Help Center: Contact support@jobpal.ai or view our prompt tailoring guides.",
              )
            }
            className="w-full flex items-center gap-3.5 px-3.5 py-2 text-[#c3c6d7] hover:bg-[#353534]/70 hover:text-[#e5e2e1] rounded-xl transition-all font-headline text-[13px] font-semibold cursor-pointer text-left"
          >
            <span className="material-symbols-outlined text-[20px]">help</span>
            <span>Help Center</span>
          </button>
          <button
            id="nav-link-signout"
            onClick={onSignOut}
            className="w-full flex items-center gap-3.5 px-3.5 py-2 text-[#c3c6d7] hover:bg-[#353534]/70 hover:text-[#ffb4ab] rounded-xl transition-all font-headline text-[13px] font-semibold cursor-pointer text-left"
          >
            <span className="material-symbols-outlined text-[20px]">
              logout
            </span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
