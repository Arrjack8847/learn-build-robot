/** Source-checked Level 3 Learning PDF questions; slides are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const smartDoorBank: QuizBank = {
  "projectId": "level-3-smart-door",
  "title": "Smart Door",
  "sourcePdfPath": "public/Level 3/Learning/Automation & Security/Smart door/Smart door_Powerpoint.pdf",
  "sourcePageCount": 22,
  "questions": [
    {
      "id": "smdoor-01",
      "topic": "ultrasound-basics",
      "learningSlide": 9,
      "prompt": "Which frequency is higher than the hearing range given for humans and is called ultrasonic in this lesson?",
      "choices": [
        "Above 20,000 Hz",
        "Below 20 Hz",
        "Exactly 100 Hz",
        "Exactly 1 Hz"
      ],
      "correctIndex": 0,
      "hint": "The slide defines ultrasonic sound with a frequency limit.",
      "explanation": "Slide 9 defines ultrasound as sound above 20,000 Hz."
    },
    {
      "id": "smdoor-02",
      "topic": "ultrasound-basics",
      "learningSlide": 9,
      "prompt": "What unit is used to measure sound frequency?",
      "choices": [
        "Hertz (Hz)",
        "Kilograms",
        "Liters",
        "Meters"
      ],
      "correctIndex": 0,
      "hint": "The unit counts vibrations per second.",
      "explanation": "Slide 9 names Hertz as the unit of sound frequency."
    },
    {
      "id": "smdoor-03",
      "topic": "ultrasonic-sensor",
      "learningSlide": 11,
      "prompt": "What does an ultrasonic sensor usually convert ultrasonic signals into?",
      "choices": [
        "Electrical signals",
        "Paint colors",
        "Water",
        "Paper"
      ],
      "correctIndex": 0,
      "hint": "Sensors produce usable electronic information.",
      "explanation": "Slide 11 says ultrasonic sensors generally convert ultrasound to electrical signals."
    },
    {
      "id": "smdoor-04",
      "topic": "ultrasonic-sensor",
      "learningSlide": 11,
      "prompt": "What happens when an ultrasonic wave reaches an interface or obstacle?",
      "choices": [
        "It can reflect as an echo",
        "It always disappears without a trace",
        "It becomes visible light",
        "It turns into a solid"
      ],
      "correctIndex": 0,
      "hint": "The lesson uses reflected ultrasound.",
      "explanation": "Slide 11 describes ultrasonic reflection creating an echo."
    },
    {
      "id": "smdoor-05",
      "topic": "program-modules",
      "learningSlide": 12,
      "prompt": "Which option reads the ultrasonic value in the programming lesson?",
      "choices": [
        "Electronics → Sensor → Get Ultrasonic",
        "Sound → MP3 → Play",
        "Motor → Set power",
        "Display → Change font"
      ],
      "correctIndex": 0,
      "hint": "Look for the sensor-reading block.",
      "explanation": "Slide 12 lists the 'Get Ultrasonic' path."
    },
    {
      "id": "smdoor-06",
      "topic": "program-modules",
      "learningSlide": 12,
      "prompt": "Which type of module does the lesson list for showing a value on the screen?",
      "choices": [
        "Electronics Display → Set Display Var of line X",
        "Music → Change pitch",
        "Movement → Turn wheels",
        "Network → Connect Wi-Fi"
      ],
      "correctIndex": 0,
      "hint": "The slide names a display-variable command.",
      "explanation": "Slide 12 lists the Electronics Display module for setting a displayed value."
    },
    {
      "id": "smdoor-07",
      "topic": "sensor-test",
      "learningSlide": 17,
      "prompt": "At what distance does the first task place an obstacle to display the sensed value?",
      "choices": [
        "20 cm",
        "2 m",
        "5 cm",
        "100 cm"
      ],
      "correctIndex": 0,
      "hint": "The task asks for a nearby obstacle with a specified distance.",
      "explanation": "Slide 17 places an obstacle 20 cm in front of the robot to read and display the value."
    },
    {
      "id": "smdoor-08",
      "topic": "sensor-test",
      "learningSlide": 18,
      "prompt": "What does Task 2 make the robot do when the distance is less than 20 cm?",
      "choices": [
        "Sound the buzzer",
        "Turn off every sensor",
        "Move backward 100 cm",
        "Change wheel colors"
      ],
      "correctIndex": 0,
      "hint": "The second task responds with a sound.",
      "explanation": "Slide 18 specifies a buzzer when the measured distance is under 20 cm."
    },
    {
      "id": "smdoor-09",
      "topic": "door-automation",
      "learningSlide": 19,
      "prompt": "What should the smart-door task do when something is less than 20 cm in front?",
      "choices": [
        "Sound and open the door",
        "Ignore the person",
        "Change its display only",
        "Move the entire wall"
      ],
      "correctIndex": 0,
      "hint": "The door opens for a nearby approach.",
      "explanation": "Slide 19 says to sound and open the door when the object is closer than 20 cm."
    },
    {
      "id": "smdoor-10",
      "topic": "door-automation",
      "learningSlide": 19,
      "prompt": "What should the same task do when nothing is in front of the door?",
      "choices": [
        "Close the door",
        "Keep it fully open indefinitely",
        "Ring the buzzer for one hour",
        "Switch to playing music"
      ],
      "correctIndex": 0,
      "hint": "The task contrasts presence and absence.",
      "explanation": "Slide 19 says to close the door when no one is in front."
    }
  ]
};
