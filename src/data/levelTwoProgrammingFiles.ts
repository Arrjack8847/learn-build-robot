/** Original Level 2 Scratch programs. Keep filenames unchanged when copying to public/. */
export interface ProgrammingFile {
  fileName: string;
  url: string;
}

const levelTwoProgrammingSources = [
  ["level-2-axe-robot", "Action-Oriented/Axe robot/Axe robot_program.sb2"],
  ["level-2-batting-robot", "Action-Oriented/Batting robot/Batting robot - program.sb2"],
  ["level-2-fan-robot", "Action-Oriented/Fan robot/Fan robot_program.sb2"],
  ["level-2-push-ups", "Action-Oriented/Push ups/Push ups_program.sb2"],
  ["level-2-throwing-robot", "Action-Oriented/Throwing robot/Throwing robot_program.sb2"],
  ["level-2-spinning-bike", "Mechanisms & Simulators/Spinning bike/Spinning bike_program.sb2"],
  ["level-2-swing", "Mechanisms & Simulators/Swing/Swing-program.sb2"],
  ["level-2-treadmill", "Mechanisms & Simulators/Treadmill/Treadmill-program.sb2"],
  ["level-2-battery-robot", "Programming & Precise Control/Battery robot/Battery robot_program.sb2"],
  ["level-2-helicopter", "Vehicles & Complex Movers/Helicopter/Helicopter_program.sb2"],
] as const;

export const levelTwoProgrammingFiles: Record<string, readonly ProgrammingFile[]> =
  Object.fromEntries(levelTwoProgrammingSources.map(([projectId, relativePath]) => [
    projectId,
    [{
      fileName: relativePath.split("/").at(-1)!,
      url: "/Level%202/Programming/" + relativePath.split("/").map(encodeURIComponent).join("/"),
    }],
  ]));

export const getLevelTwoProgrammingFiles = (projectId: string): readonly ProgrammingFile[] =>
  levelTwoProgrammingFiles[projectId] ?? [];
