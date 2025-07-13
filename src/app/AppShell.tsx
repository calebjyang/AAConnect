"use client";
import { useEffect, useState } from "react";
import GlobalNavigation from "@/components/GlobalNavigation";
import PwaServiceWorker from "@/components/PwaServiceWorker";
import { useIsCapacitorIOS } from "@/hooks/use-is-capacitor-ios";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const isCapacitorIOS = useIsCapacitorIOS();

  // Use hardcoded fallback for iOS/Capacitor, env for others
  const safeAreaTop = isCapacitorIOS
    ? 'max(env(safe-area-inset-top), 44px)'
    : 'env(safe-area-inset-top, 0px)';

  const mainMarginTop = isCapacitorIOS
    ? 'calc(64px + max(env(safe-area-inset-top), 44px))'
    : 'calc(64px + env(safe-area-inset-top, 0px))';

  return (
    <>
      <PwaServiceWorker />
      <GlobalNavigation safeAreaStyle={{ paddingTop: safeAreaTop }} />
      <main style={{ marginTop: mainMarginTop }}>
        {children}
      </main>
    </>
  );
} 