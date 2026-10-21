import { Outlet, createFileRoute } from "@tanstack/react-router";

/** Layout route so the Level 1 index and each category can render as siblings. */
export const Route = createFileRoute("/practical/level-1")({
  component: () => <Outlet />,
});
