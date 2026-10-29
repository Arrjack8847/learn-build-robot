/** Verified against official Level 3 PDF; references are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const smartTrashBinBank: QuizBank = {
  "projectId": "level-3-smart-trash-bin",
  "title": "Smart Trash Bin",
  "sourcePdfPath": "public/Level 3/Learning/Characters & Structures/Smart Trash Bin/20.Smart Trash Bin-Slides.pdf",
  "sourcePageCount": 31,
  "questions": [
    {
      "id": "smarttrashbin-01",
      "topic": "automation",
      "learningSlide": 3,
      "prompt": "Which action makes a smart trash bin easier to use than an ordinary one?",
      "choices": [
        "Weighing every piece of rubbish",
        "Opening the lid when a hand approaches",
        "Changing the bin's color automatically",
        "Moving the entire bin on wheels"
      ],
      "correctIndex": 1,
      "hint": "The lid moves when a person approaches or presses a button.",
      "explanation": "Slide 3 describes hands-free cover opening."
    },
    {
      "id": "smarttrashbin-02",
      "topic": "automation",
      "learningSlide": 4,
      "prompt": "Which sensor is mentioned for detecting an approaching object in common smart bins?",
      "choices": [
        "Barometric sensor",
        "Microphone",
        "Infrared sensor",
        "Wheel encoder"
      ],
      "correctIndex": 2,
      "hint": "The lid moves when a person approaches or presses a button.",
      "explanation": "Slide 4 describes an infrared sensing principle for smart bins."
    },
    {
      "id": "smarttrashbin-03",
      "topic": "servo",
      "learningSlide": 20,
      "prompt": "Which two motor properties can servo control specify?",
      "choices": [
        "Volume and pitch",
        "Color and brightness",
        "Distance and temperature",
        "Rotation speed and angle"
      ],
      "correctIndex": 3,
      "hint": "Servo commands can specify position as well as speed.",
      "explanation": "Slide 20 describes servo motor speed and angle control."
    },
    {
      "id": "smarttrashbin-04",
      "topic": "servo",
      "learningSlide": 21,
      "prompt": "Which motor angle range is specified by the servo block?",
      "choices": [
        "0–3600",
        "0–90 only",
        "−100 to 100",
        "0–4095"
      ],
      "correctIndex": 0,
      "hint": "Servo commands can specify position as well as speed.",
      "explanation": "Slide 21 lists the angle value range as 0–3600."
    },
    {
      "id": "smarttrashbin-05",
      "topic": "angles",
      "learningSlide": 22,
      "prompt": "How does the lesson make the lid mechanism rotate back to its start angle?",
      "choices": [
        "Rotate continuously in one direction",
        "Rotate 90° one way then 90° back",
        "Stop after the first 90° turn",
        "Rotate 3600° without pause"
      ],
      "correctIndex": 1,
      "hint": "The motor must move through planned angles before reversing.",
      "explanation": "Slide 22 shows 90 degrees counterclockwise followed by 90 degrees clockwise."
    },
    {
      "id": "smarttrashbin-06",
      "topic": "angles",
      "learningSlide": 22,
      "prompt": "Why does the program wait after each specified rotation angle?",
      "choices": [
        "To reset the ultrasonic reading to zero",
        "To change the motor port",
        "To allow the servo to complete its movement",
        "To erase the previous angle"
      ],
      "correctIndex": 2,
      "hint": "The motor must move through planned angles before reversing.",
      "explanation": "Slide 22 requires waiting at least as long as the rotation takes."
    },
    {
      "id": "smarttrashbin-07",
      "topic": "sensing",
      "learningSlide": 6,
      "prompt": "What sensor is named in the project task for detecting a hand near the model bin?",
      "choices": [
        "Color sensor",
        "Touch probe only",
        "Pressure transducer",
        "Ultrasonic sensor"
      ],
      "correctIndex": 3,
      "hint": "An object-detection sensor can trigger hands-free movement.",
      "explanation": "Slide 6 uses an ultrasonic sensor with a controller button."
    },
    {
      "id": "smarttrashbin-08",
      "topic": "sensing",
      "learningSlide": 24,
      "prompt": "How soon does the lid close after opening by ultrasonic detection?",
      "choices": [
        "After 3 seconds",
        "After 5 seconds",
        "After 10 seconds",
        "Immediately with no wait"
      ],
      "correctIndex": 0,
      "hint": "An object-detection sensor can trigger hands-free movement.",
      "explanation": "Slide 24 specifies closing after three seconds."
    },
    {
      "id": "smarttrashbin-09",
      "topic": "timing",
      "learningSlide": 25,
      "prompt": "How long does the lid stay open in the left-button task?",
      "choices": [
        "1 second",
        "5 seconds",
        "3 seconds",
        "20 seconds"
      ],
      "correctIndex": 1,
      "hint": "Different triggers have different cover-open durations.",
      "explanation": "Slide 25 specifies five seconds after button-triggered opening."
    },
    {
      "id": "smarttrashbin-10",
      "topic": "timing",
      "learningSlide": 6,
      "prompt": "Which manual control is an alternative to automatic hand detection?",
      "choices": [
        "A GPS button",
        "The motor output shaft",
        "Left controller button",
        "The speaker jack"
      ],
      "correctIndex": 2,
      "hint": "Different triggers have different cover-open durations.",
      "explanation": "Slide 6 includes a left-button lid control."
    }
  ]
};
