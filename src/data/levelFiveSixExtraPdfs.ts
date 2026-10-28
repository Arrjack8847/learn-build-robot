/** Verified Wix URLs for eight additional Level 5–6 PDFs stored in curriculum-source/.
 * These are supplementary project sources, official exam documents, and copyright
 * notices—not replacements for existing Learning slides or verified Building manuals.
 * All eight Wix files were confirmed READY with matching byte sizes.
 */
export type SupplementaryPdfAsset = {
  path: string;
  level: 5 | 6;
  kind: "project" | "exam" | "copyright";
  projectId: string | null;
  title: string;
  url: string;
};

export const levelFiveSixExtraPdfFiles: readonly SupplementaryPdfAsset[] = [
  {
    "path": "curriculum-source/Level 5/Advanced Navigation & Control/Tracking car/Tracking car.pdf",
    "level": 5,
    "kind": "project",
    "projectId": "level-5-tracking-car",
    "title": "Tracking car",
    "url": "https://fe3fa828-9f74-45e8-97f7-8d00cbb7fba0.usrfiles.com/ugd/7fc4ca_4f9952696b0c495e936e4305b4f5e0e8.pdf"
  },
  {
    "path": "curriculum-source/Level 5/Complex Mechanisms & Coordinated Motion/Music box/Music box.pdf",
    "level": 5,
    "kind": "project",
    "projectId": "level-5-music-box",
    "title": "Music box",
    "url": "https://fe3fa828-9f74-45e8-97f7-8d00cbb7fba0.usrfiles.com/ugd/7fc4ca_7ebed02ae87041678b0fceedbbfdeae4.pdf"
  },
  {
    "path": "curriculum-source/Level 5/BSR_Robotics_Level_5_Exam.pdf",
    "level": 5,
    "kind": "exam",
    "projectId": null,
    "title": "Level 5 exam paper",
    "url": "https://fe3fa828-9f74-45e8-97f7-8d00cbb7fba0.usrfiles.com/ugd/7fc4ca_0d6ff36fb4da4a5a811e01a6be996cf6.pdf"
  },
  {
    "path": "curriculum-source/Level 5/Copyright Statement.pdf",
    "level": 5,
    "kind": "copyright",
    "projectId": null,
    "title": "Level 5 copyright statement",
    "url": "https://fe3fa828-9f74-45e8-97f7-8d00cbb7fba0.usrfiles.com/ugd/7fc4ca_19e6250dc41a4510bd29a824f3bae2a7.pdf"
  },
  {
    "path": "curriculum-source/Level 6/Biomimicry & Stimulus Response/Matador/Matador.pdf",
    "level": 6,
    "kind": "project",
    "projectId": "level-6-matador",
    "title": "Matador",
    "url": "https://fe3fa828-9f74-45e8-97f7-8d00cbb7fba0.usrfiles.com/ugd/7fc4ca_59044e9305f74fada9ad63cc31a0f54d.pdf"
  },
  {
    "path": "curriculum-source/Level 6/Complex Mechanisms & Coordinated Motion/Dancing Robot/03.Dancing Robot.pdf",
    "level": 6,
    "kind": "project",
    "projectId": "level-6-dancing-robot",
    "title": "Dancing Robot",
    "url": "https://fe3fa828-9f74-45e8-97f7-8d00cbb7fba0.usrfiles.com/ugd/7fc4ca_5162c18239f742de9abb33afecfe3ded.pdf"
  },
  {
    "path": "curriculum-source/Level 6/BSR_Robotics_Level_6_Exam.pdf",
    "level": 6,
    "kind": "exam",
    "projectId": null,
    "title": "Level 6 exam paper",
    "url": "https://fe3fa828-9f74-45e8-97f7-8d00cbb7fba0.usrfiles.com/ugd/7fc4ca_3a4f1f77570e4844b029c1aac863676d.pdf"
  },
  {
    "path": "curriculum-source/Level 6/Copyright Notice.pdf",
    "level": 6,
    "kind": "copyright",
    "projectId": null,
    "title": "Level 6 copyright notice",
    "url": "https://fe3fa828-9f74-45e8-97f7-8d00cbb7fba0.usrfiles.com/ugd/7fc4ca_2cb683db141b4810a186caa35c9957e4.pdf"
  }
];

export function getProjectSupplementaryPdfs(projectId: string): readonly SupplementaryPdfAsset[] {
  return levelFiveSixExtraPdfFiles.filter(file => file.kind === "project" && file.projectId === projectId);
}

export function getLevelExtraPdf(level: number, kind: "exam" | "copyright"): SupplementaryPdfAsset | undefined {
  return levelFiveSixExtraPdfFiles.find(file => file.level === level && file.kind === kind);
}
