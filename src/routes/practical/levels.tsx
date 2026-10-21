import { Outlet, createFileRoute } from "@tanstack/react-router";

/** Shared route shell for all six syllabus levels. */
export const Route = createFileRoute("/practical/levels")({
  component: () => <Outlet />,
});
