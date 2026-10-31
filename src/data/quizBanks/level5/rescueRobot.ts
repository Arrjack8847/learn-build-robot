/** Source: hash-matched official Level 5 Learning PDF (28 pages). */
import type { QuizBank } from "../../quizStudio";

export const rescueRobotBank: QuizBank = {
  "projectId": "level-5-rescue-robot",
  "title": "Rescue Robot",
  "sourcePdfPath": "public/Level 5/Learning/Programming & Precise Control/Rescue Robot/17.Rescue Robot -Slides.pdf",
  "sourcePageCount": 28,
  "questions": [
    {
      "id": "level-5-rescue-robot-01",
      "topic": "rescue-context",
      "learningSlide": 5,
      "prompt": "Why are rescue robots useful soon after a natural disaster?",
      "choices": [
        "They can support urgent rescue in hazardous areas",
        "They prevent all earthquakes",
        "They replace every emergency worker",
        "They remove the need for reconnaissance"
      ],
      "correctIndex": 0,
      "hint": "Think about acting quickly in dangerous conditions.",
      "explanation": "Slide 5 emphasizes urgent rescue after earthquakes and similar emergencies."
    },
    {
      "id": "level-5-rescue-robot-02",
      "topic": "rescue-context",
      "learningSlide": 8,
      "prompt": "What can a disaster-reconnaissance robot do?",
      "choices": [
        "Control a television using IR",
        "Survey complex ruins with cameras and other sensors",
        "Repair an oil pump's speed knob",
        "Print QR-coded tickets only"
      ],
      "correctIndex": 1,
      "hint": "Look for mapping and detection tasks.",
      "explanation": "Slide 8 explains using cameras and thermal imagers for reconnaissance in difficult terrain."
    },
    {
      "id": "level-5-rescue-robot-03",
      "topic": "vision-colors",
      "learningSlide": 10,
      "prompt": "Which set of colors can the built-in AI vision module recognize in its color mode?",
      "choices": [
        "Orange, purple, pink and grey",
        "Only red and white",
        "Red, yellow, green and blue",
        "Black, white, silver and gold"
      ],
      "correctIndex": 2,
      "hint": "The slide lists four basic named colors.",
      "explanation": "Slide 10 lists red, yellow, green and blue as recognized color categories."
    },
    {
      "id": "level-5-rescue-robot-04",
      "topic": "vision-colors",
      "learningSlide": 10,
      "prompt": "What does the camera display around a detected colored object?",
      "choices": [
        "A motor-speed waveform",
        "A temperature gauge",
        "A GPS route",
        "A colored bounding box"
      ],
      "correctIndex": 3,
      "hint": "The module visually marks the detected item.",
      "explanation": "Slide 10 says a matching colored box surrounds the recognized object."
    },
    {
      "id": "level-5-rescue-robot-05",
      "topic": "vision-configuration",
      "learningSlide": 17,
      "prompt": "Which controller port connects to the AI vision module in this model?",
      "choices": [
        "P8",
        "M1",
        "M2",
        "P1"
      ],
      "correctIndex": 0,
      "hint": "The sensor uses a P port, not the two motor ports.",
      "explanation": "Slide 17 connects the AI vision module to P8, with motors on M1 and M2."
    },
    {
      "id": "level-5-rescue-robot-06",
      "topic": "vision-configuration",
      "learningSlide": 18,
      "prompt": "Which recognition mode must be selected for detecting the lesson's colored warning areas?",
      "choices": [
        "Line Drawing mode",
        "Color Detection",
        "Face Detection only",
        "QR code mode only"
      ],
      "correctIndex": 1,
      "hint": "The model responds to colored danger markers.",
      "explanation": "Slide 18 sets the AI vision module to color-detection mode."
    },
    {
      "id": "level-5-rescue-robot-07",
      "topic": "risk-responses",
      "learningSlide": 19,
      "prompt": "What does the rescue model do when the area ahead is recognized as dangerous?",
      "choices": [
        "Turn off all recognition sensors",
        "Ignore the warning",
        "Stop and sound an alarm",
        "Continue at full speed"
      ],
      "correctIndex": 2,
      "hint": "Safety comes before continued movement.",
      "explanation": "Slide 19 stops the robot and sounds its alarm in dangerous surroundings."
    },
    {
      "id": "level-5-rescue-robot-08",
      "topic": "risk-responses",
      "learningSlide": 21,
      "prompt": "How does the model move when the next area may be unsafe but is not classified as fully dangerous?",
      "choices": [
        "Drive at maximum speed",
        "Always rotate without moving",
        "Turn off the controller",
        "Move slowly"
      ],
      "correctIndex": 3,
      "hint": "Uncertain terrain calls for caution.",
      "explanation": "Slide 21 directs slower movement when danger may occur."
    },
    {
      "id": "level-5-rescue-robot-09",
      "topic": "extensions",
      "learningSlide": 23,
      "prompt": "What happens if the vision module detects no colored blocks in the area?",
      "choices": [
        "The robot stops",
        "The robot speeds up",
        "The motor starts an endless loop",
        "The controller changes to infrared mode"
      ],
      "correctIndex": 0,
      "hint": "Read the no-detection case of the flow.",
      "explanation": "Slide 23 specifies stopping if no color blocks are detected."
    },
    {
      "id": "level-5-rescue-robot-10",
      "topic": "extensions",
      "learningSlide": 26,
      "prompt": "What input modality does the expansion task add to color detection?",
      "choices": [
        "A compass bearing only",
        "Voice commands",
        "A paper punching card",
        "Mechanical coin-only input"
      ],
      "correctIndex": 1,
      "hint": "The task adds speech control.",
      "explanation": "Slide 26 proposes combining voice control with color detection."
    }
  ]
};
