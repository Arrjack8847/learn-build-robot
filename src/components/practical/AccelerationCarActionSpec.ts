/**
 * ZMROBO Acceleration Car — guided lesson transcript for manual Steps 1–5.
 *
 * Hole IDs are LOCAL TEACHING LABELS, not manufacturer part numbers.
 * The manual drawing and measured kit CAD are still needed to validate
 * physical hole centers, axes, fits and insertion depths. No numeric CAD
 * position is fabricated here.
 */
export type GuidedAction = {
  title: string;
  instruction: string;
  direction: string;
  sourceHole?: string;
  targetHole?: string;
  connector?: string;
  check: string;
  /** Physical geometry has not yet been validated against the ZMROBO kit. */
  geometryVerified: false;
};

const action = (
  title: string, instruction: string, direction: string, check: string,
  sourceHole?: string, targetHole?: string, connector?: string,
): GuidedAction => ({
  title, instruction, direction, check, sourceHole, targetHole,
  connector, geometryVerified: false,
});

export const ACCELERATION_TITLES = [
  "Build the first gear holder",
  "Install the upper grey gear",
  "Install two red supports",
  "Install the grey L-shaped bracket",
  "Install the yellow gear and lower axle",
] as const;

/** 6 + 3 + 5 + 4 + 4 = 22 explicit learner actions. */
export const ACCELERATION_ACTIONS: readonly (readonly GuidedAction[])[] = [
  [
    action("Install the lower silver bushing",
      "Find the black gear. Match the silver bushing's LB1 opening with BG1 and lower it onto the gear.",
      "Down, along the vertical center axis", "LB1 and BG1 are aligned.", "LB1", "BG1", "Lower silver bushing"),
    action("Insert the vertical silver axle",
      "Push the long silver stick straight down through LB1 and BG1. Leave its upper end pointing up.",
      "Vertically downward", "The axle stands upright above the black gear.", "Axle", "LB1 → BG1", "Long silver cross axle"),
    action("Slide on the black connector block",
      "Put the black block's B1 hole over the silver axle. Leave B2 empty for the blue pin.",
      "Vertically downward along the shaft", "B1 surrounds the shaft; B2 remains free.", "B1", "Vertical axle", "Two-hole block"),
    action("Install the upper silver bushing",
      "Slide the second silver bushing down onto the same stick above the black block.",
      "Vertically downward", "The block sits between the two silver bushings.", "UB1", "Vertical axle", "Upper silver bushing"),
    action("Align the silver connector arm",
      "Put A1 over the upper bushing. Line up A2 with the black block's B2. Keep A3 pointing sideways.",
      "Down onto the upper bushing", "A2 and B2 align; A3 stays clear.", "A1 / A2", "UB1 / B2", "Silver mounting arm"),
    action("Insert the blue pin",
      "Push the blue pin straight down through A2 and B2 to join the arm and the black block.",
      "Vertically downward", "The pin remains visible in both openings.", "A2", "B2", "Blue pin"),
  ],
  [
    action("Find the upper grey gear",
      "Find the grey gear and look for TG1, the cross-shaped hole in the middle.",
      "Inspect above the assembly", "You can identify TG1.", "TG1", undefined, "Grey upper gear"),
    action("Align the grey gear",
      "Move the grey gear above the upright silver axle. Rotate it until its cross-shaped hole fits the shaft.",
      "Align above the shaft", "The gear stays horizontal and the shapes line up.", "TG1", "Vertical axle", "Grey upper gear"),
    action("Seat the grey gear",
      "Lower the grey gear straight down onto the vertical silver axle.",
      "Vertically downward", "Grey gear is above; black gear remains below.", "TG1", "Vertical axle", "Grey upper gear"),
  ],
  [
    action("Find Red Support A",
      "Pick up the first red L-shaped beam and identify its five holes before attaching it.",
      "Inspect near side", "Identify R1–R5 as provisional teaching labels.", "R1–R5", undefined, "Red Support A"),
    action("Position Red Support A",
      "Move the first red support beside the black gear, with its long arm pointing sideways.",
      "Approach the near side", "Its shape matches the near side shown by the manual.", undefined, "Near side of gear holder", "Red Support A"),
    action("Position Red Support B",
      "Move the second red support to the opposite side of the silver arm.",
      "Approach the opposite side", "Both red pieces surround the mounting arm.", undefined, "Opposite side of arm", "Red Support B"),
    action("Align the side-facing holes",
      "Look through the two red supports and A3 in the silver arm. Make one straight sideways tunnel.",
      "Inspect along the horizontal axle axis", "Confirm the real joining holes before fastening.", "Proposed R4 / A3 / R4", "Side-facing tunnel"),
    action("Insert the horizontal silver axle",
      "Push the silver axle sideways through the three matching openings.",
      "Horizontally along the hole axis", "The shaft spans both red supports and the silver arm.", "Horizontal axle", "Proposed R4 → A3 → R4", "Silver cross axle"),
  ],
  [
    action("Find the grey L-shaped bracket",
      "Find the grey L-shaped piece. Look for G1 at the top of its long arm.",
      "Inspect the upright bracket", "Keep the short foot oriented as in the manual.", "G1", undefined, "Grey L bracket"),
    action("Find the red mounting hole",
      "Find the actual hole in Red Support A that connects to G1. The proposed label R1 still needs checking.",
      "Inspect the side-facing joint", "Do not assume R1 until the real part is checked.", "G1", "Proposed Red A R1"),
    action("Start the black connector pin",
      "Push one end of the black pin into G1. Leave its other end exposed.",
      "Along G1's side-facing hole axis", "The free end can attach to the red support.", "Black pin", "G1", "Black connector pin"),
    action("Attach the grey bracket",
      "Move the grey bracket toward Red Support A and connect the exposed pin to the verified red hole.",
      "Horizontally inward", "The bracket is upright, foot faces the correct direction, and the pin remains.", "G1 + black pin", "Proposed Red A R1", "Grey L bracket"),
  ],
  [
    action("Prepare yellow gear and loose axle",
      "Find the small yellow gear and a separate silver stick. Locate Y1 in the gear's center.",
      "Inspect the loose parts", "You can identify Y1 and the axle's end.", "Y1", undefined, "Yellow gear and axle"),
    action("Put the yellow gear onto the axle",
      "Match Y1 to the loose silver axle and slide the gear onto it.",
      "Along the loose axle", "The yellow gear stays attached to its own axle.", "Y1", "Loose horizontal axle", "Yellow gear"),
    action("Find the lower mounting location",
      "Look underneath the grey gear and beside the lower black gear. Find the horizontal mounting path.",
      "Inspect from the side", "BG1 stays occupied by the original vertical axle.", "New horizontal axle", "Actual lower mount (unconfirmed)"),
    action("Install the lower axle assembly",
      "Move the yellow gear and silver axle together sideways toward the lower black gear.",
      "Horizontally inward", "The yellow gear is beside the black gear, and the vertical axle remains in BG1.", "Yellow gear + axle", "Actual lower mount (unconfirmed)"),
  ],
];

export const ACCELERATION_ACTION_COUNT =
  ACCELERATION_ACTIONS.reduce((total, step) => total + step.length, 0);

/** World-coordinate fit is intentionally NOT claimed for these provisional IDs. */
export const ACCELERATION_UNVERIFIED_JOINTS = [
  "Red A mounting hole to A3 (proposed R4)",
  "Red B mounting hole to A3 (proposed R4)",
  "Grey bracket G1 to Red A (proposed R1)",
  "Step 5 lower horizontal axle receiver; BG1 is already occupied",
  "Upper/lower gear compatibility, tooth profile, hub fit and all seating depths",
] as const;
