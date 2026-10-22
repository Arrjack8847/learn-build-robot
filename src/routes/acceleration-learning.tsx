import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy URL only. The former standalone RoboLearn lecture screen is gone.
 * Learning now opens from the existing Acceleration Car project card.
 */
export const Route = createFileRoute("/acceleration-learning")({
  beforeLoad: () => {
    throw redirect({
      to: "/projects/$projectId",
      params: { projectId: "acceleration-car" },
      replace: true,
    });
  },
});
