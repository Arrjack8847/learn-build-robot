/** Ten questions checked against the official 20-page Level 5 Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const passengerCounterBank: QuizBank = {
  "projectId": "level-5-passenger-counter",
  "title": "Passenger Counter",
  "sourcePdfPath": "public/Level 5/Learning/Interactive Mechanisms/Passenger Counter/14.Passenger Counter-Teaching Slides.pdf",
  "sourcePageCount": 20,
  "questions": [
    {
      "id": "level-5-passenger-counter-01",
      "topic": "passenger-data-use",
      "learningSlide": 4,
      "prompt": "How can a shop use passenger flow counts during busy periods?",
      "choices": [
        "Increase staff when visitor flow is high",
        "Remove all staff when visitor flow is high",
        "Stop measuring customer flow",
        "Keep exactly the same staffing regardless of visitors"
      ],
      "correctIndex": 0,
      "hint": "Busy times usually require more help for customers.",
      "explanation": "Slide 4 explains that peak-time counts help managers increase staffing and improve service."
    },
    {
      "id": "level-5-passenger-counter-02",
      "topic": "passenger-data-use",
      "learningSlide": 5,
      "prompt": "Which business planning task can daily passenger-flow patterns help with?",
      "choices": [
        "Selecting the color of every customer's clothing",
        "Estimating staffing and inventory order quantities",
        "Measuring the Earth's magnetic pole",
        "Changing the speed of light"
      ],
      "correctIndex": 1,
      "hint": "The lesson connects visitor patterns to planning ahead.",
      "explanation": "Slide 5 says managers can use passenger-flow patterns to plan activities, staffing, and inventory orders."
    },
    {
      "id": "level-5-passenger-counter-03",
      "topic": "infrared-method",
      "learningSlide": 7,
      "prompt": "Which counting technique is the focus of this lesson?",
      "choices": [
        "Infrared induction",
        "Atmospheric pressure sensing",
        "GPS satellite ranging",
        "Magnetic north detection"
      ],
      "correctIndex": 0,
      "hint": "The lesson compares several methods and concentrates on one.",
      "explanation": "Slide 7 focuses on infrared-induction passenger counting."
    },
    {
      "id": "level-5-passenger-counter-04",
      "topic": "infrared-method",
      "learningSlide": 8,
      "prompt": "What direction-related limitation does the basic infrared counter have?",
      "choices": [
        "It can always tell exactly who entered",
        "It counts people passing but cannot tell entry from exit",
        "It works only with magnetic objects",
        "It records each person's name"
      ],
      "correctIndex": 1,
      "hint": "One crossing sensor sees a passage, not its direction.",
      "explanation": "Slide 8 says the method cannot distinguish people entering from people going out."
    },
    {
      "id": "level-5-passenger-counter-05",
      "topic": "counting-logic",
      "learningSlide": 11,
      "prompt": "When does the example counter initially recognize that an object is passing?",
      "choices": [
        "When the infrared distance becomes less than a set threshold",
        "Whenever the display is turned off",
        "Only when the room temperature changes",
        "Only when the sensor shows a magnetic south pole"
      ],
      "correctIndex": 0,
      "hint": "It compares a distance reading with a limit.",
      "explanation": "Slide 11 says an infrared measurement below a set value indicates a passing object."
    },
    {
      "id": "level-5-passenger-counter-06",
      "topic": "counting-logic",
      "learningSlide": 14,
      "prompt": "Why does the counter wait for the detected object to leave before completing a count?",
      "choices": [
        "To allow a full presence-and-departure event",
        "To measure the object's temperature",
        "To change the wall's color",
        "To deliberately add another count every second"
      ],
      "correctIndex": 0,
      "hint": "A complete event has both a detected arrival and a departure.",
      "explanation": "Slide 14 treats detection followed by departure as one complete guest-presence event."
    },
    {
      "id": "level-5-passenger-counter-07",
      "topic": "state-and-display",
      "learningSlide": 15,
      "prompt": "Why does the program read stored passenger data before entering its repeating loop?",
      "choices": [
        "To increase the infrared beam's power",
        "To avoid losing previously recorded counts",
        "To switch the controller language",
        "To stop all future counting"
      ],
      "correctIndex": 1,
      "hint": "There may already be a count from a previous run.",
      "explanation": "Slide 15 says controller data must be read before the startup program enters the cycle, preserving earlier records."
    },
    {
      "id": "level-5-passenger-counter-08",
      "topic": "state-and-display",
      "learningSlide": 13,
      "prompt": "What does the display-programming step instruct students to show?",
      "choices": [
        "Only the robot's name",
        "Random pictures",
        "Corresponding text labels and measured values",
        "An unrelated speed-of-light equation"
      ],
      "correctIndex": 2,
      "hint": "The counter should present the data it collects.",
      "explanation": "Slide 13 asks the program to display corresponding characters and values."
    },
    {
      "id": "level-5-passenger-counter-09",
      "topic": "limitations-and-improvement",
      "learningSlide": 8,
      "prompt": "What can go wrong when many people pass the basic infrared counter together?",
      "choices": [
        "It always detects exactly twice as many people",
        "Some people may not be counted",
        "It measures every person's height perfectly",
        "Its data automatically become more accurate"
      ],
      "correctIndex": 1,
      "hint": "A single sensing event may hide more than one person.",
      "explanation": "Slide 8 warns that the method can miss people when many pass together."
    },
    {
      "id": "level-5-passenger-counter-10",
      "topic": "limitations-and-improvement",
      "learningSlide": 18,
      "prompt": "How does the lesson suggest improving the counter for multiple passing objects?",
      "choices": [
        "Remove the counting loop",
        "Turn off the infrared sensor permanently",
        "Adjust detection thresholds or add supporting sensors",
        "Replace the count with a random number"
      ],
      "correctIndex": 2,
      "hint": "The extension focuses on sensing multiple objects better.",
      "explanation": "Slide 18 suggests changing judgment parameters or adding other sensors to detect several objects."
    }
  ]
};
