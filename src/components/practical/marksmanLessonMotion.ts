/**
 * Guided 3D lesson motion shared by the Marksmanship teaching scenes.
 *
 * Values are in existing scene coordinates. These functions never move target
 * hole anchors or modify source STL geometry. They only interpolate the
 * displayed pose along a reversible, two-stage assembly path.
 */
export type MotionVec3 = [number, number, number];
export type MotionPose = { position: MotionVec3; rotation: MotionVec3 };

export function motionEase(value: number): number {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

export function motionLerp(a: MotionVec3, b: MotionVec3, value: number): MotionVec3 {
  const t = motionEase(value);
  return [a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t];
}

/** Move to an aligned clearance pose before the final straight insertion. */
export function motionThreeStage(
  from: MotionVec3, aligned: MotionVec3, seated: MotionVec3,
  progress: number, approachShare = 0.4,
): MotionVec3 {
  const split = Math.max(0.15, Math.min(0.8, approachShare));
  return progress < split
    ? motionLerp(from, aligned, progress / split)
    : motionLerp(aligned, seated, (progress - split) / (1 - split));
}

/**
 * The approach pose is specified explicitly so we never guess the insertion
 * direction of a physical connector. Reverse uses the same clearance pose.
 */
export function motionGuidedPose<T extends MotionPose>(
  from: T, aligned: T, seated: T, progress: number, approachShare = 0.4,
): T {
  return {
    position: motionThreeStage(from.position, aligned.position, seated.position, progress, approachShare),
    rotation: motionThreeStage(from.rotation, aligned.rotation, seated.rotation, progress, approachShare),
  } as T;
}

/** Guidance appears during identification and insertion, never at inspection. */
export function showConnectionGuide(
  phase: number, firstAction: number, lastAction: number,
): boolean {
  return phase >= firstAction && phase <= lastAction;
}

/** A stable contextual label; only actions with a known target get a number. */
export function connectionLabel(hole: number, verified: boolean): string {
  return verified ? `Hole ${hole}` : `Hole ${hole} · estimated`;
}
