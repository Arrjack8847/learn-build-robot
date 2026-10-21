/** Original GitHub-uploaded PDF manuals, with no invented assembly steps. */
import cagedBirdUrl from "../../Caged Bird.pdf?url";
import funnyCatUrl from "../../FUNNY CAT.pdf?url";
import ferociousSnakeUrl from "../../Ferocious snake.pdf?url";
import shyPenguinUrl from "../../Shy penguin.pdf?url";
import sledDogUrl from "../../Sled dog.pdf?url";

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
};

export function isPdfActivityProject(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(pdfActivityManuals, id);
}
