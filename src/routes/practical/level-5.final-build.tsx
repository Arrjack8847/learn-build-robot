import { createFileRoute } from "@tanstack/react-router";
import { FinalBuildExam } from "@/components/practical/FinalBuildExam";

export const Route = createFileRoute("/practical/level-5/final-build")({
  component: () => <FinalBuildExam level={5} />,
});
