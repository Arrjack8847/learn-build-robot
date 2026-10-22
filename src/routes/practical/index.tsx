import { createFileRoute, redirect } from "@tanstack/react-router";

/** Retain legacy URLs without rendering the outdated swipe-based robot catalogue. */
export const Route = createFileRoute("/practical/")({
  beforeLoad: () => {
    throw redirect({ to: "/practical/levels" });
  },
});
