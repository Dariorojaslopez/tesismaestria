"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AnimatePresence } from "framer-motion";
import { ChatDrawer } from "./ChatDrawer";
import { FloatingChatButton } from "./FloatingChatButton";

type ChatShellContextValue = {
  open: boolean;
  openChat: () => void;
  closeChat: () => void;
};

const ChatShellContext = createContext<ChatShellContextValue | null>(null);

export function useChatShell() {
  const ctx = useContext(ChatShellContext);
  if (!ctx) {
    throw new Error("useChatShell debe usarse dentro de ChatShellProvider");
  }
  return ctx;
}

export function ChatShellProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openChat = useCallback(() => setOpen(true), []);
  const closeChat = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeChat]);

  const value = useMemo(
    () => ({ open, openChat, closeChat }),
    [open, openChat, closeChat],
  );

  return (
    <ChatShellContext.Provider value={value}>
      {children}
      <FloatingChatButton onOpen={openChat} hidden={open} />
      <AnimatePresence>
        {open ? <ChatDrawer key="chat-drawer" onClose={closeChat} /> : null}
      </AnimatePresence>
    </ChatShellContext.Provider>
  );
}
