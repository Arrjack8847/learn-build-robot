import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 25-page Learning PDF. */
export const ringTossGameBank: QuizBank = {
  "projectId": "level-6-ring-toss-game",
  "title": "Ring Toss Game",
  "sourcePdfPath": "public/Level 6/Learning/Mechanisms & Simulators/Ring Toss Game/15. Ring Toss Game-Teaching Slides.pdf",
  "sourcePageCount": 25,
  "questions": [
    {
      "id": "rtg-01",
      "topic": "game-mechanics",
      "learningSlide": 8,
      "prompt": "What makes this ring-toss game more difficult than tossing at a fixed target?",
      "choices": [
        "The target joystick swings back and forth",
        "The ring is never allowed to move",
        "The machine accepts a QR password",
        "The game uses no sensor"
      ],
      "correctIndex": 0,
      "hint": "The target does not stay in one position.",
      "explanation": "Slide 8 introduces a moving target joystick."
    },
    {
      "id": "rtg-02",
      "topic": "game-mechanics",
      "learningSlide": 11,
      "prompt": "What should the joystick do when a successful ring toss is detected?",
      "choices": [
        "Swing faster forever",
        "Stop swinging",
        "Erase the score and restart",
        "Change into a camera"
      ],
      "correctIndex": 1,
      "hint": "The game ends the target motion on success.",
      "explanation": "Slide 11 requires the joystick to stop after the sensor confirms the ring."
    },
    {
      "id": "rtg-03",
      "topic": "photoelectric-detection",
      "learningSlide": 9,
      "prompt": "Which sensor detects whether the ring has reached the joystick?",
      "choices": [
        "Temperature sensor",
        "Rain gauge",
        "Photoelectric sensor",
        "Ultrasonic weather meter"
      ],
      "correctIndex": 2,
      "hint": "A change in light reception signals the ring.",
      "explanation": "Slide 9 names a photoelectric sensor."
    },
    {
      "id": "rtg-04",
      "topic": "photoelectric-detection",
      "learningSlide": 12,
      "prompt": "Why does the program wait an extra second before confirming the ring?",
      "choices": [
        "To make the target permanently faster",
        "To clear the photoelectric sensor",
        "To erase the game history",
        "To reduce false success detections"
      ],
      "correctIndex": 3,
      "hint": "A brief interruption may not mean a successful catch.",
      "explanation": "Slide 12 delays confirmation by a second to avoid misjudgment."
    },
    {
      "id": "rtg-05",
      "topic": "swing-direction",
      "learningSlide": 13,
      "prompt": "What three motor-direction states are described?",
      "choices": [
        "Clockwise, counterclockwise and stop",
        "Forward, north and east",
        "Red, blue and green",
        "Fast, medium and invisible"
      ],
      "correctIndex": 0,
      "hint": "Zero speed is also a direction state.",
      "explanation": "Slide 13 lists positive, negative and zero."
    },
    {
      "id": "rtg-06",
      "topic": "swing-direction",
      "learningSlide": 16,
      "prompt": "How does clockwise swing speed change in the lesson?",
      "choices": [
        "From lower to higher speed",
        "From higher to lower speed",
        "Remain zero throughout",
        "Jump randomly between full and off"
      ],
      "correctIndex": 1,
      "hint": "The target slows during one sweep.",
      "explanation": "Slide 16 describes clockwise movement slowing down."
    },
    {
      "id": "rtg-07",
      "topic": "success-check",
      "learningSlide": 19,
      "prompt": "What photoelectric threshold is used in the ring-success check?",
      "choices": [
        "Less than 0",
        "Exactly 1",
        "Greater than 300",
        "Exactly 240"
      ],
      "correctIndex": 2,
      "hint": "A strong sensor reading is checked over time.",
      "explanation": "Slide 19 treats persistent values over 300 as success."
    },
    {
      "id": "rtg-08",
      "topic": "success-check",
      "learningSlide": 19,
      "prompt": "How long must the detected condition persist to count as successful?",
      "choices": [
        "One minute",
        "Ten seconds",
        "One hour",
        "One second"
      ],
      "correctIndex": 3,
      "hint": "The program checks the signal is not momentary.",
      "explanation": "Slide 19 uses a one-second check."
    },
    {
      "id": "rtg-09",
      "topic": "audio-extension",
      "learningSlide": 23,
      "prompt": "What feature is added in the optimization task?",
      "choices": [
        "Play a prompt sound after a successful ring catch",
        "Change the ring into a barcode",
        "Disable all motion sensors",
        "Make the target invisible"
      ],
      "correctIndex": 0,
      "hint": "Success should provide audio feedback.",
      "explanation": "Slide 23 adds a prompt sound."
    },
    {
      "id": "rtg-10",
      "topic": "audio-extension",
      "learningSlide": 23,
      "prompt": "When should the new prompt sound be made?",
      "choices": [
        "Only at the start of every game",
        "Before the swinging motion stops",
        "After the device is unplugged",
        "After a random one-hour delay"
      ],
      "correctIndex": 1,
      "hint": "Sound comes first in the requested finish sequence.",
      "explanation": "Slide 23 specifies sound before stopping the swing."
    }
  ]
};
