/** Level 4 — Safe Box. Questions checked against the 17-page Learning PDF text; diagram-independent, Acceleration Car difficulty. */
import type { QuizBank } from "../../quizStudio";

export const safeBoxBank: QuizBank = {
  "projectId": "level-4-safe-box",
  "title": "Safe Box",
  "sourcePdfPath": "public/Level 4/Machines & Mechanisms/Safe Box.pdf",
  "sourcePageCount": 17,
  "questions": [
    {
      "id": "l4-safebox-01",
      "topic": "protecting-valuables",
      "learningSlide": 2,
      "prompt": "Why might you keep a journal inside a locked box?",
      "choices": [
        "To protect private things",
        "To increase sunlight",
        "To speed up a fan",
        "To measure sound"
      ],
      "correctIndex": 0,
      "explanation": "Slide 2 asks how to keep journals and treasured items private.",
      "hint": "Think about something you do not want other people to open."
    },
    {
      "id": "l4-safebox-02",
      "topic": "protecting-valuables",
      "learningSlide": 4,
      "prompt": "Which safety feature does the lesson say some modern safes have?",
      "choices": [
        "A loud music player",
        "Built-in racing wheels",
        "Fire resistance",
        "Automatic curtains"
      ],
      "correctIndex": 2,
      "explanation": "Slide 4 says modern coffers may be fire-resistant and waterproof.",
      "hint": "Think about threats besides someone opening the lock."
    },
    {
      "id": "l4-safebox-03",
      "topic": "password-keypads",
      "learningSlide": 5,
      "prompt": "How does the password safe in the lesson open?",
      "choices": [
        "By pushing any one button",
        "By changing the box's color",
        "By turning off the lights",
        "By entering numbers in the correct order"
      ],
      "correctIndex": 3,
      "explanation": "Slide 5 explains that keypad numbers must be entered in the correct order.",
      "hint": "A password depends on the sequence of inputs."
    },
    {
      "id": "l4-safebox-04",
      "topic": "password-keypads",
      "learningSlide": 6,
      "prompt": "Which part can act as a number button in the model?",
      "choices": [
        "Ultrasonic sensor",
        "Touch sensor",
        "Speaker",
        "Color lamp"
      ],
      "correctIndex": 1,
      "explanation": "Slide 6 says touch sensors can be used as code buttons.",
      "hint": "Think about a part that reacts when pressed."
    },
    {
      "id": "l4-safebox-05",
      "topic": "one-digit-code",
      "learningSlide": 14,
      "prompt": "In Task 1, which sensor is the correct button?",
      "choices": [
        "The motor encoder",
        "Interface No. 1 touch sensor",
        "Interface No. 2 touch sensor",
        "Any sensor at the same time"
      ],
      "correctIndex": 1,
      "explanation": "Slide 14 identifies interface No. 1 as the correct button.",
      "hint": "Recall the simpler one-digit password task."
    },
    {
      "id": "l4-safebox-06",
      "topic": "one-digit-code",
      "learningSlide": 14,
      "prompt": "How quickly must the correct button be pressed in Task 1?",
      "choices": [
        "Within 10 seconds",
        "Within 20 seconds",
        "Within 60 seconds",
        "Within 2 seconds"
      ],
      "correctIndex": 3,
      "explanation": "Slide 14 gives a two-second window for pressing the correct touch button.",
      "hint": "Remember the short time limit."
    },
    {
      "id": "l4-safebox-07",
      "topic": "two-digit-code",
      "learningSlide": 15,
      "prompt": "What is the correct order for Task 2's two-button password?",
      "choices": [
        "No. 2 then No. 2",
        "No. 2 then No. 1",
        "No. 1 then No. 2",
        "No. 1 then No. 1"
      ],
      "correctIndex": 2,
      "explanation": "Slide 15 specifies interface No. 1 followed by interface No. 2.",
      "hint": "The order matters as much as which buttons are pressed."
    },
    {
      "id": "l4-safebox-08",
      "topic": "two-digit-code",
      "learningSlide": 15,
      "prompt": "If you press No. 2 first in Task 2, what is wrong?",
      "choices": [
        "The sequence is incorrect",
        "The motor is too heavy",
        "The safe must be larger",
        "The box is too bright"
      ],
      "correctIndex": 0,
      "explanation": "Slide 15 requires pressing No. 1 before No. 2.",
      "hint": "Compare the button order with the chosen password."
    },
    {
      "id": "l4-safebox-09",
      "topic": "extending-the-code",
      "learningSlide": 16,
      "prompt": "How does the lesson suggest making a password with three or more digits?",
      "choices": [
        "Remove the touch sensors",
        "Stop checking the order",
        "Replace the controller with a wheel",
        "Use nested branch structures"
      ],
      "correctIndex": 3,
      "explanation": "Slide 16 explains that nesting branches extends the password program.",
      "hint": "Think about adding another decision step."
    },
    {
      "id": "l4-safebox-10",
      "topic": "extending-the-code",
      "learningSlide": 17,
      "prompt": "What can students do after programming their Safe Box?",
      "choices": [
        "Remove every sensor",
        "Try letting someone unlock it",
        "Never test its password",
        "Only paint the outside"
      ],
      "correctIndex": 1,
      "explanation": "Slide 17 suggests letting others try opening the programmed coffer.",
      "hint": "A useful test checks whether the password really works."
    }
  ]
};
