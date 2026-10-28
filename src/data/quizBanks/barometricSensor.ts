/** Checked against the actual 26-page Learning PDF. */
import type { QuizBank } from "../quizStudio";

export const barometricSensorBank: QuizBank = {
  "projectId": "level-5-barometric-sensor",
  "title": "Barometric Sensor",
  "sourcePdfPath": "public/Level 5/Learning/Sensor Automation/Barometric Sensor/17.Barometric Pressure Meter-Teaching Slides.pdf",
  "sourcePageCount": 26,
  "questions": [
    {
      "id": "baro-01",
      "topic": "atmosphere",
      "learningSlide": 4,
      "prompt": "What does atmospheric pressure describe?",
      "choices": [
        "The voltage applied to a robot motor",
        "The rate of a motor's rotation",
        "The robot's battery temperature",
        "Pressure exerted by air on an area"
      ],
      "correctIndex": 3,
      "explanation": "The lesson defines atmospheric pressure as pressure exerted by the atmosphere per unit area.",
      "hint": "Think about the weight of the air around objects."
    },
    {
      "id": "baro-02",
      "topic": "atmosphere",
      "learningSlide": 4,
      "prompt": "As altitude increases, what generally happens to atmospheric pressure?",
      "choices": [
        "It stays exactly constant",
        "It decreases",
        "It always doubles",
        "It becomes independent of air density"
      ],
      "correctIndex": 1,
      "explanation": "The lesson explains that thinner air at higher elevations generally produces lower pressure.",
      "hint": "Think about how much atmosphere remains above a high mountain."
    },
    {
      "id": "baro-03",
      "topic": "sensor",
      "learningSlide": 12,
      "prompt": "Which sensor is used to detect the current atmospheric pressure?",
      "choices": [
        "Barometric sensor",
        "Color sensor",
        "Ultrasonic distance sensor",
        "Angle sensor"
      ],
      "correctIndex": 0,
      "explanation": "Slide 12 identifies the barometric sensor as the device used to read atmospheric pressure.",
      "hint": "Choose the sensor designed for an air-pressure measurement."
    },
    {
      "id": "baro-04",
      "topic": "sensor",
      "learningSlide": 13,
      "prompt": "Which two kinds of sensing elements are described inside the sensor chip?",
      "choices": [
        "Color-sensitive and sound-sensitive",
        "Ultrasonic and infrared",
        "Pressure-sensitive and temperature-sensitive",
        "Magnetic and touch-sensitive"
      ],
      "correctIndex": 2,
      "explanation": "The internal chip includes elements sensitive to pressure and temperature.",
      "hint": "Think about conditions the lesson says may affect the pressure measurement."
    },
    {
      "id": "baro-05",
      "topic": "monitor-build",
      "learningSlide": 15,
      "prompt": "What should the completed barometric pressure monitor display?",
      "choices": [
        "Current robot wheel speed",
        "Distance to the nearest wall",
        "Current atmospheric pressure",
        "Brightness measured by a lamp"
      ],
      "correctIndex": 2,
      "explanation": "Slide 15 asks students to build a monitor that displays the current barometric value.",
      "hint": "Remember what the main sensor actually measures."
    },
    {
      "id": "baro-06",
      "topic": "monitor-build",
      "learningSlide": 18,
      "prompt": "After power-on, approximately how long does the lesson say the barometric sensor needs to activate?",
      "choices": [
        "1–2 seconds",
        "10–12 seconds",
        "1 minute",
        "5 minutes"
      ],
      "correctIndex": 0,
      "explanation": "The initialization instructions state that activation takes about one to two seconds.",
      "hint": "Look for the short sensor startup delay described before readings begin."
    },
    {
      "id": "baro-07",
      "topic": "programming",
      "learningSlide": 19,
      "prompt": "What does the program do with each newly read pressure value?",
      "choices": [
        "Deletes all previous code",
        "Stores it in a variable",
        "Sends it directly to a color sensor",
        "Converts it into a motor angle"
      ],
      "correctIndex": 1,
      "explanation": "Slide 19 instructs continuous reading of pressure data into a variable.",
      "hint": "Think about how a program can keep a measurement for later comparison."
    },
    {
      "id": "baro-08",
      "topic": "programming",
      "learningSlide": 20,
      "prompt": "How does the program decide whether to show high or low pressure?",
      "choices": [
        "Checks whether the LCD is bright",
        "Counts the number of wires",
        "Uses the motor's rotation direction",
        "Compares the measured pressure with a reference value"
      ],
      "correctIndex": 3,
      "explanation": "The program displays a reading and compares it against a baseline to label pressure high or low.",
      "hint": "Think about what measurement needs a comparison before you label it high or low."
    },
    {
      "id": "baro-09",
      "topic": "calibration",
      "learningSlide": 24,
      "prompt": "Why does the optimization task use a local average atmospheric pressure?",
      "choices": [
        "It always makes the sensor's reading larger",
        "It removes the need to read pressure",
        "It guarantees identical weather worldwide",
        "It makes the comparison more suitable for that location"
      ],
      "correctIndex": 3,
      "explanation": "The lesson says local averages help the monitor assess the current area more reasonably.",
      "hint": "Remember that readings can vary between different locations."
    },
    {
      "id": "baro-10",
      "topic": "calibration",
      "learningSlide": 25,
      "prompt": "Which source does the lesson suggest checking for a local average pressure?",
      "choices": [
        "The robot's motor speed log",
        "A color-code reference sheet",
        "A national weather station",
        "The building manual's parts count"
      ],
      "correctIndex": 2,
      "explanation": "The further-reading slide suggests looking up the local average from the national weather station.",
      "hint": "Think about which source collects atmospheric measurements over time."
    }
  ]
};
