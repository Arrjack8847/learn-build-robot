import {
  BatteryCharging,
  BookOpenCheck,
  Gauge,
  ListChecks,
  PackagePlus,
  Repeat2,
  type LucideIcon,
} from "lucide-react";

export const competitionInfo = {
  eyebrow: "Student robotics challenge",
  name: "RoboLearn Robotics Competition",
  description:
    "Learn the challenge, build your robot one step at a time, then prepare it to perform reliably on competition day.",
  journey: ["Learn", "Build", "Test", "Compete"],
} as const;

export interface CompetitionTip {
  id: string;
  title: string;
  description: string;
  action: string;
  icon: LucideIcon;
}

export const competitionTips: CompetitionTip[] = [
  {
    id: "rules",
    title: "Know How to Score",
    description:
      "Read the official challenge rules before practising. Learn which tasks earn points, what loses points and how much time you have.",
    action: "Ask your coach to show you the official scoring sheet.",
    icon: BookOpenCheck,
  },
  {
    id: "check",
    title: "Check Every Connection",
    description:
      "A loose wheel or cable can stop a great robot. Check the structure, wiring and sensors before every practice run.",
    action: "Use the same quick check before every run.",
    icon: ListChecks,
  },
  {
    id: "battery",
    title: "Start With Full Power",
    description:
      "Low batteries make motors slower and sensors less reliable. Charge your battery and bring a ready spare when the rules allow it.",
    action: "Label charged and used batteries so they never get mixed up.",
    icon: BatteryCharging,
  },
  {
    id: "repeat",
    title: "Practise More Than Once",
    description:
      "A winning robot should work repeatedly, not only once. Run the same challenge several times and write down every failure.",
    action: "Aim for three successful runs in a row.",
    icon: Repeat2,
  },
  {
    id: "reliable",
    title: "Reliable Beats Reckless",
    description:
      "The fastest robot does not always win. Use the fastest speed that still lets your robot finish the task consistently.",
    action: "Increase speed only after the robot becomes reliable.",
    icon: Gauge,
  },
  {
    id: "backup",
    title: "Prepare a Backup Kit",
    description:
      "Bring the permitted spare cables, wheels, fasteners, tools, batteries and a backup copy of your program.",
    action: "Pack and check your competition kit the day before.",
    icon: PackagePlus,
  },
];
