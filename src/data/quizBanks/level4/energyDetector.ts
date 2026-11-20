/** Level 4 Learning PDF text checked page by page; questions do not depend on unreviewed diagrams. */
import type { QuizBank } from "../../quizStudio";

export const energyDetectorBank: QuizBank = {
  "projectId": "level-4-energy-detector",
  "title": "Energy Detector",
  "sourcePdfPath": "public/Level 4/Sensor-Focused Robots/Energy Detector/05. Energy Detector-Teaching Slides.pdf",
  "sourcePageCount": 22,
  "questions": [
    {
      "id": "l4-ed-01",
      "topic": "magnetic-fields",
      "learningSlide": 5,
      "prompt": "What surrounds a magnet even though it is normally invisible?",
      "choices": [
        "An ultrasonic echo",
        "A magnetic field",
        "A numeric display",
        "A bar code"
      ],
      "correctIndex": 1,
      "explanation": "Slide 5 describes the invisible magnetic field around a magnet.",
      "hint": "It explains why magnets exert forces."
    },
    {
      "id": "l4-ed-02",
      "topic": "magnetic-fields",
      "learningSlide": 5,
      "prompt": "Which interaction is used in the lesson to show the effect of a magnetic field?",
      "choices": [
        "Changing a magnet's color",
        "Making a sensor brighter",
        "A wheel spinning",
        "Magnets attracting or repelling"
      ],
      "correctIndex": 3,
      "explanation": "Slide 5 uses attraction and repulsion to illustrate magnetic forces.",
      "hint": "Magnets can pull together or push apart."
    },
    {
      "id": "l4-ed-03",
      "topic": "magnetic-sensor",
      "learningSlide": 7,
      "prompt": "What can a magnetic sensor detect?",
      "choices": [
        "The direction and intensity of a magnetic field",
        "Only the time of day",
        "Only visible colors",
        "The water temperature"
      ],
      "correctIndex": 0,
      "explanation": "Slide 7 explicitly names direction and intensity as magnetic measurements.",
      "hint": "What two properties describe a magnetic field in the lesson?"
    },
    {
      "id": "l4-ed-04",
      "topic": "magnetic-sensor",
      "learningSlide": 8,
      "prompt": "Which electrical quantity changes when the sensed magnetic field changes?",
      "choices": [
        "The printed code",
        "Wheel diameter",
        "Sensor voltage",
        "A paper label"
      ],
      "correctIndex": 2,
      "explanation": "Slide 8 describes a voltage response to surrounding magnetism.",
      "hint": "The sensor transforms magnetic effects into an electrical signal."
    },
    {
      "id": "l4-ed-05",
      "topic": "sensor-readings",
      "learningSlide": 9,
      "prompt": "Why might the sensor read a small value even when no magnet is nearby?",
      "choices": [
        "The display has failed",
        "Earth has its own magnetic field",
        "All sensors always return exactly zero",
        "The wheel motor is rotating"
      ],
      "correctIndex": 1,
      "explanation": "Slide 9 explains the Earth's magnetic field creates a background reading.",
      "hint": "Think about the planet's natural field."
    },
    {
      "id": "l4-ed-06",
      "topic": "sensor-readings",
      "learningSlide": 9,
      "prompt": "What intensity range is shown for the magnetic sensor reading?",
      "choices": [
        "-100 to -1",
        "10000 to 20000",
        "Exactly 1",
        "0 to 2000"
      ],
      "correctIndex": 3,
      "explanation": "Slide 9 lists a returned magnetic intensity range of 0–2000.",
      "hint": "Find the stated low and high values."
    },
    {
      "id": "l4-ed-07",
      "topic": "alert-threshold",
      "learningSlide": 12,
      "prompt": "What condition triggers the alert in the sample flowchart?",
      "choices": [
        "Magnetic intensity greater than 1000",
        "The room lights switching off",
        "Distance less than 20",
        "A button held for one minute"
      ],
      "correctIndex": 0,
      "explanation": "Slide 12 sets an alert when magnetic intensity is above 1000.",
      "hint": "Look for the program's threshold comparison."
    },
    {
      "id": "l4-ed-08",
      "topic": "alert-threshold",
      "learningSlide": 15,
      "prompt": "What warning appears on the controller when the measured magnetic intensity exceeds 1000?",
      "choices": [
        "No Sensor Found",
        "Distance Too Close",
        "Unusual Intensity",
        "Battery Empty"
      ],
      "correctIndex": 2,
      "explanation": "Slide 15 specifies the displayed phrase 'Unusual Intensity'.",
      "hint": "The message describes a magnetic reading outside the chosen limit."
    },
    {
      "id": "l4-ed-09",
      "topic": "alerts-and-extension",
      "learningSlide": 16,
      "prompt": "Which component makes the warning sound?",
      "choices": [
        "Color sensor",
        "Buzzer",
        "Camera",
        "Drive wheel"
      ],
      "correctIndex": 1,
      "explanation": "Slide 16 describes turning the buzzer on and off for the sound alert.",
      "hint": "Choose the part made to produce sound."
    },
    {
      "id": "l4-ed-10",
      "topic": "alerts-and-extension",
      "learningSlide": 20,
      "prompt": "What does the optimization task ask students to develop?",
      "choices": [
        "A bigger wheel axle",
        "A barcode reader",
        "A voice login screen",
        "Different prompts and sounds when checking other magnetic objects"
      ],
      "correctIndex": 3,
      "explanation": "Slide 20 asks for detecting additional magnetic objects and setting suitable intensity prompts and sounds.",
      "hint": "The extended program responds differently to different readings."
    }
  ]
};
