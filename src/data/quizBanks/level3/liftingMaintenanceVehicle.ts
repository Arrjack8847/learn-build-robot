/** Text verified against official Level 3 teaching manual (Learning fallback). */
import type { QuizBank } from "../../quizStudio";

export const liftingMaintenanceVehicleBank: QuizBank = {
  "projectId": "level-3-lifting-maintenance-vehicle",
  "title": "Lifting Maintenance Vehicle",
  "sourcePdfPath": "public/Lifting Maintenance Vehicle.pdf",
  "sourcePageCount": 22,
  "questions": [
    {
      "id": "liftingmaintenanc-01",
      "topic": "purpose",
      "learningSlide": 4,
      "prompt": "What maintenance problem motivates the lifting vehicle lesson?",
      "choices": [
        "A broken streetlight above the road",
        "A banknote counting error",
        "An underwater robot navigation task",
        "A music box missing audio"
      ],
      "correctIndex": 0,
      "hint": "Think about repairing equipment above road level.",
      "explanation": "Page 4 introduces a malfunctioning streetlight as the reason for the vehicle."
    },
    {
      "id": "liftingmaintenanc-02",
      "topic": "purpose",
      "learningSlide": 4,
      "prompt": "What movement must the lifting platform provide to reach the problem area?",
      "choices": [
        "Only spin its road wheels",
        "Rise and lower",
        "Only produce sounds",
        "Only rotate the controller display"
      ],
      "correctIndex": 1,
      "hint": "Think about repairing equipment above road level.",
      "explanation": "Page 4 asks how the lifting platform can move up and down."
    },
    {
      "id": "liftingmaintenanc-03",
      "topic": "symmetry",
      "learningSlide": 3,
      "prompt": "Which structural property is emphasized for this vehicle's assembly?",
      "choices": [
        "Irregular wheel spacing",
        "One unsupported side",
        "Symmetry",
        "No mechanical fasteners"
      ],
      "correctIndex": 2,
      "hint": "Both sides of a lifting mechanism should be aligned.",
      "explanation": "Page 3 lists symmetric structure as a learning objective."
    },
    {
      "id": "liftingmaintenanc-04",
      "topic": "symmetry",
      "learningSlide": 3,
      "prompt": "Besides symmetry, what building detail is listed as important?",
      "choices": [
        "Disconnecting all connectors",
        "Removing the frame",
        "Leaving the platform loose",
        "Secure fixing of parts"
      ],
      "correctIndex": 3,
      "hint": "Both sides of a lifting mechanism should be aligned.",
      "explanation": "Page 3 highlights fixing and symmetry during building."
    },
    {
      "id": "liftingmaintenanc-05",
      "topic": "motors",
      "learningSlide": 3,
      "prompt": "How many motors are involved in the lesson's target configuration?",
      "choices": [
        "Three",
        "One",
        "Two",
        "Five"
      ],
      "correctIndex": 0,
      "hint": "The model uses multiple separate motors.",
      "explanation": "Page 3 identifies learning the use of a three-motor arrangement."
    },
    {
      "id": "liftingmaintenanc-06",
      "topic": "motors",
      "learningSlide": 5,
      "prompt": "Which programming component is used to control the motors?",
      "choices": [
        "MP3 folder selector",
        "Motor module",
        "Color-detection filter",
        "Expression-screen font tool"
      ],
      "correctIndex": 1,
      "hint": "The model uses multiple separate motors.",
      "explanation": "Page 5 teaches setting the motor module."
    },
    {
      "id": "liftingmaintenanc-07",
      "topic": "gears",
      "learningSlide": 5,
      "prompt": "Which mechanism does the teacher explain while building the maintenance vehicle?",
      "choices": [
        "Purely hydraulic pump",
        "Audio frequency converter",
        "Gearing structure",
        "Light-only sensor array"
      ],
      "correctIndex": 2,
      "hint": "Gearing transfers rotary movement within a mechanism.",
      "explanation": "Page 5 instructs explaining the model's gearing."
    },
    {
      "id": "liftingmaintenanc-08",
      "topic": "gears",
      "learningSlide": 4,
      "prompt": "What is the lifting mechanism expected to move during use?",
      "choices": [
        "A paper sheet through a printer",
        "A loudspeaker cone side to side",
        "A color sensor over a black line only",
        "The maintenance platform up and down"
      ],
      "correctIndex": 3,
      "hint": "Gearing transfers rotary movement within a mechanism.",
      "explanation": "Page 4 identifies the moving lifting platform."
    },
    {
      "id": "liftingmaintenanc-09",
      "topic": "programming",
      "learningSlide": 5,
      "prompt": "Which connection helps transfer the graphical program from a computer to the controller?",
      "choices": [
        "USB cable",
        "Infrared light alone",
        "A loose gear pair",
        "A paper drawing"
      ],
      "correctIndex": 0,
      "hint": "A graphical program needs a controller connection and motor commands.",
      "explanation": "Page 5 teaches connecting the controller to the computer through USB."
    },
    {
      "id": "liftingmaintenanc-10",
      "topic": "programming",
      "learningSlide": 3,
      "prompt": "What is one practical goal alongside understanding the structure?",
      "choices": [
        "Remove all motor commands",
        "Complete virtual tasks",
        "Operate without a controller",
        "Make the platform permanently fixed"
      ],
      "correctIndex": 1,
      "hint": "A graphical program needs a controller connection and motor commands.",
      "explanation": "Page 3 includes completing virtual tasks among the lesson objectives."
    }
  ]
};
