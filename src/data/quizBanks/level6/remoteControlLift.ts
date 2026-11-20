/** Verified against the 23-page official Level 6 Remote Control Lift Learning PDF.
 * Source details reviewed from PDF text (slides 7, 10, 13–17 and 21).
 * No diagram-specific claims are included.
 */
import type { QuizBank } from "../../quizStudio";

export const remoteControlLiftBank: QuizBank = {
  projectId: "level-6-remote-control-lift",
  title: "Remote Control Lift",
  sourcePdfPath: "public/Level 6/Learning/Programming & Precise Control/Remote Control Lift/22. Remote Control Lift-Teaching Slides.pdf",
  sourcePageCount: 23,
  questions: [
    {
      id: "rcl-01", topic: "lift-mechanisms", learningSlide: 7,
      prompt: "According to the lesson, what feature helps a scissor lift's platform remain stable while raised?",
      choices: ["Its scissor mechanical structure", "An extra-long control cable", "A faster display refresh rate", "The colour of the platform"],
      correctIndex: 0,
      hint: "Focus on the supporting mechanism under the platform.",
      explanation: "Slide 7 identifies the scissor mechanical structure as the reason the lift platform has high stability."
    },
    {
      id: "rcl-02", topic: "lift-mechanisms", learningSlide: 10,
      prompt: "Why does the lesson propose controlling a warehouse lift using gestures from a distance?",
      choices: ["To increase the weight of the lift", "To eliminate the need for safety limits", "To keep the operator farther from moving machinery", "To replace the lifting mechanism with a screen"],
      correctIndex: 2,
      hint: "Consider what happens if an operator must stand beside a moving lift when something goes wrong.",
      explanation: "Slide 10 explains that operating close to a lift can be dangerous; gesture recognition allows remote control."
    },
    {
      id: "rcl-03", topic: "directional-limits", learningSlide: 13,
      prompt: "Which component provides the physical limit in the downward direction of the lift?",
      choices: ["Motor encoder", "Touch sensor", "Gesture display", "Battery indicator"],
      correctIndex: 1,
      hint: "The lower limit is detected by physical contact at the bottom.",
      explanation: "Slide 13 says the touch sensor is the physical limit for downward movement."
    },
    {
      id: "rcl-04", topic: "directional-limits", learningSlide: 13,
      prompt: "How does the lift program detect its upward travel limit?",
      choices: ["By the lower touch sensor alone", "By a fixed wall-clock time", "By the colour of the gesture", "By the motor encoder value"],
      correctIndex: 3,
      hint: "The upper limit uses a measured motor position rather than contact at the base.",
      explanation: "Slide 13 specifies the motor encoder for the upward limit and the touch sensor for the downward limit."
    },
    {
      id: "rcl-05", topic: "safe-initialization", learningSlide: 14,
      prompt: "After the lift reaches its lowest position and touches its sensor, what does the initialization program do?",
      choices: ["Stops the motor and resets its encoder", "Increases the lift speed immediately", "Reverses the gesture direction", "Disables both travel limits"],
      correctIndex: 0,
      hint: "Think about establishing a reliable starting position before measuring future motion.",
      explanation: "Slide 14 says to wait briefly after the touch sensor is triggered, stop the motor and reset the encoder."
    },
    {
      id: "rcl-06", topic: "safe-initialization", learningSlide: 14,
      prompt: "What position must the lift return to during its initial setting?",
      choices: ["Its highest position", "Halfway up", "Its lowest position", "A random position"],
      correctIndex: 2,
      hint: "The initialization sequence is designed to find a consistent physical reference.",
      explanation: "Slide 14 explicitly instructs the lift to return to its lowest height before normal operation."
    },
    {
      id: "rcl-07", topic: "gesture-control-logic", learningSlide: 16,
      prompt: "If the program detects a triggered travel limit while evaluating gesture control, what speed should it set?",
      choices: ["Maximum upward speed", "Zero", "Maximum downward speed", "Double the previous speed"],
      correctIndex: 1,
      hint: "Think about how motion should respond when a safety boundary is reached.",
      explanation: "Slide 16 requires motor speed to be set to 0 when a limit has been triggered."
    },
    {
      id: "rcl-08", topic: "gesture-control-logic", learningSlide: 17,
      prompt: "When a gesture is detected and no travel limit is triggered, what determines whether the lift rises or falls?",
      choices: ["The last saved battery level", "The number of warehouse shelves", "The current page displayed", "The direction of the gesture"],
      correctIndex: 3,
      hint: "The same sensor can detect different intended movements.",
      explanation: "Slide 17 states that the lift rises or falls according to gesture direction as long as no limit is triggered."
    },
    {
      id: "rcl-09", topic: "travel-limits-and-improvement", learningSlide: 17,
      prompt: "During upward movement, at what motor code value does the lesson trigger the upper limit?",
      choices: ["More than 200 degrees", "More than 2,000 degrees", "Exactly 20 degrees", "Only when the lower touch sensor is pressed"],
      correctIndex: 1,
      hint: "Recall the numerical travel threshold in the programming step.",
      explanation: "Slide 17 states that the upper travel limit is triggered when reverse motor rotation exceeds 2,000 degrees (code value 2000)."
    },
    {
      id: "rcl-10", topic: "travel-limits-and-improvement", learningSlide: 21,
      prompt: "What is the lesson's program-optimization task after gesture-controlled lifting works?",
      choices: ["Raise the lifting and lowering speed", "Remove the touch sensor", "Ignore the upper encoder limit", "Make every gesture move upward"],
      correctIndex: 0,
      hint: "The optimization asks students to improve performance while keeping the lift's basic operation.",
      explanation: "Slide 21 asks students to modify the program so that the lift motor can raise and lower the platform at a higher speed."
    }
  ]
};
