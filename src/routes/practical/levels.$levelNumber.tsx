import { Outlet, createFileRoute } from "@tanstack/react-router";

/** Parent route for a level's categories and robot-project catalog. */
export const Route = createFileRoute("/practical/levels/$levelNumber")({
  component: () => <Outlet />,
});
