import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 32-page Learning PDF. */
export const rcAirplaneBank: QuizBank = {
  "projectId": "level-6-rc-airplane",
  "title": "Rc Airplane",
  "sourcePdfPath": "public/Level 6/Learning/Mechanisms & Simulators/RC Airplane/11.RC Airplane - Slides.pdf",
  "sourcePageCount": 32,
  "questions": [
    {
      "id": "rca-01",
      "topic": "aircraft-controls",
      "learningSlide": 6,
      "prompt": "How many propeller-speed gears are available in the model?",
      "choices": [
        "Four",
        "Two",
        "Eight",
        "Ten"
      ],
      "correctIndex": 0,
      "hint": "The speed choices are numbered from 1 onward.",
      "explanation": "Slide 6 defines four gears."
    },
    {
      "id": "rca-02",
      "topic": "aircraft-controls",
      "learningSlide": 6,
      "prompt": "What should the airplane do when the joystick moves left?",
      "choices": [
        "Always turn right",
        "Deflect to the left",
        "Stop its propeller permanently",
        "Increase its price"
      ],
      "correctIndex": 1,
      "hint": "The joystick directly selects aircraft direction.",
      "explanation": "Slide 6 maps left joystick movement to left deflection."
    },
    {
      "id": "rca-03",
      "topic": "gear-selection",
      "learningSlide": 25,
      "prompt": "What happens when the touch button is pressed at gear 4?",
      "choices": [
        "The gear increases to 5",
        "The program exits permanently",
        "The gear returns to 1",
        "The propeller stops responding"
      ],
      "correctIndex": 2,
      "hint": "The gear sequence wraps around.",
      "explanation": "Slide 25 resets gears above 4 to 1."
    },
    {
      "id": "rca-04",
      "topic": "gear-selection",
      "learningSlide": 24,
      "prompt": "What value is assigned to the gear at program startup?",
      "choices": [
        "0",
        "4",
        "100",
        "1"
      ],
      "correctIndex": 3,
      "hint": "The system begins at its lowest valid gear.",
      "explanation": "Slide 24 initializes the gear variable to 1."
    },
    {
      "id": "rca-05",
      "topic": "propeller-speed",
      "learningSlide": 24,
      "prompt": "How is propeller speed calculated from the gear number?",
      "choices": [
        "Gear multiplied by 25",
        "Gear multiplied by 100",
        "Gear divided by 240",
        "Gear minus 50"
      ],
      "correctIndex": 0,
      "hint": "Four equally spaced settings reach a maximum of 100.",
      "explanation": "Slide 24 uses gear × 25 as speed."
    },
    {
      "id": "rca-06",
      "topic": "propeller-speed",
      "learningSlide": 24,
      "prompt": "What motor speed corresponds to gear 3?",
      "choices": [
        "25",
        "75",
        "50",
        "100"
      ],
      "correctIndex": 1,
      "hint": "Multiply the gear number by 25.",
      "explanation": "Slide 24 gives speed = gear × 25; gear 3 is 75."
    },
    {
      "id": "rca-07",
      "topic": "joystick-encoder",
      "learningSlide": 22,
      "prompt": "What feedback helps one motor follow another motor's angle?",
      "choices": [
        "Product names",
        "Temperature labels",
        "Motor encoder values",
        "QR-code passwords"
      ],
      "correctIndex": 2,
      "hint": "The model compares measured rotation angles.",
      "explanation": "Slide 22 uses encoders to control motor B from motor A."
    },
    {
      "id": "rca-08",
      "topic": "joystick-encoder",
      "learningSlide": 26,
      "prompt": "Why should a suitable angle-difference threshold be used?",
      "choices": [
        "To remove the joystick",
        "To make every gear equal",
        "To measure air pressure",
        "To avoid jitter from tiny differences"
      ],
      "correctIndex": 3,
      "hint": "Small encoder differences should not trigger constant correction.",
      "explanation": "Slide 26 warns that insufficient thresholds cause jitter."
    },
    {
      "id": "rca-09",
      "topic": "reset-extension",
      "learningSlide": 27,
      "prompt": "What is the RC-airplane expansion task?",
      "choices": [
        "Automatically reset the joystick and aircraft to their starting positions",
        "Turn the model into a weather station",
        "Replace the joystick with a card reader",
        "Stop all motor use"
      ],
      "correctIndex": 0,
      "hint": "The goal is a consistent initial position.",
      "explanation": "Slide 27 requests initial automatic reset."
    },
    {
      "id": "rca-10",
      "topic": "reset-extension",
      "learningSlide": 28,
      "prompt": "How can the yaw motor return to its starting direction?",
      "choices": [
        "Count pictures on a projector",
        "Tilt right and then return to centre",
        "Scan a six-digit QR password",
        "Read the temperature twice"
      ],
      "correctIndex": 1,
      "hint": "The expansion explicitly recentres the aircraft.",
      "explanation": "Slide 28 describes tilting and returning the yaw motor to the centre."
    }
  ]
};
