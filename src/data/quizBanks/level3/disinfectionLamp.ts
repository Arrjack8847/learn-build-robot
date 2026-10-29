/** Verified against the Level 3 official Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const disinfectionLampBank: QuizBank = {
  "projectId": "level-3-disinfection-lamp",
  "title": "Disinfection Lamp",
  "sourcePdfPath": "public/Level 3/Learning/Illumination & Signals/Disinfection Lamp/13.Disinfection Lamp-Slides.pdf",
  "sourcePageCount": 30,
  "questions": [
    {
      "id": "disinfection-01",
      "topic": "uv-safety",
      "learningSlide": 3,
      "prompt": "Which kind of light does a disinfection lamp produce according to the lesson?",
      "choices": [
        "Only infrared light",
        "Ultraviolet light",
        "Only visible green light",
        "Only reflected sunlight"
      ],
      "correctIndex": 1,
      "hint": "The special lamp emits wavelengths different from ordinary lighting.",
      "explanation": "Slide 3 identifies disinfection lamps as sources of ultraviolet light."
    },
    {
      "id": "disinfection-02",
      "topic": "uv-safety",
      "learningSlide": 4,
      "prompt": "Why must people keep away from a working UV disinfection lamp without protection?",
      "choices": [
        "UV light makes all sensors stop permanently",
        "UV light removes the need for safety controls",
        "UV exposure can harm the human body",
        "Ultraviolet radiation cannot interact with skin"
      ],
      "correctIndex": 2,
      "hint": "Consider the safety note in the lesson.",
      "explanation": "Slide 4 warns that an operating disinfection lamp can harm people without protective measures."
    },
    {
      "id": "disinfection-03",
      "topic": "finite-loops",
      "learningSlide": 20,
      "prompt": "Which block repeats a program action an exact number of times?",
      "choices": [
        "Repeat forever",
        "Read ultrasonic distance",
        "Set motor direction",
        "Repeat (n) times"
      ],
      "correctIndex": 3,
      "hint": "The task needs a specific number of alarm beeps.",
      "explanation": "Slide 20 introduces the repeat-times programming block."
    },
    {
      "id": "disinfection-04",
      "topic": "finite-loops",
      "learningSlide": 21,
      "prompt": "What happens after a finite-count loop completes its repetitions?",
      "choices": [
        "Execution continues after the loop",
        "The whole program must shut down",
        "The loop repeats forever regardless of count",
        "The controller clears its memory"
      ],
      "correctIndex": 0,
      "hint": "A finite loop has a defined stopping point.",
      "explanation": "Slide 21 explains that execution proceeds after a limited-count loop."
    },
    {
      "id": "disinfection-05",
      "topic": "touch-control",
      "learningSlide": 6,
      "prompt": "Which input starts the simulated disinfection-lamp task?",
      "choices": [
        "GPS signal",
        "Touch sensor",
        "Temperature in the room",
        "Light from the ceiling"
      ],
      "correctIndex": 1,
      "hint": "The lesson begins with a physical press input.",
      "explanation": "Slide 6 specifies a touch sensor for controlling the simulation."
    },
    {
      "id": "disinfection-06",
      "topic": "touch-control",
      "learningSlide": 22,
      "prompt": "What should happen to the buzzer after the touch sensor is pressed?",
      "choices": [
        "The buzzer stays silent",
        "The buzzer sounds once only",
        "A beep-beep alarm repeats five times",
        "The motor never receives any commands"
      ],
      "correctIndex": 2,
      "hint": "The lesson gives a specific counted warning sound.",
      "explanation": "Slide 22 specifies a beep-beep alarm five times after a touch press."
    },
    {
      "id": "disinfection-07",
      "topic": "lamp-sequence",
      "learningSlide": 23,
      "prompt": "What color does the model lamp display while its motor is running?",
      "choices": [
        "White",
        "Green",
        "Blue",
        "Purple"
      ],
      "correctIndex": 3,
      "hint": "The colored lamp indicates a simulated operating state.",
      "explanation": "Slide 23 makes the color lamp purple during motor operation."
    },
    {
      "id": "disinfection-08",
      "topic": "lamp-sequence",
      "learningSlide": 23,
      "prompt": "What happens when the three-second motor run finishes?",
      "choices": [
        "The motor stops and the color lamp turns off",
        "The lamp stays on forever",
        "The motor reverses for a full hour",
        "The buzzer starts a new infinite loop"
      ],
      "correctIndex": 0,
      "hint": "The task defines an end to the simulated operation.",
      "explanation": "Slide 23 stops the motor and switches the lamp off after three seconds."
    },
    {
      "id": "disinfection-09",
      "topic": "user-feedback",
      "learningSlide": 24,
      "prompt": "Which message is shown when the simulated disinfection starts?",
      "choices": [
        "Game over",
        "Disinfection is on",
        "Battery missing",
        "Reboot the device"
      ],
      "correctIndex": 1,
      "hint": "The display informs the user that the task has started.",
      "explanation": "Slide 24 specifies showing 'Disinfection is on' after touch."
    },
    {
      "id": "disinfection-10",
      "topic": "user-feedback",
      "learningSlide": 24,
      "prompt": "What message should be shown once the motor stops?",
      "choices": [
        "Start again immediately",
        "Danger forever",
        "It's done",
        "Open the door"
      ],
      "correctIndex": 2,
      "hint": "The display signals task completion.",
      "explanation": "Slide 24 specifies 'It's done' after the motor stops."
    }
  ]
};
