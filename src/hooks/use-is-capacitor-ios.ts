import { useEffect, useState } from 'react';

/**
 * Detects if the app is running in a Capacitor iOS WebView.
 * Returns true if on iOS/Capacitor, false otherwise.
 */
export function useIsCapacitorIOS(): boolean {
  const [isCapacitorIOS, setIsCapacitorIOS] = useState(false);

  useEffect(() => {
    const isCapacitor = typeof window !== 'undefined' && !!(window as any).Capacitor;
    if (isCapacitor) {
      const cap = (window as any).Capacitor;
      if (
        cap.Plugins &&
        cap.Plugins.Device &&
        typeof cap.Plugins.Device.getInfo === 'function'
      ) {
        cap.Plugins.Device.getInfo()
          .then((info: any) => {
            if (info.platform === 'ios') setIsCapacitorIOS(true);
          })
          .catch(() => {
            // fallback below
          });
      } else {
        // Fallback: user agent check for iOS WebView
        const ua = navigator.userAgent;
        if (/iPhone|iPad|iPod/.test(ua) && /Capacitor/i.test(ua)) {
          setIsCapacitorIOS(true);
        }
      }
    }
  }, []);

  return isCapacitorIOS;
} 