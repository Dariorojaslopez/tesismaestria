"use client";

import { ChatShellProvider } from "@/components/chat";
import { SiteNav } from "@/components/layout";
import { PwaRegister } from "@/components/system/PwaRegister";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChatShellProvider>
      <PwaRegister />
      <SiteNav />
      {children}
    </ChatShellProvider>
  );
}
