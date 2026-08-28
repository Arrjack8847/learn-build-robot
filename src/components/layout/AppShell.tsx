import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Bot, CircuitBoard, Home, LineChart, UserRound } from "lucide-react";
import type { ReactNode } from "react";

import { APP_NAME, APP_TAGLINE, IS_DEMO_CONTENT } from "@/config/app";
import { useProgress } from "@/context/ProgressContext";

const navigation = [
  { label: "Home", shortLabel: "Home", to: "/", icon: Home },
  { label: "Theory", shortLabel: "Theory", to: "/theory", icon: BookOpen },
  { label: "Robot Practical", shortLabel: "Practical", to: "/practical", icon: Bot },
  { label: "Progress", shortLabel: "Progress", to: "/progress", icon: LineChart },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { progress } = useProgress();
  const immersive =
    pathname === "/" ||
    pathname === "/join" ||
    pathname === "/choose" ||
    pathname === "/quiz" ||
    pathname.startsWith("/theory") ||
    pathname.startsWith("/practical");

  if (immersive) {
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

  const isActive = (to: (typeof navigation)[number]["to"]) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        href="#main-content"
      >
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col overflow-hidden bg-navy text-navy-foreground lg:flex">
        <div aria-hidden="true" className="circuit-grid-dark absolute inset-0 opacity-40" />
        <div className="relative flex h-full flex-col">
          <Link className="flex items-center gap-3 border-b border-sidebar-border px-6 py-6" to="/">
            <BrandMark />
            <span>
              <span className="block text-base font-bold tracking-tight">{APP_NAME}</span>
              <span className="block text-xs text-navy-muted">{APP_TAGLINE}</span>
            </span>
          </Link>

          <nav aria-label="Main navigation" className="flex-1 space-y-1 px-3 py-6">
            {navigation.map(({ label, to, icon: Icon }) => {
              const active = isActive(to);
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-navy-muted hover:bg-navy-hover hover:text-navy-foreground"
                  }`}
                  key={to}
                  to={to}
                >
                  <Icon aria-hidden="true" className="size-5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="relative border-t border-sidebar-border p-4">
            {IS_DEMO_CONTENT ? (
              <p className="mb-3 rounded-lg bg-navy-hover px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-muted">
                Demo content
              </p>
            ) : null}
            <div className="flex items-center gap-3 px-2">
              <span className="grid size-9 place-items-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
                <UserRound aria-hidden="true" className="size-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold">
                  {progress.studentName || "Student"}
                </span>
                <span className="block text-xs text-navy-muted">Student</span>
              </span>
            </div>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link className="flex items-center gap-2.5" to="/">
            <BrandMark compact />
            <span className="text-base font-bold tracking-tight">{APP_NAME}</span>
          </Link>
          {IS_DEMO_CONTENT ? (
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Demo
            </span>
          ) : null}
        </div>
      </header>

      <main
        className="px-4 pb-28 pt-6 sm:px-6 lg:ml-64 lg:px-10 lg:pb-10 lg:pt-9"
        id="main-content"
      >
        {children}
      </main>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_-18px_rgba(15,23,42,0.35)] backdrop-blur lg:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {navigation.map(({ shortLabel, to, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[11px] font-semibold transition ${
                  active ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-secondary"
                }`}
                key={to}
                to={to}
              >
                <Icon aria-hidden="true" className="size-5" />
                <span>{shortLabel}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm ${
        compact ? "size-9" : "size-10"
      }`}
    >
      <CircuitBoard className={compact ? "size-4" : "size-5"} />
    </span>
  );
}
