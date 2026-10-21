/** Original GitHub-uploaded PDF manuals, with no invented assembly steps. */
import cagedBirdUrl from "../../Caged Bird.pdf?url";
import funnyCatUrl from "../../FUNNY CAT.pdf?url";
import ferociousSnakeUrl from "../../Ferocious snake.pdf?url";
import shyPenguinUrl from "../../Shy penguin.pdf?url";
import sledDogUrl from "../../Sled dog.pdf?url";
import bigHeadRobotUrl from "../../Big head robot_Building.pdf?url";
import birdUrl from "../../Bird.pdf?url";
import firstRobotModelUrl from "../../First Robot Model.pdf?url";
import houseUrl from "../../House_Building.pdf?url";
import rexRobotUrl from "../../REX robot_Building.pdf?url";
import sledUrl from "../../Sled_Building.pdf?url";
import spiderUrl from "../../Spider.pdf?url";
import spongeBobUrl from "../../SpongeBob_Building.pdf?url";
import waliRobotUrl from "../../Wali robot.pdf?url";

export interface PdfActivityManual {
  id: string;
  title: string;
  url: string;
  completionStepId: string;
}

export const pdfActivityManuals: Record<string, PdfActivityManual> = {
  "caged-bird": {
    id: "caged-bird", title: "Caged Bird", url: cagedBirdUrl,
    completionStepId: "caged-bird-manual-complete",
  },
  "funny-cat": {
    id: "funny-cat", title: "Funny Cat", url: funnyCatUrl,
    completionStepId: "funny-cat-manual-complete",
  },
  "ferocious-snake": {
    id: "ferocious-snake", title: "Ferocious Snake", url: ferociousSnakeUrl,
    completionStepId: "ferocious-snake-manual-complete",
  },
  "shy-penguin": {
    id: "shy-penguin", title: "Shy Penguin", url: shyPenguinUrl,
    completionStepId: "shy-penguin-manual-complete",
  },
  "sled-dog": {
    id: "sled-dog", title: "Sled Dog", url: sledDogUrl,
    completionStepId: "sled-dog-manual-complete",
  },
  "big-head-robot": {
    id: "big-head-robot", title: "Big Head Robot", url: bigHeadRobotUrl,
    completionStepId: "big-head-robot-manual-complete",
  },
  "bird": {
    id: "bird", title: "Bird", url: birdUrl,
    completionStepId: "bird-manual-complete",
  },
  "first-robot-model": {
    id: "first-robot-model", title: "First Robot Model", url: firstRobotModelUrl,
    completionStepId: "first-robot-model-manual-complete",
  },
  "house": {
    id: "house", title: "House", url: houseUrl,
    completionStepId: "house-manual-complete",
  },
  "rex-robot": {
    id: "rex-robot", title: "REX Robot", url: rexRobotUrl,
    completionStepId: "rex-robot-manual-complete",
  },
  "sled": {
    id: "sled", title: "Sled", url: sledUrl,
    completionStepId: "sled-manual-complete",
  },
  "spider": {
    id: "spider", title: "Spider", url: spiderUrl,
    completionStepId: "spider-manual-complete",
  },
  "spongebob": {
    id: "spongebob", title: "SpongeBob", url: spongeBobUrl,
    completionStepId: "spongebob-manual-complete",
  },
  "wali-robot": {
    id: "wali-robot", title: "Wali Robot", url: waliRobotUrl,
    completionStepId: "wali-robot-manual-complete",
  },
};

export function isPdfActivityProject(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(pdfActivityManuals, id);
}
