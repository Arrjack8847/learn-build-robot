/** Source-reviewed against the official 22-page Level 5 Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const magneticAntiTheftCabinetBank: QuizBank = {
  "projectId": "level-5-magnetic-anti-theft-cabinet",
  "title": "Magnetic Anti-theft Cabinet",
  "sourcePdfPath": "public/Level 5/Learning/Automation & Security/Magnetic Anti-theft Cabinet/08. Magnetic Anti-theft Cabinet_Teaching Slides.pdf",
  "sourcePageCount": 22,
  "questions": [
    {
      "id": "level-5-magnetic-anti-theft-cabinet-01",
      "topic": "safe-types",
      "learningSlide": 4,
      "prompt": "How do mechanical safes typically differ from electronic safes in the lesson?",
      "choices": [
        "Mechanical safes use physical keys; electronic safes use electronic keys",
        "Mechanical safes always recognize faces; electronic safes have no locks",
        "Both kinds are opened only by magnet strength",
        "Electronic safes cannot be locked"
      ],
      "correctIndex": 0,
      "hint": "The slide compares the types of keys used.",
      "explanation": "Slide 4 distinguishes mechanical safes using physical keys from electronic safes using electronic keys."
    },
    {
      "id": "level-5-magnetic-anti-theft-cabinet-02",
      "topic": "safe-types",
      "learningSlide": 9,
      "prompt": "Which development helped safes use electronic combination locks?",
      "choices": [
        "Advances in semiconductor technology",
        "Replacing every lock with wooden hinges",
        "Removing all electronic components",
        "Discovering new planetary orbits"
      ],
      "correctIndex": 0,
      "hint": "The lesson connects electronic locks to electronics progress.",
      "explanation": "Slide 9 links the development of electronic combination locks in the 1960s–1970s to semiconductor technology."
    },
    {
      "id": "level-5-magnetic-anti-theft-cabinet-03",
      "topic": "magnetic-monitoring",
      "learningSlide": 11,
      "prompt": "What event should the magnetic anti-theft cabinet model detect?",
      "choices": [
        "A magnetic object being removed or moved",
        "A rise in outdoor wind speed",
        "A red traffic light",
        "An increase in passenger arrivals"
      ],
      "correctIndex": 0,
      "hint": "The alarm protects an item inside the cabinet.",
      "explanation": "Slide 11 says the alarm should sound when the magnetic object is taken away."
    },
    {
      "id": "level-5-magnetic-anti-theft-cabinet-04",
      "topic": "magnetic-monitoring",
      "learningSlide": 12,
      "prompt": "Why does the program first record the strength of a magnetic object placed inside?",
      "choices": [
        "To obtain a baseline to compare against later measurements",
        "To force the motor to spin continuously",
        "To determine the cabinet's paint color",
        "To calculate the distance to the Moon"
      ],
      "correctIndex": 0,
      "hint": "Later readings are checked for changes.",
      "explanation": "Slide 12 instructs recording the initial magnetic intensity before monitoring for changes."
    },
    {
      "id": "level-5-magnetic-anti-theft-cabinet-05",
      "topic": "reference-readings",
      "learningSlide": 13,
      "prompt": "Which user action records the cabinet's initial magnetic field information?",
      "choices": [
        "Press the left controller button with the magnetic object in place",
        "Disconnect the sensor",
        "Open an unrelated website",
        "Move the cabinet without starting the program"
      ],
      "correctIndex": 0,
      "hint": "An explicit controller button captures the baseline.",
      "explanation": "Slide 13 instructs pressing the left button to store the current field direction and intensity."
    },
    {
      "id": "level-5-magnetic-anti-theft-cabinet-06",
      "topic": "reference-readings",
      "learningSlide": 14,
      "prompt": "What does the monitor step do with later sensor readings?",
      "choices": [
        "Repeatedly compare them with previously recorded data",
        "Erase the initial value before every comparison",
        "Compare them only to ambient temperature",
        "Stop checking after a single measurement"
      ],
      "correctIndex": 0,
      "hint": "The model looks for a difference over time.",
      "explanation": "Slide 14 describes cyclically reading the magnetic sensor for comparison with saved measurements."
    },
    {
      "id": "level-5-magnetic-anti-theft-cabinet-07",
      "topic": "alarm-logic",
      "learningSlide": 15,
      "prompt": "How is the sample alarm sound produced?",
      "choices": [
        "By switching a buzzer on and off several times quickly",
        "By running the cabinet motor at full speed",
        "By measuring barometric pressure",
        "By displaying only a number without sound"
      ],
      "correctIndex": 0,
      "hint": "The warning repeats brief sound pulses.",
      "explanation": "Slide 15 describes an alarm subroutine that toggles the buzzer on and off repeatedly."
    },
    {
      "id": "level-5-magnetic-anti-theft-cabinet-08",
      "topic": "alarm-logic",
      "learningSlide": 16,
      "prompt": "What difference in measured magnetic-field intensity triggers the sample theft alarm?",
      "choices": [
        "A difference greater than 100",
        "Any change of exactly 1",
        "Only a difference of 0",
        "A difference smaller than -500"
      ],
      "correctIndex": 0,
      "hint": "The example uses a threshold just above one hundred.",
      "explanation": "Slide 16 says the item is treated as stolen when the intensity difference is greater than 100."
    },
    {
      "id": "level-5-magnetic-anti-theft-cabinet-09",
      "topic": "sensitivity-and-extension",
      "learningSlide": 17,
      "prompt": "Besides magnetic-field intensity, what other change can activate the cabinet alarm?",
      "choices": [
        "A change in magnetic pole",
        "A drop in vehicle speed",
        "A change in the dot-matrix font",
        "A QR code being printed"
      ],
      "correctIndex": 0,
      "hint": "The sensor can report a direction as well as a strength.",
      "explanation": "Slide 17 states that changes in magnetic poles also trigger the alarm."
    },
    {
      "id": "level-5-magnetic-anti-theft-cabinet-10",
      "topic": "sensitivity-and-extension",
      "learningSlide": 20,
      "prompt": "What optimization does the lesson propose for the magnetic cabinet?",
      "choices": [
        "Tune the magnetic-change judgment range and customize the alarm sound",
        "Remove all comparisons and sensors",
        "Always sound the alarm even without change",
        "Replace the magnetic object with a temperature reading"
      ],
      "correctIndex": 0,
      "hint": "The model should avoid poor thresholds and have a distinct alarm.",
      "explanation": "Slide 20 asks students to optimize the judgment range and develop a specific alarm sound."
    }
  ]
};
