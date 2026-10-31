/** Source: SHA-matched official Level 5 Learning PDF (24 pages). */
import type { QuizBank } from "../../quizStudio";

export const swingingSharkBank: QuizBank = {
  "projectId": "level-5-swinging-shark",
  "title": "Swinging Shark",
  "sourcePdfPath": "public/Level 5/Learning/Characters & Structures/Swinging Shark/03. Swinging Shark - Teaching Slides.pdf",
  "sourcePageCount": 24,
  "questions": [
    {
      "id": "level-5-swinging-shark-01",
      "topic": "shark-fins",
      "learningSlide": 12,
      "prompt": "What is the main balancing role of a shark's dorsal fin described in the lesson?",
      "choices": [
        "Help maintain stability in water",
        "Produce electrical current",
        "Measure ocean temperature",
        "Guide the shark with QR codes"
      ],
      "correctIndex": 0,
      "hint": "The fin's function is not simply to make it faster.",
      "explanation": "Slide 12 describes the dorsal fin as providing balance."
    },
    {
      "id": "level-5-swinging-shark-02",
      "topic": "shark-fins",
      "learningSlide": 10,
      "prompt": "Which part provides much of a shark's swimming propulsion?",
      "choices": [
        "Gills used like propellers",
        "Tail fin",
        "Dorsal fin alone",
        "An electric motor"
      ],
      "correctIndex": 1,
      "hint": "Look for the part that pushes water during swimming.",
      "explanation": "Slide 10 discusses the tail fin's strong stirring of water."
    },
    {
      "id": "level-5-swinging-shark-03",
      "topic": "model-attitude",
      "learningSlide": 14,
      "prompt": "What input makes the classroom shark model change its orientation?",
      "choices": [
        "Pressing a payment button",
        "Counting traffic signs",
        "Rotating the attitude sensor",
        "Scanning a barcode"
      ],
      "correctIndex": 2,
      "hint": "The robot follows a sensor held at different angles.",
      "explanation": "Slide 14 builds a model that follows attitude-sensor orientation."
    },
    {
      "id": "level-5-swinging-shark-04",
      "topic": "model-attitude",
      "learningSlide": 16,
      "prompt": "What preparation step is performed before the model uses attitude readings?",
      "choices": [
        "Disconnect all motors",
        "Set every sensor to random values",
        "Erase the learning PDF",
        "Calibrate the attitude sensor and zero the motor encoder"
      ],
      "correctIndex": 3,
      "hint": "Start with a known sensor and motor reference.",
      "explanation": "Slide 16 calibrates the attitude sensor and resets motor encoder readings."
    },
    {
      "id": "level-5-swinging-shark-05",
      "topic": "sensor-axes",
      "learningSlide": 15,
      "prompt": "Which attitude value controls the shark's pitching action?",
      "choices": [
        "Pitch angle",
        "Ambient sound volume",
        "GPS longitude",
        "QR payment value"
      ],
      "correctIndex": 0,
      "hint": "Find the front-to-back tipping axis.",
      "explanation": "Slide 15 assigns pitching control to the pitch angle."
    },
    {
      "id": "level-5-swinging-shark-06",
      "topic": "sensor-axes",
      "learningSlide": 15,
      "prompt": "Which value is used for the shark's sideways flipping motion?",
      "choices": [
        "Bluetooth connection number",
        "Roll angle",
        "Motor temperature",
        "Screen brightness"
      ],
      "correctIndex": 1,
      "hint": "Roll corresponds to tilting side to side.",
      "explanation": "Slide 15 links the flip or roll motion to roll-angle data."
    },
    {
      "id": "level-5-swinging-shark-07",
      "topic": "rotation-limits",
      "learningSlide": 15,
      "prompt": "Why does the control program restrict how far the model can roll?",
      "choices": [
        "To turn the model into a submarine",
        "To disable the attitude sensor",
        "To keep the shark from turning upside down",
        "To make the battery recharge"
      ],
      "correctIndex": 2,
      "hint": "Think about maintaining the model's balance.",
      "explanation": "Slide 15 specifically limits tilt to prevent turning the shark upside down."
    },
    {
      "id": "level-5-swinging-shark-08",
      "topic": "rotation-limits",
      "learningSlide": 18,
      "prompt": "What should the controller avoid when making a corrective turn?",
      "choices": [
        "Reading the motor encoder",
        "Comparing angles",
        "Maintaining the current orientation",
        "Using too much motor power"
      ],
      "correctIndex": 3,
      "hint": "Large corrections can overshoot.",
      "explanation": "Slide 18 warns that excessive motor power can cause incorrect shark rotation."
    },
    {
      "id": "level-5-swinging-shark-09",
      "topic": "motion-tuning",
      "learningSlide": 18,
      "prompt": "Which encoder values define the stated out-of-range test for sideways turning?",
      "choices": [
        "Greater than 50 or less than −50",
        "Exactly 0 only",
        "Between 0 and 1 only",
        "Always above 1000"
      ],
      "correctIndex": 0,
      "hint": "The check tests the magnitude on either side of zero.",
      "explanation": "Slide 18 uses thresholds above 50 or below −50."
    },
    {
      "id": "level-5-swinging-shark-10",
      "topic": "motion-tuning",
      "learningSlide": 22,
      "prompt": "What does the shark project's optimization challenge ask students to improve?",
      "choices": [
        "Oil-pump speed measurement",
        "More flexible rotation in response to attitude-sensor movement",
        "Cash-register prices",
        "QR-code ticket validation"
      ],
      "correctIndex": 1,
      "hint": "The goal is smoother orientation following.",
      "explanation": "Slide 22 requests more flexible shark rotation based on the attitude readings."
    }
  ]
};
