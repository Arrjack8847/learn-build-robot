/** Level 6 Regional Weather Station: source-supported text-only questions.
 * Official 24-page PDF was extracted by numbered /Contents streams.
 * Images and diagrams have not been used as answer evidence.
 */
import type { QuizBank } from "../../quizStudio";

export const regionalWeatherStationBank: QuizBank = {
  "projectId": "level-6-regional-weather-station",
  "title": "Regional Weather Station",
  "sourcePdfPath": "public/Level 6/Learning/Biomimicry & Stimulus Response/Regional Weather Station/32.Regional Weather Station-Teaching Slides.pdf",
  "sourcePageCount": 24,
  "questions": [
    {
      "id": "rws-01",
      "topic": "weather-station-measurements",
      "learningSlide": 9,
      "prompt": "Which set of measurements does the lesson say weather forecasters analyse from weather stations?",
      "choices": [
        "Temperature, humidity and wind direction",
        "Temperature, motor speed and battery charge",
        "Humidity, wheel speed and motor position",
        "Wind direction, controller memory and sound level"
      ],
      "correctIndex": 0,
      "hint": "Think about environmental conditions rather than measurements inside a robot.",
      "explanation": "Slide 9 identifies temperature, humidity and wind direction as examples of weather-station data used in forecasting."
    },
    {
      "id": "rws-02",
      "topic": "weather-station-measurements",
      "learningSlide": 10,
      "prompt": "Which instrument is included in the lesson's list of equipment at a general weather station?",
      "choices": [
        "Motor encoder",
        "Servo controller",
        "Rain gauge",
        "Touch switch"
      ],
      "correctIndex": 2,
      "hint": "Consider devices that observe precipitation, air conditions or wind.",
      "explanation": "Slide 10 lists a rain gauge alongside a barometer, thermometer, anemometer, hygrometer and wind vane."
    },
    {
      "id": "rws-03",
      "topic": "sensor-readings-and-display",
      "learningSlide": 15,
      "prompt": "How should the program initially store temperature and humidity readings?",
      "choices": [
        "In the same fixed text label",
        "In two different variables",
        "Only in the motor's angle counter",
        "As one constant speed value"
      ],
      "correctIndex": 1,
      "hint": "The two sensor readings must be available independently for later calculations.",
      "explanation": "Slide 15 instructs students to store the two data values from the sensor in two different variables."
    },
    {
      "id": "rws-04",
      "topic": "sensor-readings-and-display",
      "learningSlide": 16,
      "prompt": "Why does the lesson display the temperature and humidity variables before setting the motor speed?",
      "choices": [
        "To increase the motor's maximum speed",
        "To switch off the temperature sensor",
        "To change the sensor's physical position",
        "To check whether the values match the real conditions"
      ],
      "correctIndex": 3,
      "hint": "Think of the display as a way to inspect the input data.",
      "explanation": "Slide 16 asks students to display both variable values to see whether they match reality."
    },
    {
      "id": "rws-05",
      "topic": "weighted-speed-control",
      "learningSlide": 14,
      "prompt": "What temperature-to-humidity ratio is used in the initial motor-speed calculation?",
      "choices": [
        "7:3",
        "1:1",
        "3:7",
        "2:8"
      ],
      "correctIndex": 2,
      "hint": "The original program gives the larger share to the humidity reading.",
      "explanation": "Slide 14 specifies a temperature-to-humidity ratio of 3:7 for more reasonable motor rotation control."
    },
    {
      "id": "rws-06",
      "topic": "weighted-speed-control",
      "learningSlide": 14,
      "prompt": "Why does the lesson weight temperature and humidity instead of simply adding their values for motor speed?",
      "choices": [
        "Their sum can exceed 100 and reach the highest motor speed",
        "Weighted readings automatically remove sensor noise",
        "Their sum always becomes less than zero",
        "Adding the readings disables the humidity sensor"
      ],
      "correctIndex": 0,
      "hint": "Consider what can happen to a speed value when two measurements are combined without scaling.",
      "explanation": "Slide 14 warns that the sum of temperature and humidity can easily exceed 100 and reach the highest speed; the 3:7 weighting makes control more reasonable."
    },
    {
      "id": "rws-07",
      "topic": "motor-and-model-behaviour",
      "learningSlide": 13,
      "prompt": "Which weather-station component does the lesson ask students to simulate with the assembled rotating model?",
      "choices": [
        "Rain gauge",
        "Barometer",
        "Thermometer",
        "Anemometer"
      ],
      "correctIndex": 3,
      "hint": "The model uses rotation to represent one kind of weather instrument.",
      "explanation": "Slide 13 explicitly asks students to build a weather station that simulates anemometer rotation."
    },
    {
      "id": "rws-08",
      "topic": "motor-and-model-behaviour",
      "learningSlide": 18,
      "prompt": "After the speed value has been calculated, what should the program make the motor do?",
      "choices": [
        "Rotate at the calculated speed",
        "Rotate at one permanent fixed speed",
        "Stop until a button is pressed",
        "Rotate according to the page number"
      ],
      "correctIndex": 0,
      "hint": "Follow the flow from measured values, to calculation, to a motor command.",
      "explanation": "Slide 18 directs students to display the calculated value and let the motor rotate according to that speed."
    },
    {
      "id": "rws-09",
      "topic": "program-optimization",
      "learningSlide": 22,
      "prompt": "What is the main goal of the lesson's program-optimization challenge?",
      "choices": [
        "Make wind direction the only input",
        "Make temperature the main influence on motor speed",
        "Ignore both sensor readings during operation",
        "Make humidity the only input"
      ],
      "correctIndex": 1,
      "hint": "Compare the intended dominant input before and after the optimization.",
      "explanation": "Slide 22 asks students to modify the program so temperature becomes the primary factor controlling motor speed."
    },
    {
      "id": "rws-10",
      "topic": "program-optimization",
      "learningSlide": 22,
      "prompt": "Which change to the original temperature-to-humidity weighting satisfies the optimization requirement?",
      "choices": [
        "Change it from 3:7 to 2:8",
        "Change it from 3:7 to 1:9",
        "Change it from 3:7 to 5:5",
        "Change it from 3:7 to 7:3"
      ],
      "correctIndex": 3,
      "hint": "The revised ratio must give temperature a greater share than humidity.",
      "explanation": "Slide 22 requires the temperature proportion to exceed the humidity proportion; 7:3 meets that requirement."
    }
  ]
};
