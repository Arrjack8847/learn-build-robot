import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import {J5CourseGate} from "@/components/j5/J5CourseGate";
import { AppShell } from "@/components/layout/AppShell";
import { APP_NAME } from "@/config/app";
import { ProgressProvider } from "@/context/ProgressContext";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Error 404</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The learning page you requested does not exist or may have moved.
        </p>
        <Link
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          to="/"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.error("BE STEM READY page error:", error);
  }, [error]);

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4 text-center">
      <div className="max-w-md">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-destructive">
          Something went wrong
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">This page didn’t load</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Try loading the page again. Your saved prototype progress will remain on this device.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            className="min-h-11 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            type="button"
          >
            Try again
          </button>
          <a
            className="inline-flex min-h-11 items-center rounded-xl border bg-card px-5 py-2.5 text-sm font-semibold transition hover:bg-secondary"
            href="/"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${APP_NAME} | Learn Robotics by Building` },
      {
        name: "description",
        content: "Explore six levels of hands-on robotics projects with guided building instructions.",
      },
      { name: "author", content: APP_NAME },
      { property: "og:title", content: `${APP_NAME} | Learn Robotics by Building` },
      {
        property: "og:description",
        content: "Explore six levels of hands-on robotics projects with guided building instructions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // Reuse the cross-origin connection before Level 6 fetches its first PDF byte.
      { rel: "preconnect", href: "https://fe3fa828-9f74-45e8-97f7-8d00cbb7fba0.usrfiles.com", crossOrigin: "anonymous" },
      { rel: "icon", href: "/home/be-stem-ready-logo.svg", type: "image/svg+xml" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ProgressProvider>
        <AppShell>
          <J5CourseGate><Outlet /></J5CourseGate>
        </AppShell>
      </ProgressProvider>
    </QueryClientProvider>
  );
}
