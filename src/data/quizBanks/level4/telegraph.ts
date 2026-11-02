import type { QuizBank } from "../../quizStudio";
/** Level 4 source-backed Telegraph quiz. */
export const telegraphBank: QuizBank = {
  "projectId": "level-4-telegraph",
  "title": "Telegraph",
  "sourcePdfPath": "public/Level 4/Mechanisms & Simulators/Telegraph/09.Telegraph -Slides.pdf",
  "sourcePageCount": 33,
  "questions": [
    {
      "id": "l4-telegraph-01",
      "topic": "telegraph-communication",
      "learningSlide": 3,
      "prompt": "What is a traditional telegraph used for?",
      "choices": [
        "Long-distance communication",
        "Measuring motor torque",
        "Recording light intensity",
        "Balancing a robot"
      ],
      "correctIndex": 0,
      "explanation": "The lesson introduces telegraphs as long-distance electrical communication devices.",
      "hint": "Think about sending messages before the Internet."
    },
    {
      "id": "l4-telegraph-02",
      "topic": "telegraph-communication",
      "learningSlide": 3,
      "prompt": "What kind of signal did early telegraphs transmit?",
      "choices": [
        "Motor gears",
        "Electrical signals",
        "GPS maps",
        "Touchscreen images"
      ],
      "correctIndex": 1,
      "explanation": "Electrical signals carried information along the telegraph.",
      "hint": "Think about sending messages before the Internet."
    },
    {
      "id": "l4-telegraph-03",
      "topic": "morse-signals",
      "learningSlide": 4,
      "prompt": "Which system is associated with short and long telegraph signals?",
      "choices": [
        "ASCII art only",
        "GPS coordinates",
        "Morse code",
        "QR code"
      ],
      "correctIndex": 2,
      "explanation": "The lesson introduces Morse code for telegraph signaling.",
      "hint": "Recall the two lengths of signals in Morse code."
    },
    {
      "id": "l4-telegraph-04",
      "topic": "morse-signals",
      "learningSlide": 4,
      "prompt": "What two types of marks are used in basic Morse-code messages?",
      "choices": [
        "Squares and circles",
        "Only numbers",
        "Only photographs",
        "Dots and dashes"
      ],
      "correctIndex": 3,
      "explanation": "Morse signals are represented by short and long marks.",
      "hint": "Recall the two lengths of signals in Morse code."
    },
    {
      "id": "l4-telegraph-05",
      "topic": "not-logic",
      "learningSlide": 23,
      "prompt": "What does a NOT logic operator do?",
      "choices": [
        "Invert a true/false condition",
        "Multiply two numbers",
        "Play a sound",
        "Rotate a gear"
      ],
      "correctIndex": 0,
      "explanation": "The lesson defines NOT as reversing a Boolean value.",
      "hint": "Consider how a logical condition changes after inversion."
    },
    {
      "id": "l4-telegraph-06",
      "topic": "not-logic",
      "learningSlide": 24,
      "prompt": "When is a NOT condition true?",
      "choices": [
        "Only during an MP3 file",
        "When the original condition is false",
        "Only when a motor starts",
        "Always after one second"
      ],
      "correctIndex": 1,
      "explanation": "NOT produces true when its input condition is not met.",
      "hint": "Consider how a logical condition changes after inversion."
    },
    {
      "id": "l4-telegraph-07",
      "topic": "press-duration",
      "learningSlide": 25,
      "prompt": "What must be measured to distinguish a short press from a long press?",
      "choices": [
        "Motor battery voltage",
        "Room temperature",
        "Button-press duration",
        "Screen color"
      ],
      "correctIndex": 2,
      "explanation": "The program records how long the touch sensor remains pressed.",
      "hint": "Think about measuring the time a button stays down."
    },
    {
      "id": "l4-telegraph-08",
      "topic": "press-duration",
      "learningSlide": 25,
      "prompt": "Which event lets the program finish timing a button press?",
      "choices": [
        "Changing the display picture",
        "Closing the PDF",
        "Hearing a music clip",
        "Releasing the button"
      ],
      "correctIndex": 3,
      "explanation": "The flow records press time until the sensor is released.",
      "hint": "Think about measuring the time a button stays down."
    },
    {
      "id": "l4-telegraph-09",
      "topic": "dot-line-program",
      "learningSlide": 26,
      "prompt": "What is drawn for a press shorter than the lesson's 200-unit threshold?",
      "choices": [
        "A dot",
        "A long dash",
        "A circle",
        "A triangle"
      ],
      "correctIndex": 0,
      "explanation": "Slide 26 uses a short duration to produce a dot.",
      "hint": "Follow the movement that marks a short or long signal."
    },
    {
      "id": "l4-telegraph-10",
      "topic": "dot-line-program",
      "learningSlide": 27,
      "prompt": "What does the program draw for a longer press?",
      "choices": [
        "A bar chart",
        "A line or dash",
        "A full photograph",
        "A smiley icon"
      ],
      "correctIndex": 1,
      "explanation": "Long presses use the line-producing branch.",
      "hint": "Follow the movement that marks a short or long signal."
    }
  ]
};
