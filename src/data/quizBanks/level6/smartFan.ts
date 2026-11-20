import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 21-page Learning PDF. */
export const smartFanBank: QuizBank = {
  "projectId": "level-6-smart-fan",
  "title": "Smart Fan",
  "sourcePdfPath": "public/Level 6/Learning/Interactive Systems/Smart Fan/31.Smart Fan-Teaching Slides.pdf",
  "sourcePageCount": 21,
  "questions": [
    {
      "id": "sfa-01",
      "topic": "comfort-and-sensors",
      "learningSlide": 7,
      "prompt": "Which other environmental measurement affects how warm people feel?",
      "choices": [
        "Humidity",
        "Motor encoder count",
        "List length",
        "QR-code digits"
      ],
      "correctIndex": 0,
      "hint": "Moist air can affect thermal comfort.",
      "explanation": "Slide 7 explains that humidity influences perceived warmth."
    },
    {
      "id": "sfa-02",
      "topic": "comfort-and-sensors",
      "learningSlide": 10,
      "prompt": "Which sensor controls the smart fan in the classroom model?",
      "choices": [
        "Barcode scanner",
        "Temperature and humidity sensor",
        "Ultrasonic wall detector",
        "Road-recognition camera"
      ],
      "correctIndex": 1,
      "hint": "The fan responds to room conditions.",
      "explanation": "Slide 10 uses a temperature and humidity sensor."
    },
    {
      "id": "sfa-03",
      "topic": "temperature-threshold",
      "learningSlide": 10,
      "prompt": "At what temperature does the basic program turn the fan on?",
      "choices": [
        "Above 5 degrees Celsius",
        "Only at exactly 0 degrees",
        "Above 25 degrees Celsius",
        "Above 100 degrees Celsius"
      ],
      "correctIndex": 2,
      "hint": "The threshold is set near normal room conditions.",
      "explanation": "Slide 10 states the fan starts above 25°C."
    },
    {
      "id": "sfa-04",
      "topic": "temperature-threshold",
      "learningSlide": 15,
      "prompt": "What indicator colour shows that the fan is running due to high temperature?",
      "choices": [
        "Green",
        "Blue",
        "White",
        "Red"
      ],
      "correctIndex": 3,
      "hint": "The lesson uses one lamp colour for high temperature.",
      "explanation": "Slide 15 turns the red light on when temperature exceeds 25."
    },
    {
      "id": "sfa-05",
      "topic": "debouncing",
      "learningSlide": 11,
      "prompt": "Why can a fan switch on and off too often near its threshold?",
      "choices": [
        "Sensor readings fluctuate between nearby values",
        "A QR code contains too many digits",
        "The motor must always rotate backward",
        "The screen has too few pixels"
      ],
      "correctIndex": 0,
      "hint": "Small changes can repeatedly cross the threshold.",
      "explanation": "Slide 11 describes fan switching caused by fluctuating sensor readings."
    },
    {
      "id": "sfa-06",
      "topic": "debouncing",
      "learningSlide": 12,
      "prompt": "How long should the temperature remain stable before the lesson uses it?",
      "choices": [
        "One millisecond",
        "Three seconds",
        "One minute",
        "One hour"
      ],
      "correctIndex": 1,
      "hint": "The program waits for a consistent reading.",
      "explanation": "Slide 12 requires three seconds of stable data."
    },
    {
      "id": "sfa-07",
      "topic": "fan-and-light",
      "learningSlide": 13,
      "prompt": "How does the program prepare to check whether temperature stayed stable?",
      "choices": [
        "Remove all variables",
        "Disable the temperature sensor",
        "Store the reading in two variables for comparison",
        "Use a countdown from 999"
      ],
      "correctIndex": 2,
      "hint": "Two saved values allow stability checking.",
      "explanation": "Slide 13 stores the sensor value for comparison."
    },
    {
      "id": "sfa-08",
      "topic": "fan-and-light",
      "learningSlide": 15,
      "prompt": "What happens when the stable temperature is not greater than 25?",
      "choices": [
        "The fan runs at maximum with red light",
        "The program enters password mode",
        "The motor rotates a sorting baffle",
        "The fan stops and the green light turns on"
      ],
      "correctIndex": 3,
      "hint": "The room is below the starting threshold.",
      "explanation": "Slide 15 stops the fan and shows green for lower temperature."
    },
    {
      "id": "sfa-09",
      "topic": "optimization",
      "learningSlide": 19,
      "prompt": "What is the optimization task for the smart fan?",
      "choices": [
        "Simplify how it checks that temperature data is stable",
        "Remove the sensor entirely",
        "Set the fan permanently on",
        "Replace the fan with a barcode reader"
      ],
      "correctIndex": 0,
      "hint": "Keep reliable behaviour with simpler logic.",
      "explanation": "Slide 19 asks to simplify the fluctuation check."
    },
    {
      "id": "sfa-10",
      "topic": "optimization",
      "learningSlide": 19,
      "prompt": "What property must the optimized fan still preserve?",
      "choices": [
        "Random speed with no sensor",
        "Correct automatic on/off response to temperature",
        "A fixed green light under all conditions",
        "A password required before running"
      ],
      "correctIndex": 1,
      "hint": "The behaviour should remain temperature-controlled.",
      "explanation": "Slide 19 says to achieve the same effect after simplifying."
    }
  ]
};
