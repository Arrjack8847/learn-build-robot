import type { ReactNode } from "react";

/** Minimal shell for the level-based STEM experience. Individual studios manage their own layout. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="h-[100dvh] overflow-hidden bg-background text-foreground">
      <a
        className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        href="#main-content"
      >
        Skip to content
      </a>
      <main className="h-full overflow-hidden" id="main-content">
        {children}
      </main>
    </div>
  );
}
