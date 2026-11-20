import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 24-page Learning PDF. */
export const gibbonBank: QuizBank = {
  "projectId": "level-6-gibbon",
  "title": "Gibbon",
  "sourcePdfPath": "public/Level 6/Learning/Mechanisms & Simulators/Gibbon/14. Gibbon - Slides.pdf",
  "sourcePageCount": 24,
  "questions": [
    {
      "id": "gb-01",
      "topic": "robot-hardware",
      "learningSlide": 9,
      "prompt": "Which sensor lets the gibbon robot measure the distance ahead?",
      "choices": [
        "An ultrasonic sensor",
        "A rain gauge",
        "A QR-code camera",
        "A temperature alarm"
      ],
      "correctIndex": 0,
      "hint": "The sensor detects obstacles ahead.",
      "explanation": "Slide 9 identifies an ultrasonic distance sensor."
    },
    {
      "id": "gb-02",
      "topic": "robot-hardware",
      "learningSlide": 9,
      "prompt": "What is one movement described for the gibbon robot?",
      "choices": [
        "Display a password on a gate",
        "Swing its arms up and down",
        "Measure wind direction",
        "Print a payment receipt"
      ],
      "correctIndex": 1,
      "hint": "The model imitates an animal's motion.",
      "explanation": "Slide 9 labels the gibbon's arm-swinging movement."
    },
    {
      "id": "gb-03",
      "topic": "obstacle-navigation",
      "learningSlide": 10,
      "prompt": "What should the robot do if there are no obstacles?",
      "choices": [
        "Stop permanently",
        "Always turn left",
        "Go straight",
        "Reverse until its battery is empty"
      ],
      "correctIndex": 2,
      "hint": "The path is clear.",
      "explanation": "Slide 10 directs straight motion when no obstacle is detected."
    },
    {
      "id": "gb-04",
      "topic": "obstacle-navigation",
      "learningSlide": 10,
      "prompt": "What should happen when the gibbon encounters an obstacle?",
      "choices": [
        "Accelerate straight into it",
        "Open a digital lock",
        "Play a countdown and stop forever",
        "Make a random left or right turn"
      ],
      "correctIndex": 3,
      "hint": "It should choose a new direction to avoid the obstacle.",
      "explanation": "Slide 10 asks for a random left or right turn."
    },
    {
      "id": "gb-05",
      "topic": "turning-decisions",
      "learningSlide": 10,
      "prompt": "What should the gibbon do after it has turned away from an obstacle?",
      "choices": [
        "Repeat the sensing and movement cycle",
        "Disable the ultrasonic sensor",
        "Erase the motor program",
        "Wait for a QR code"
      ],
      "correctIndex": 0,
      "hint": "Obstacle avoidance must operate continuously.",
      "explanation": "Slide 10 instructs students to repeat the cycle."
    },
    {
      "id": "gb-06",
      "topic": "turning-decisions",
      "learningSlide": 18,
      "prompt": "Which program setting decides how close an obstacle can be before turning?",
      "choices": [
        "The font size on a screen",
        "The ultrasonic sensor distance threshold",
        "The PDF's page number",
        "The colour of the robot's head"
      ],
      "correctIndex": 1,
      "hint": "A threshold separates free path from obstacle.",
      "explanation": "Slide 18 asks students to set the ultrasonic distance used for judgment."
    },
    {
      "id": "gb-07",
      "topic": "model-improvement",
      "learningSlide": 17,
      "prompt": "What structural feature does the lesson suggest improving?",
      "choices": [
        "The barcode printed on the manual",
        "The name of its program file",
        "The gibbon's centre of gravity",
        "The room's humidity"
      ],
      "correctIndex": 2,
      "hint": "Balance affects the robot's movement.",
      "explanation": "Slide 17 asks how to modify the robot's centre of gravity."
    },
    {
      "id": "gb-08",
      "topic": "model-improvement",
      "learningSlide": 13,
      "prompt": "Which issue is mentioned for students to diagnose during building?",
      "choices": [
        "The battery label has the wrong font",
        "The password has too many digits",
        "The dot matrix shows a clock",
        "The arms are not long enough"
      ],
      "correctIndex": 3,
      "hint": "The discussion focuses on motion and structure.",
      "explanation": "Slide 13 lists insufficient arm length among potential model problems."
    },
    {
      "id": "gb-09",
      "topic": "presentation-and-sound",
      "learningSlide": 15,
      "prompt": "What can the audio module set?",
      "choices": [
        "The buzzer's tone and playback duration",
        "The robot's steering angle from road marks",
        "A two-digit electronic password",
        "The number of colour recognition IDs"
      ],
      "correctIndex": 0,
      "hint": "It configures how a sound is played.",
      "explanation": "Slide 15 describes setting buzzer tone and duration."
    },
    {
      "id": "gb-10",
      "topic": "presentation-and-sound",
      "learningSlide": 21,
      "prompt": "What should students show when presenting the robot?",
      "choices": [
        "Only the title of its PDF",
        "The robot running its program and how they solved problems",
        "Only a photo of an unrelated robot",
        "Only the attendance list"
      ],
      "correctIndex": 1,
      "hint": "The lesson asks for a practical demonstration and explanation.",
      "explanation": "Slide 21 includes showing the working robot and explaining improvements."
    }
  ]
};
