/** Source: SHA-matched official Level 5 Learning PDF (30 pages). */
import type { QuizBank } from "../../quizStudio";

export const voiceControlledFrogBank: QuizBank = {
  "projectId": "level-5-voice-controlled-frog",
  "title": "Voice-controlled Frog",
  "sourcePdfPath": "public/Level 5/Learning/Vehicles & Complex Movers/Voice-controlled Frog/07.Voice-controlled Frog_Slides.pdf",
  "sourcePageCount": 30,
  "questions": [
    {
      "id": "level-5-voice-controlled-frog-01",
      "topic": "sound-to-action",
      "learningSlide": 3,
      "prompt": "How do voice-controlled toys respond to human input?",
      "choices": [
        "They react to sounds such as speech or claps",
        "They must always be pushed mechanically",
        "They use only GPS navigation",
        "They read QR codes from a camera"
      ],
      "correctIndex": 0,
      "hint": "Think about speaking or making a noise near the toy.",
      "explanation": "Slide 3 introduces toys that move when they hear speech or claps."
    },
    {
      "id": "level-5-voice-controlled-frog-02",
      "topic": "sound-to-action",
      "learningSlide": 4,
      "prompt": "Which part converts sounds into information the controller can act on?",
      "choices": [
        "Gear axle",
        "Microphone",
        "Motor encoder",
        "Color screen"
      ],
      "correctIndex": 1,
      "hint": "It receives an audio signal.",
      "explanation": "Slide 4 explains the microphone detects sound signals for controller processing."
    },
    {
      "id": "level-5-voice-controlled-frog-03",
      "topic": "microphone-input",
      "learningSlide": 6,
      "prompt": "Which sensor built into the controller controls the jumping frog?",
      "choices": [
        "Pressure gauge",
        "AI vision camera only",
        "Built-in microphone",
        "IR sender only"
      ],
      "correctIndex": 2,
      "hint": "The model needs to detect the sound event.",
      "explanation": "Slide 6 uses the controller's microphone for frog movement."
    },
    {
      "id": "level-5-voice-controlled-frog-04",
      "topic": "microphone-input",
      "learningSlide": 22,
      "prompt": "What does the program do after it hears the first loud sound?",
      "choices": [
        "Jump forever without waiting",
        "Clear all motor connection ports",
        "Ignore the next sound",
        "Save the controller's current time as the start time"
      ],
      "correctIndex": 3,
      "hint": "The first sound begins measuring an interval.",
      "explanation": "Slide 22 saves the current controller time in a start-time variable."
    },
    {
      "id": "level-5-voice-controlled-frog-05",
      "topic": "time-interval",
      "learningSlide": 21,
      "prompt": "What does the frog calculate from two loud sounds?",
      "choices": [
        "The time between the first and second sounds",
        "The pitch of the louder sound alone",
        "The distance to a moving light",
        "The angular momentum of the gear"
      ],
      "correctIndex": 0,
      "hint": "Two timestamps give a duration.",
      "explanation": "Slide 21 explains calculating the interval after the second loud noise."
    },
    {
      "id": "level-5-voice-controlled-frog-06",
      "topic": "time-interval",
      "learningSlide": 23,
      "prompt": "What event ends the sound interval used by the frog's movement program?",
      "choices": [
        "The first rotation of motor M2",
        "The second detected loud sound",
        "A scanned QR code",
        "A new Bluetooth host"
      ],
      "correctIndex": 1,
      "hint": "The program listens twice.",
      "explanation": "Slide 23 measures the interval when the microphone hears the second sound."
    },
    {
      "id": "level-5-voice-controlled-frog-07",
      "topic": "jump-program",
      "learningSlide": 24,
      "prompt": "What must the program do before timing the frog's jumping sequence?",
      "choices": [
        "Remove motors M1 and M2",
        "Turn off the microphone permanently",
        "Reset controller time to zero",
        "Reset all variables to random values"
      ],
      "correctIndex": 2,
      "hint": "A fresh timer is needed for the movement period.",
      "explanation": "Slide 24 resets controller time before executing timed jumps."
    },
    {
      "id": "level-5-voice-controlled-frog-08",
      "topic": "jump-program",
      "learningSlide": 24,
      "prompt": "How do the motors make the model frog jump one step?",
      "choices": [
        "Run continuously forward without reversing",
        "Keep both motors stopped",
        "Only switch the screen font",
        "Rotate forward then reverse"
      ],
      "correctIndex": 3,
      "hint": "Each jump uses a back-and-forth actuator action.",
      "explanation": "Slide 24 instructs motors M1 and M2 to rotate forward and then backward."
    },
    {
      "id": "level-5-voice-controlled-frog-09",
      "topic": "interval-limits",
      "learningSlide": 26,
      "prompt": "What happens when the measured sound interval is too short, below 0.6 seconds?",
      "choices": [
        "The program marks it invalid so the frog does not jump",
        "The frog always jumps at maximum speed",
        "It doubles the number of frogs",
        "It changes the controller's speaker color"
      ],
      "correctIndex": 0,
      "hint": "The extension filters out intervals that are too small.",
      "explanation": "Slide 26 assigns an invalid value to intervals shorter than 0.6 seconds."
    },
    {
      "id": "level-5-voice-controlled-frog-10",
      "topic": "interval-limits",
      "learningSlide": 26,
      "prompt": "What does the extension do when the interval exceeds five seconds?",
      "choices": [
        "Ignore all future sound signals",
        "Cap it at 5000 milliseconds",
        "Multiply it by 1000 again",
        "Reset it to minus 5000"
      ],
      "correctIndex": 1,
      "hint": "A maximum duration keeps actions bounded.",
      "explanation": "Slide 26 limits very long intervals to 5000 milliseconds."
    }
  ]
};
