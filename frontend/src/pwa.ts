import { registerSW } from 'virtual:pwa-register';
import { useState, useEffect, useCallback } from 'react';

// Initialize and export SW registration function
export function initPWARegistration(
  onNeedRefresh?: () => void,
  onOfflineReady?: () => void
) {
  if ('serviceWorker' in navigator) {
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        console.log('[PWA] New content available, ready to update.');
        if (onNeedRefresh) {
          onNeedRefresh();
        }
      },
      onOfflineReady() {
        console.log('[PWA] App is ready to work offline.');
        if (onOfflineReady) {
          onOfflineReady();
        }
      },
      onRegisterError(error) {
        console.error('[PWA] Service Worker registration failed:', error);
      },
    });

    return updateSW;
  }
  return () => {};
}

// React Hook for handling the PWA BeforeInstallPrompt event
export function usePWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    );
  });
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('jobpal_pwa_dismissed') === 'true';
  });

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent default mini-infobar or browser banner
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log('[PWA] App was successfully installed');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }

    // Show browser install dialog
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA] User response to install prompt:', outcome);

    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      return true;
    }

    return false;
  }, [deferredPrompt]);

  const dismissPrompt = useCallback(() => {
    setIsDismissed(true);
    localStorage.setItem('jobpal_pwa_dismissed', 'true');
  }, []);

  const resetDismiss = useCallback(() => {
    setIsDismissed(false);
    localStorage.removeItem('jobpal_pwa_dismissed');
  }, []);

  return {
    isInstallable: isInstallable && !isInstalled,
    isInstalled,
    isDismissed,
    promptInstall,
    dismissPrompt,
    resetDismiss,
  };
}

// React Hook for monitoring Online / Offline network state
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
