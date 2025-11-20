"use client";

import { ReactNode, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import useLayoutService from "@/lib/hooks/useLayout";

interface SessionProviderWrapperProps {
  children: ReactNode;
  session: Session | null;
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useLayoutService();

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
}

export default function SessionProviderWrapper({
  children,
  session,
}: SessionProviderWrapperProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  );
}
