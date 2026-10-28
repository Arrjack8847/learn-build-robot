/** Checked against the actual 20-page Learning PDF. */
import type { QuizBank } from "../quizStudio";

export const acousticControlLampBank: QuizBank = {
  "projectId": "level-4-acoustic-control-lamp",
  "title": "Acoustic Control Lamp",
  "sourcePdfPath": "public/Level 4/Sound & Voice Interaction/Acoustic control lamp/Acoustic control lamp_Powerpoint-update.pdf",
  "sourcePageCount": 20,
  "questions": [
    {
      "id": "acl-01",
      "topic": "sound-detection",
      "learningSlide": 7,
      "prompt": "What does the sound-sensitive sensor detect in the lamp project?",
      "choices": [
        "Sound compared with a set threshold",
        "Air pressure compared with sea level",
        "Distance measured with ultrasound",
        "Light measured by a photoelectric sensor"
      ],
      "correctIndex": 0,
      "explanation": "The sensor checks for sound, and the lamp can respond when sound exceeds a chosen threshold.",
      "hint": "Think about which input you can provide by speaking or clapping."
    },
    {
      "id": "acl-02",
      "topic": "sound-detection",
      "learningSlide": 2,
      "prompt": "Which device does the lesson teach students to use for sensing a sound signal?",
      "choices": [
        "Sound-sensitive sensor",
        "Ultrasonic ranging sensor",
        "Gyroscope sensor",
        "Barometric pressure sensor"
      ],
      "correctIndex": 0,
      "explanation": "The lesson's objective is to use the sound-sensitive module and acoustic sensor.",
      "hint": "Review which sensor converts a sound event into a program input."
    },
    {
      "id": "acl-03",
      "topic": "conditions",
      "learningSlide": 9,
      "prompt": "Why does the lesson introduce a double conditional judgment?",
      "choices": [
        "To handle combinations of two sensor states",
        "To replace the robot's physical sensors",
        "To measure the lamp's battery voltage",
        "To force the same action for every situation"
      ],
      "correctIndex": 0,
      "explanation": "Slide 9 uses nested conditions to choose between different actions based on two sensor readings.",
      "hint": "Think about whether one sensor result can describe two independent inputs."
    },
    {
      "id": "acl-04",
      "topic": "conditions",
      "learningSlide": 10,
      "prompt": "What can a variable represent in the lamp's program?",
      "choices": [
        "A state or action",
        "Only a physical wire length",
        "Only the sound sensor's brand",
        "The fixed number of LEGO bricks"
      ],
      "correctIndex": 0,
      "explanation": "The lesson says variables can indicate actions or states.",
      "hint": "Think about how a program could remember whether the light is on or off."
    },
    {
      "id": "acl-05",
      "topic": "sound-threshold",
      "learningSlide": 14,
      "prompt": "In the basic sound-detection flow, what happens if sound is not above the chosen value?",
      "choices": [
        "No triggering action is taken",
        "The system automatically changes the threshold",
        "The light must flash every second",
        "The program activates both sensor branches"
      ],
      "correctIndex": 0,
      "explanation": "The flowchart shows an action when sound exceeds the value, otherwise no reaction.",
      "hint": "Compare the two branches of the sound threshold decision."
    },
    {
      "id": "acl-06",
      "topic": "sound-threshold",
      "learningSlide": 15,
      "prompt": "The simple lamp program uses a sound threshold of 500. What happens when a reading is greater than 500?",
      "choices": [
        "The lamp turns on",
        "The lamp turns off",
        "The touch sensor is disabled",
        "The threshold changes to 1,000"
      ],
      "correctIndex": 0,
      "explanation": "Slide 15 says the light turns on for sound readings above 500; otherwise it is off.",
      "hint": "Pay attention to which side of the threshold activates the light."
    },
    {
      "id": "acl-07",
      "topic": "toggle-control",
      "learningSlide": 16,
      "prompt": "In the two-shout example, what does the second sufficiently loud shout do?",
      "choices": [
        "Turns the lamp back off",
        "Keeps increasing the brightness",
        "Changes the sound threshold",
        "Disconnects the sensor"
      ],
      "correctIndex": 0,
      "explanation": "The slide describes one shout switching on the light and another switching it off.",
      "hint": "Think about how a toggle works when you activate it again."
    },
    {
      "id": "acl-08",
      "topic": "toggle-control",
      "learningSlide": 16,
      "prompt": "If the lamp starts off in the two-shout example, what does the first loud shout do?",
      "choices": [
        "Turns the lamp on",
        "Switches the entire program off",
        "Resets the sensor to zero",
        "Changes to daytime mode"
      ],
      "correctIndex": 0,
      "explanation": "The first sound above the threshold switches on the lamp in this example.",
      "hint": "Read the sequence from the initial off state to its first change."
    },
    {
      "id": "acl-09",
      "topic": "day-night-logic",
      "learningSlide": 17,
      "prompt": "In the night-mode example, how long after switching on does the light turn off automatically?",
      "choices": [
        "5 seconds",
        "1 second",
        "10 seconds",
        "30 seconds"
      ],
      "correctIndex": 0,
      "explanation": "The lesson's night-mode task keeps the lamp on for five seconds after the triggering sound.",
      "hint": "Look for the delay period specified in the night-mode program."
    },
    {
      "id": "acl-10",
      "topic": "day-night-logic",
      "learningSlide": 17,
      "prompt": "In the daytime state of the lesson's touch-controlled system, how does it respond to sound?",
      "choices": [
        "It does not react to the sound",
        "It switches on for five seconds",
        "It stays lit until the next shout",
        "It resets the sensor threshold"
      ],
      "correctIndex": 0,
      "explanation": "Slide 17 specifies that the system is switched off during the day and does not respond to sound.",
      "hint": "Compare how the touch-controlled program behaves by day and by night."
    }
  ]
};
