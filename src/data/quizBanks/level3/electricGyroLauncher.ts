/** Text verified against official Level 3 teaching manual (Learning fallback). */
import type { QuizBank } from "../../quizStudio";

export const electricGyroLauncherBank: QuizBank = {
  "projectId": "level-3-electric-gyro-launcher",
  "title": "Electric Gyro Launcher",
  "sourcePdfPath": "public/Electric Gyro Launcher.pdf",
  "sourcePageCount": 12,
  "questions": [
    {
      "id": "electricgyrolaunc-01",
      "topic": "gyro",
      "learningSlide": 4,
      "prompt": "What object is the launcher designed to spin?",
      "choices": [
        "A banknote conveyor",
        "A laundry drum",
        "A gyroscope-like spinning top",
        "A bridge deck"
      ],
      "correctIndex": 2,
      "hint": "A top's spinning behavior is central to the lesson.",
      "explanation": "Page 4 introduces a spinning-top competition."
    },
    {
      "id": "electricgyrolaunc-02",
      "topic": "gyro",
      "learningSlide": 3,
      "prompt": "Which concept does the lesson connect with stable gyroscope spinning?",
      "choices": [
        "Unchanging motor angle without rotation",
        "Only sound-frequency feedback",
        "A static lever with no motion",
        "Gyroscopic balance while rotating"
      ],
      "correctIndex": 3,
      "hint": "A top's spinning behavior is central to the lesson.",
      "explanation": "Page 3 includes the stability of the spinning gyro among the objectives."
    },
    {
      "id": "electricgyrolaunc-03",
      "topic": "gears",
      "learningSlide": 3,
      "prompt": "What is the intended purpose of gear acceleration in the launcher?",
      "choices": [
        "Increase the top's rotational speed",
        "Reduce all movement to zero",
        "Measure a target's color",
        "Display sensor data only"
      ],
      "correctIndex": 0,
      "hint": "Gearing can increase rotational speed.",
      "explanation": "Page 3 teaches gear acceleration so the top can spin faster."
    },
    {
      "id": "electricgyrolaunc-04",
      "topic": "gears",
      "learningSlide": 4,
      "prompt": "Which topic is raised when analyzing the launcher's gearing?",
      "choices": [
        "The names of MP3 folders",
        "The principle of gear shifting",
        "A light threshold for a door",
        "Only magnetic memory storage"
      ],
      "correctIndex": 1,
      "hint": "Gearing can increase rotational speed.",
      "explanation": "Page 4 specifically asks about gear shifting in the launcher."
    },
    {
      "id": "electricgyrolaunc-05",
      "topic": "sensing",
      "learningSlide": 3,
      "prompt": "Which sensor is named for controlling the gyro launcher through programming?",
      "choices": [
        "Barometric sensor",
        "Color sensor only",
        "Touch sensor",
        "Ultrasonic sensor only"
      ],
      "correctIndex": 2,
      "hint": "The touch sensor is a programmable input.",
      "explanation": "Page 3 lists using a touch sensor with the program."
    },
    {
      "id": "electricgyrolaunc-06",
      "topic": "sensing",
      "learningSlide": 5,
      "prompt": "Which sensor module do students practice during hands-on programming?",
      "choices": [
        "Microphone waveform recorder",
        "Light-sensitive curtain module",
        "Audio frequency selector",
        "Touch switch sensor module"
      ],
      "correctIndex": 3,
      "hint": "The touch sensor is a programmable input.",
      "explanation": "Page 5 calls for proficiency with the touch switch sensor module."
    },
    {
      "id": "electricgyrolaunc-07",
      "topic": "motors",
      "learningSlide": 3,
      "prompt": "Which motor type is specified in the lesson objectives?",
      "choices": [
        "Large closed-loop motor",
        "A manual wind-up motor only",
        "A linear solenoid only",
        "A stepper without any controller"
      ],
      "correctIndex": 0,
      "hint": "Motor speed and closed-loop control matter for the launcher.",
      "explanation": "Page 3 explicitly mentions a large closed-loop motor."
    },
    {
      "id": "electricgyrolaunc-08",
      "topic": "motors",
      "learningSlide": 5,
      "prompt": "Which parameter is debugged to tune the launcher's motor output?",
      "choices": [
        "MP3 file name",
        "Speed value",
        "Screen font size",
        "Sound level threshold"
      ],
      "correctIndex": 1,
      "hint": "Motor speed and closed-loop control matter for the launcher.",
      "explanation": "Page 5 asks learners to adjust motor speed by debugging its speed value."
    },
    {
      "id": "electricgyrolaunc-09",
      "topic": "sequence",
      "learningSlide": 3,
      "prompt": "Which programming idea is emphasized for running launcher actions in order?",
      "choices": [
        "Unlimited random branching",
        "No commands before movement",
        "Sequential structure",
        "Only spreadsheet formulas"
      ],
      "correctIndex": 2,
      "hint": "The program controls actions in an organized order.",
      "explanation": "Page 3 identifies the sequential program structure."
    },
    {
      "id": "electricgyrolaunc-10",
      "topic": "sequence",
      "learningSlide": 3,
      "prompt": "Which block category is taught for implementing launcher movement?",
      "choices": [
        "Slide decoration",
        "Drawing-only layers",
        "Photo gallery commands",
        "Action programming directives"
      ],
      "correctIndex": 3,
      "hint": "The program controls actions in an organized order.",
      "explanation": "Page 3 lists action programming directive blocks."
    }
  ]
};
