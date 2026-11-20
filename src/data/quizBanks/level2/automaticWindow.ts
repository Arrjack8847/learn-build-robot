/** Source-checked against the official Level 2 Learning PDF, including illustrated pages. */
import type { QuizBank } from "../../quizStudio";

export const automaticWindowBank: QuizBank = {
  "projectId": "level-2-automatic-window",
  "title": "Automatic Window",
  "sourcePdfPath": "public/Level 2/Learning/Machines & Mechanisms/Automatic window.pdf",
  "sourcePageCount": 19,
  "questions": [
    {
      "id": "aw01",
      "topic": "window-functions",
      "learningSlide": 2,
      "prompt": "Why are windows useful in a house according to the lesson?",
      "choices": [
        "They create electricity",
        "They let daylight into rooms",
        "They turn walls into motors",
        "They measure temperature"
      ],
      "correctIndex": 1,
      "hint": "Remember what can come through a window during the day.",
      "explanation": "Slide 2 says that windows let light into a home."
    },
    {
      "id": "aw02",
      "topic": "window-functions",
      "learningSlide": 2,
      "prompt": "What can opening a window help improve?",
      "choices": [
        "Ventilation",
        "Robot battery life",
        "The number of doors",
        "The size of a room"
      ],
      "correctIndex": 0,
      "hint": "Think about how fresh air enters a room.",
      "explanation": "Slide 2 states that windows can be opened for ventilation."
    },
    {
      "id": "aw03",
      "topic": "design-problem",
      "learningSlide": 4,
      "prompt": "What problem can happen when soundproof windows become very thick?",
      "choices": [
        "They become too light to close",
        "They always let in more noise",
        "They become heavier and harder to open",
        "They stop being transparent in all cases"
      ],
      "correctIndex": 2,
      "hint": "Consider how thicker construction changes the effort needed to move something.",
      "explanation": "Slide 4 explains that thicker soundproof windows became heavy and difficult to open."
    },
    {
      "id": "aw04",
      "topic": "design-problem",
      "learningSlide": 6,
      "prompt": "Why might remote-controlled windows be useful when rain starts while you are away?",
      "choices": [
        "They can be closed remotely",
        "They remove rain from the sky",
        "They turn off the house's lights",
        "They make the roof disappear"
      ],
      "correctIndex": 0,
      "hint": "Think about what action protects the room from rain.",
      "explanation": "Slide 6 gives sudden rain as an example where remotely closing a window is helpful."
    },
    {
      "id": "aw05",
      "topic": "motors-and-inputs",
      "learningSlide": 6,
      "prompt": "Which component moves the automatic window open and closed?",
      "choices": [
        "Paper label",
        "Light sensor only",
        "Motor",
        "Painted windowpane"
      ],
      "correctIndex": 2,
      "hint": "Look for the component that provides mechanical motion.",
      "explanation": "Slide 6 explains that motors can control the opening and closing of windows."
    },
    {
      "id": "aw06",
      "topic": "motors-and-inputs",
      "learningSlide": 6,
      "prompt": "Which input device is proposed as a remote control for the window model?",
      "choices": [
        "Touch sensor",
        "Weather balloon",
        "Infrared thermometer",
        "Loudspeaker"
      ],
      "correctIndex": 0,
      "hint": "Find the small orange-and-white control shown beside the motor.",
      "explanation": "Slide 6 proposes using a Touch Sensor as the window's remote-control input."
    },
    {
      "id": "aw07",
      "topic": "assembly-sequence",
      "learningSlide": 7,
      "prompt": "What does the first illustrated construction stage show?",
      "choices": [
        "Two motor-and-axle units",
        "A large solar panel",
        "Three speakers",
        "A complete house roof"
      ],
      "correctIndex": 0,
      "hint": "Examine the components shown before the window frame is built.",
      "explanation": "Slide 7 shows two motor units with axle/beam parts prepared for the assembly."
    },
    {
      "id": "aw08",
      "topic": "assembly-sequence",
      "learningSlide": 10,
      "prompt": "Which kind of structure is being prepared in the illustration on slide 10?",
      "choices": [
        "A pair of paper curtains",
        "A beam-built frame",
        "A glass aquarium",
        "An electronic screen"
      ],
      "correctIndex": 1,
      "hint": "Look at the long red and white connected parts.",
      "explanation": "Slide 10 depicts connected building beams arranged as parts of the window-frame assembly."
    },
    {
      "id": "aw09",
      "topic": "two-sensor-program",
      "learningSlide": 17,
      "prompt": "How are the two Touch Sensors used in the lesson's window program?",
      "choices": [
        "Both only play sounds",
        "One opens the window and the other closes it",
        "Both display the weather forecast",
        "One charges a battery and the other powers a lamp"
      ],
      "correctIndex": 1,
      "hint": "Look for the separate jobs assigned to the two controls.",
      "explanation": "Slide 17 explicitly assigns one Touch Sensor to opening and the other to closing."
    },
    {
      "id": "aw10",
      "topic": "two-sensor-program",
      "learningSlide": 18,
      "prompt": "What new challenge does the evaluation slide give students?",
      "choices": [
        "Build the frame with no connectors",
        "Make both window actions work using just one Touch Sensor",
        "Remove the controller forever",
        "Replace the window with a fan"
      ],
      "correctIndex": 1,
      "hint": "Consider whether the number of buttons could be reduced.",
      "explanation": "Slide 18 challenges students to control both opening and closing using one Touch Sensor."
    }
  ]
};
