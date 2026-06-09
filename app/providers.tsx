"use client";

import { ChatShellProvider } from "@/components/chat";
import { SiteNav } from "@/components/layout";
import { AppStoreProvider } from "@/components/store/AppStoreProvider";
import { PwaRegister } from "@/components/system/PwaRegister";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppStoreProvider>
      <ChatShellProvider>
        <PwaRegister />
        <SiteNav />
        {children}
      </ChatShellProvider>
    </AppStoreProvider>
  );
}
