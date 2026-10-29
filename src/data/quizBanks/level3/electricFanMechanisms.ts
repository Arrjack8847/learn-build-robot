/** Verified against original Level 3 Learning PDF, with 1-based source slides. */
import type { QuizBank } from "../../quizStudio";

export const electricFanMechanismsBank: QuizBank = {
  "projectId": "level-3-electric-fan-mechanisms-and-concepts",
  "title": "Electric Fan — Mechanisms & Concepts",
  "sourcePdfPath": "public/Level 3/Learning/Mechanisms and Concepts/Electric fan.pdf",
  "sourcePageCount": 14,
  "questions": [
    {
      "id": "electricfanme-01",
      "topic": "airflow",
      "learningSlide": 5,
      "prompt": "What produces the wind from an electric fan?",
      "choices": [
        "A stationary motor coil only",
        "Light reflected from the case",
        "A small speaker vibrating without blades",
        "Rotating blades driving airflow"
      ],
      "correctIndex": 3,
      "hint": "Think about how rotating blades affect the surrounding air.",
      "explanation": "Slide 5 explains that spinning blades move air and create wind."
    },
    {
      "id": "electricfanme-02",
      "topic": "airflow",
      "learningSlide": 4,
      "prompt": "Why is the electric fan presented as useful during summer?",
      "choices": [
        "It moves air to help people feel cooler",
        "It alters Earth's seasons",
        "It creates sunlight indoors",
        "It removes all heat from a building"
      ],
      "correctIndex": 0,
      "hint": "Think about how rotating blades affect the surrounding air.",
      "explanation": "Slide 4 discusses devices people developed to cope with summer heat."
    },
    {
      "id": "electricfanme-03",
      "topic": "gear",
      "learningSlide": 6,
      "prompt": "What mechanism can speed up the fan blades in addition to motor programming?",
      "choices": [
        "A passive electrical display",
        "A gear acceleration structure",
        "A fixed support bracket",
        "An ultrasonic sensor alone"
      ],
      "correctIndex": 1,
      "hint": "The lesson changes rotational speed through transmission.",
      "explanation": "Slide 6 explicitly mentions gear acceleration as another way to increase fan rotation."
    },
    {
      "id": "electricfanme-04",
      "topic": "gear",
      "learningSlide": 6,
      "prompt": "What is the intended effect of the lesson's acceleration gearing?",
      "choices": [
        "A permanently stopped motor",
        "Lower sensor range",
        "Faster blade rotation",
        "Automatic changes to the seasons"
      ],
      "correctIndex": 2,
      "hint": "The lesson changes rotational speed through transmission.",
      "explanation": "Slide 6 describes increasing blade speed with an acceleration structure."
    },
    {
      "id": "electricfanme-05",
      "topic": "motor",
      "learningSlide": 11,
      "prompt": "What is the aim of the first coding task?",
      "choices": [
        "Stop the fan after every button press",
        "Keep the fan at one fixed speed",
        "Make the fan rotate only once",
        "Make fan speed increase gradually"
      ],
      "correctIndex": 3,
      "hint": "The program can adjust motion without rebuilding the fan.",
      "explanation": "Slide 11 asks for programming that makes fan speed faster and faster."
    },
    {
      "id": "electricfanme-06",
      "topic": "motor",
      "learningSlide": 11,
      "prompt": "Which output should change in the first programming task?",
      "choices": [
        "Motor speed",
        "Ultrasonic probe location",
        "Number of fan blades",
        "Controller screen size"
      ],
      "correctIndex": 0,
      "hint": "The program can adjust motion without rebuilding the fan.",
      "explanation": "Slide 11 concerns programmed changes to fan speed."
    },
    {
      "id": "electricfanme-07",
      "topic": "sensor",
      "learningSlide": 12,
      "prompt": "What input is used to automatically adjust fan speed in Task 2?",
      "choices": [
        "Temperature of the controller case",
        "Distance measured by an infrared sensor",
        "Number of objects in the room",
        "Time since the last button press only"
      ],
      "correctIndex": 1,
      "hint": "A distance measurement changes an output command.",
      "explanation": "Slide 12 assigns automatic speed changes to infrared distance readings."
    },
    {
      "id": "electricfanme-08",
      "topic": "sensor",
      "learningSlide": 12,
      "prompt": "Which programming feature is proposed for adjusting speed from the sensor value?",
      "choices": [
        "Picture editing tools",
        "A fixed no-argument sound loop",
        "Variable-related blocks",
        "Disconnecting the controller"
      ],
      "correctIndex": 2,
      "hint": "A distance measurement changes an output command.",
      "explanation": "Slide 12 asks learners to use variable modules in the speed-changing program."
    },
    {
      "id": "electricfanme-09",
      "topic": "switch",
      "learningSlide": 13,
      "prompt": "What should happen after the first touch-sensor press in the challenge?",
      "choices": [
        "The fan stays permanently off",
        "The ultrasonic sensor resets",
        "The motor is disconnected",
        "The fan runs"
      ],
      "correctIndex": 3,
      "hint": "The challenge replaces one kind of input sensor with another.",
      "explanation": "Slide 13 specifies a touch press to start the fan."
    },
    {
      "id": "electricfanme-10",
      "topic": "switch",
      "learningSlide": 13,
      "prompt": "What should happen on the next touch-sensor press?",
      "choices": [
        "The fan stops",
        "The fan accelerates without limit",
        "The fan changes battery",
        "The controller erases the program"
      ],
      "correctIndex": 0,
      "hint": "The challenge replaces one kind of input sensor with another.",
      "explanation": "Slide 13 specifies a second press to stop the fan."
    }
  ]
};
