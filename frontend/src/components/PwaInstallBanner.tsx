import React from 'react';
import { usePWAInstallPrompt, useNetworkStatus } from '../pwa';

interface PwaInstallBannerProps {
  onNeedRefresh?: boolean;
  onRefreshClick?: () => void;
}

export const PwaInstallBanner: React.FC<PwaInstallBannerProps> = ({
  onNeedRefresh = false,
  onRefreshClick,
}) => {
  const { isInstallable, isDismissed, promptInstall, dismissPrompt } = usePWAInstallPrompt();
  const isOnline = useNetworkStatus();

  return (
    <>
      {/* Offline Alert Badge */}
      {!isOnline && (
        <div
          role="status"
          id="offline-indicator-banner"
          className="bg-amber-500/15 border-b border-amber-500/30 text-amber-300 px-4 py-2 text-[13px] font-medium flex items-center justify-center gap-2 sticky top-0 z-40 backdrop-blur-md animate-fade-in"
        >
          <span className="material-symbols-outlined text-[18px]">cloud_off</span>
          <span>You are currently offline. JobPal is running in offline mode with cached data.</span>
        </div>
      )}

      {/* SW Update Ready Alert */}
      {onNeedRefresh && (
        <div
          role="alert"
          id="pwa-update-banner"
          className="bg-blue-600/90 text-white px-4 py-3 text-[13px] font-medium flex items-center justify-between gap-4 sticky top-0 z-40 shadow-lg backdrop-blur-md animate-fade-in"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-blue-200">
              system_update
            </span>
            <span>A new version of JobPal is available!</span>
          </div>
          <button
            onClick={onRefreshClick}
            className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg font-semibold text-[12px] transition-colors cursor-pointer"
          >
            Update Now
          </button>
        </div>
      )}

      {/* Install App Floating Banner */}
      {isInstallable && !isDismissed && (
        <div
          id="pwa-install-banner"
          className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-[#1e293b] border border-[#334155] rounded-2xl p-4 shadow-2xl shadow-black/50 text-[#e2e8f0] animate-fade-in flex items-start gap-3.5 backdrop-blur-lg"
        >
          <img
            src="/icons/icon-192x192.png"
            alt="JobPal"
            className="w-12 h-12 rounded-xl shadow-md flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-headline font-bold text-white text-[14px]">
                Install JobPal AI App
              </h4>
              <button
                onClick={dismissPrompt}
                className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                aria-label="Dismiss install prompt"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="text-[12px] text-slate-300 mt-1 leading-snug">
              Install JobPal for faster load times, offline access, and an app experience on your desktop or mobile device.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <button
                id="btn-pwa-install-confirm"
                onClick={promptInstall}
                className="bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-[12px] font-semibold px-3.5 py-1.5 rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Install Now
              </button>
              <button
                onClick={dismissPrompt}
                className="text-slate-400 hover:text-white text-[12px] px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
