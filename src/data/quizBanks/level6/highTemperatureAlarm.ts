/** Question facts and 1-based slide references reviewed against the official 23-page Level 6 Learning PDF text. */
import type { QuizBank } from "../../quizStudio";

export const highTemperatureAlarmBank: QuizBank = {
  "projectId": "level-6-high-temperature-alarm",
  "title": "High Temperature Alarm",
  "sourcePdfPath": "public/Level 6/Learning/Sensor Automation/High Temperature Alarm/29. High Temperature Alarm-Teaching Slides.pdf",
  "sourcePageCount": 23,
  "questions": [
    {
      "id": "hightem-01",
      "learningSlide": 6,
      "topic": "temperature-alarm-purpose",
      "prompt": "When does the temperature alarm issue a warning, according to the lesson?",
      "choices": [
        "Only when the display turns off",
        "When a reading passes a user-set critical temperature",
        "Whenever the controller starts",
        "Only when humidity equals zero"
      ],
      "correctIndex": 1,
      "hint": "Consider what measured condition the alarm monitors.",
      "explanation": "Slide 6 explains that an alarm is sent when temperature exceeds or falls below a critical value set by the user."
    },
    {
      "id": "hightem-02",
      "learningSlide": 6,
      "topic": "temperature-alarm-purpose",
      "prompt": "Why must a temperature alarm repeatedly monitor its surroundings?",
      "choices": [
        "To change the sensor's physical shape",
        "To measure the width of the screen",
        "To avoid using a threshold",
        "To detect changes relative to the set limit"
      ],
      "correctIndex": 3,
      "hint": "The environment can become hotter or cooler after the system starts.",
      "explanation": "Slide 6 describes detecting outside temperature in real time and warning when it crosses the set limit."
    },
    {
      "id": "hightem-03",
      "learningSlide": 8,
      "topic": "temperature-sensor",
      "prompt": "What two environmental quantities can the lesson's digital sensor measure?",
      "choices": [
        "Temperature and humidity",
        "Distance and wheel speed",
        "Sound and motor torque",
        "Light and compass direction"
      ],
      "correctIndex": 0,
      "hint": "It combines two different measurements within one small module.",
      "explanation": "Slide 8 defines it as a digital temperature-and-humidity sensor."
    },
    {
      "id": "hightem-04",
      "learningSlide": 8,
      "topic": "temperature-sensor",
      "prompt": "What temperature range is stated for the lesson's temperature-and-humidity sensor?",
      "choices": [
        "0 to 40 °C",
        "20 to 60 °C",
        "-40 to 125 °C",
        "100 to 250 °C"
      ],
      "correctIndex": 2,
      "hint": "Recall the wide measurement span of the module, including temperatures below freezing.",
      "explanation": "Slide 8 gives the sensor's temperature detection range as -40 °C to 125 °C."
    },
    {
      "id": "hightem-05",
      "learningSlide": 13,
      "topic": "alarm-feedback",
      "prompt": "As measured temperature becomes higher, how should the buzzer behave in the initial program?",
      "choices": [
        "Stop responding altogether",
        "Beep faster",
        "Beep only once a minute",
        "Reduce its frequency to zero immediately"
      ],
      "correctIndex": 1,
      "hint": "The initial alarm makes a stronger warning as heat increases.",
      "explanation": "Slide 13 specifies that higher temperatures cause faster beeping."
    },
    {
      "id": "hightem-06",
      "learningSlide": 13,
      "topic": "alarm-feedback",
      "prompt": "What additional visual warning does the lesson propose displaying during high temperature?",
      "choices": [
        "A blue progress wheel",
        "A yellow battery symbol",
        "A rotating gear animation",
        "A red border around the screen"
      ],
      "correctIndex": 3,
      "hint": "The lesson pairs an audible warning with a visible danger signal.",
      "explanation": "Slide 13 suggests showing a red screen border to indicate high-temperature danger."
    },
    {
      "id": "hightem-07",
      "learningSlide": 14,
      "topic": "sensor-setup",
      "prompt": "What must happen to the temperature-and-humidity sensor during the program's initial settings?",
      "choices": [
        "It is activated after setting the font size",
        "It is unplugged before reading",
        "It is replaced by a distance sensor",
        "It is used only to count button presses"
      ],
      "correctIndex": 0,
      "hint": "Sensors generally need initialization before their readings are used.",
      "explanation": "Slide 14 instructs the program to activate the sensor after setting the font size."
    },
    {
      "id": "hightem-08",
      "learningSlide": 15,
      "topic": "sensor-setup",
      "prompt": "What does the display-value programming step do?",
      "choices": [
        "Change the alarm casing",
        "Calibrate the wheel encoder",
        "Read sensor data and display the temperature",
        "Turn the temperature reading into a random gesture"
      ],
      "correctIndex": 2,
      "hint": "It makes the measured value visible to a student.",
      "explanation": "Slide 15 directs the program to read data and display the temperature value."
    },
    {
      "id": "hightem-09",
      "learningSlide": 16,
      "topic": "buzzer-timing",
      "prompt": "Which parameter controls how long the buzzer stays on and off in the alarm function?",
      "choices": [
        "Motor angle",
        "Time interval",
        "Screen brightness",
        "Sensor connection colour"
      ],
      "correctIndex": 1,
      "hint": "The alarm rhythm depends on the gaps between beeps.",
      "explanation": "Slide 16 describes an alarm function that controls buzzer on-off intervals using a time parameter."
    },
    {
      "id": "hightem-10",
      "learningSlide": 21,
      "topic": "buzzer-timing",
      "prompt": "What change does the lesson's optimization activity require?",
      "choices": [
        "Keep beep speed constant",
        "Remove temperature measurements",
        "Increase motor speed",
        "Make beeping slower as temperature rises"
      ],
      "correctIndex": 3,
      "hint": "The optimization deliberately reverses the initial relationship between temperature and beep rate.",
      "explanation": "Slide 21 asks students to change the buzzer formula so higher temperatures produce slower beeping."
    }
  ]
};
