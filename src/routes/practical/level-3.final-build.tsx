import {J12345Assessment} from "@/components/j5/J12345Assessment";
import { createFileRoute } from "@tanstack/react-router";
import { FinalBuildExam } from "@/components/practical/FinalBuildExam";

export const Route = createFileRoute("/practical/level-3/final-build")({
  component: () => import.meta.env["VITE_J5_PRIVATE_UI"]==="true"?<J12345Assessment mode="challenge" level={3}/>:<FinalBuildExam level={3} />,
});
