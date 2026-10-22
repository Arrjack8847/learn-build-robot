import { createFileRoute } from "@tanstack/react-router";
import { AccelerationLearningStudio } from "@/components/learning/AccelerationLearningStudio";

export const Route = createFileRoute("/acceleration-learning")({
  component: AccelerationLearningStudio,
});
