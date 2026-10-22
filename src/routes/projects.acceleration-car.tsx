import { createFileRoute } from "@tanstack/react-router";
import { AccelerationLearningStudio } from "@/components/learning/AccelerationLearningStudio";

/** The Acceleration Car project opens the lecture directly.
 * Lecture, Quick Quiz and Building navigation live in the Learning Studio header.
 * There is intentionally no intermediate "Choose your studio" screen.
 */
export const Route = createFileRoute("/projects/acceleration-car")({
  component: AccelerationCarProject,
});

function AccelerationCarProject() {
  return <AccelerationLearningStudio projectPage />;
}
