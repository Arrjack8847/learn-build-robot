/** Source: hash-matched official Level 5 Learning PDF (32 pages). */
import type { QuizBank } from "../../quizStudio";

export const oilPumpingUnitBank: QuizBank = {
  "projectId": "level-5-oil-pumping-unit",
  "title": "Oil Pumping Unit",
  "sourcePdfPath": "public/Level 5/Learning/Characters & Structures/Oil Pumping Unit/21. Oil Pumping Unit -Slides.pdf",
  "sourcePageCount": 32,
  "questions": [
    {
      "id": "level-5-oil-pumping-unit-01",
      "topic": "oil-pump-motion",
      "learningSlide": 4,
      "prompt": "What moves up and down to help extract oil in the model's pumping cycle?",
      "choices": [
        "The sucker rod",
        "A vehicle wheel",
        "A speaker diaphragm",
        "The touch screen"
      ],
      "correctIndex": 0,
      "hint": "Follow the walking beam's motion.",
      "explanation": "Slide 4 connects the walking beam's reciprocating motion to the sucker rod."
    },
    {
      "id": "level-5-oil-pumping-unit-02",
      "topic": "oil-pump-motion",
      "learningSlide": 4,
      "prompt": "What part drives the walking beam and horse head back and forth?",
      "choices": [
        "A flashing light alone",
        "The motor through a linkage",
        "A microphone through radio waves",
        "A stationary lever with no input"
      ],
      "correctIndex": 1,
      "hint": "Trace the mechanism back to its power source.",
      "explanation": "Slide 4 describes the motor driving the walking beam and horse head through a link rod."
    },
    {
      "id": "level-5-oil-pumping-unit-03",
      "topic": "speed-states",
      "learningSlide": 6,
      "prompt": "What should the controller display when the pump is stopped?",
      "choices": [
        "Low Speed",
        "Error 999",
        "Stop",
        "High Speed"
      ],
      "correctIndex": 2,
      "hint": "Find the first display state in the requirements.",
      "explanation": "Slide 6 specifies the message Stop when the pumping unit is not operating."
    },
    {
      "id": "level-5-oil-pumping-unit-04",
      "topic": "speed-states",
      "learningSlide": 6,
      "prompt": "Which label should appear when the knob selects the slow pump setting?",
      "choices": [
        "High Speed",
        "Full Reverse",
        "Bluetooth Connected",
        "Low Speed"
      ],
      "correctIndex": 3,
      "hint": "Look for the low gear's screen state.",
      "explanation": "Slide 6 assigns Low Speed to the slower operating position."
    },
    {
      "id": "level-5-oil-pumping-unit-05",
      "topic": "encoder-values",
      "learningSlide": 21,
      "prompt": "What does the motor's built-in encoder measure in this lesson?",
      "choices": [
        "Motor rotation angle",
        "Room humidity",
        "The color of oil",
        "Only battery voltage"
      ],
      "correctIndex": 0,
      "hint": "The reading changes as the motor shaft turns.",
      "explanation": "Slide 21 introduces the encoder as a way to read the motor's rotation angle."
    },
    {
      "id": "level-5-oil-pumping-unit-06",
      "topic": "encoder-values",
      "learningSlide": 23,
      "prompt": "What does a negative encoder value mean in the lesson?",
      "choices": [
        "The motor has zero speed",
        "Reverse rotation",
        "No motor connection",
        "The controller is overheating"
      ],
      "correctIndex": 1,
      "hint": "The sign of the reading indicates direction.",
      "explanation": "Slide 23 explains that negative encoder values indicate reverse motor rotation."
    },
    {
      "id": "level-5-oil-pumping-unit-07",
      "topic": "knob-control",
      "learningSlide": 24,
      "prompt": "What happens when the control knob is turned to a larger angle for the high-speed setting?",
      "choices": [
        "The buzzer always replaces the motor",
        "The controller erases its display",
        "The pump runs faster",
        "The pump turns off regardless of setting"
      ],
      "correctIndex": 2,
      "hint": "Compare the small-angle and large-angle settings.",
      "explanation": "Slide 24 maps a larger knob angle to a higher pumping speed."
    },
    {
      "id": "level-5-oil-pumping-unit-08",
      "topic": "knob-control",
      "learningSlide": 24,
      "prompt": "What should the pump do when the control knob has not been turned?",
      "choices": [
        "Run at maximum speed",
        "Reverse automatically",
        "Ignore the encoder but accelerate",
        "Remain stationary"
      ],
      "correctIndex": 3,
      "hint": "The untouched knob indicates no selected movement.",
      "explanation": "Slide 24 says the pump does not move when the knob is not turned."
    },
    {
      "id": "level-5-oil-pumping-unit-09",
      "topic": "operating-limits",
      "learningSlide": 26,
      "prompt": "What warns that the knob has moved outside its allowed rotation range?",
      "choices": [
        "A buzzer sounds",
        "The system prints a ticket",
        "The lights turn permanently green",
        "The pump automatically switches to Bluetooth"
      ],
      "correctIndex": 0,
      "hint": "The lesson uses a sound alarm for invalid angles.",
      "explanation": "Slide 26 states that the buzzer sounds if the knob exceeds its effective angle range."
    },
    {
      "id": "level-5-oil-pumping-unit-10",
      "topic": "operating-limits",
      "learningSlide": 30,
      "prompt": "Why might engineers choose different pumping speeds in practice?",
      "choices": [
        "To prevent the linkage from ever moving",
        "To improve efficiency and adapt to operating conditions",
        "To make a pump always run at one fixed speed",
        "To stop monitoring the motor completely"
      ],
      "correctIndex": 1,
      "hint": "Think about matching speed to conditions.",
      "explanation": "Slide 30 discusses adjusting pump speed for efficiency, protection, and safe operation."
    }
  ]
};
