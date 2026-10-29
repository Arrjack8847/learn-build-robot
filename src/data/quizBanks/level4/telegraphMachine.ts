/** Level 4 — Telegraph machine. Questions checked against the 22-page Learning PDF text; diagram-independent, Acceleration Car difficulty. */
import type { QuizBank } from "../../quizStudio";

export const telegraphMachineBank: QuizBank = {
  "projectId": "level-4-telegraph-machine",
  "title": "Telegraph machine",
  "sourcePdfPath": "public/Level 4/Interactive Mechanisms/Telegraph machine/Telegraph machine_Powerpoint-update.pdf",
  "sourcePageCount": 22,
  "questions": [
    {
      "id": "l4-telegraphmachine-01",
      "topic": "telegraph-purpose",
      "learningSlide": 7,
      "prompt": "What does the Telegraph Machine use to detect an input signal?",
      "choices": [
        "A touch sensor",
        "A color sensor",
        "A temperature probe",
        "A pressure gauge"
      ],
      "correctIndex": 0,
      "explanation": "Slide 7 says the touch sensor detects the input signal.",
      "hint": "Think about how a user signals the model."
    },
    {
      "id": "l4-telegraphmachine-02",
      "topic": "telegraph-purpose",
      "learningSlide": 9,
      "prompt": "What is a telegraph machine used for?",
      "choices": [
        "Sending and receiving telegrams",
        "Measuring wheel speed",
        "Opening curtains",
        "Following colored lines"
      ],
      "correctIndex": 0,
      "explanation": "Slide 9 defines a telegraph as a machine for sending and receiving telegrams.",
      "hint": "Think about a way people sent messages over long distances."
    },
    {
      "id": "l4-telegraphmachine-03",
      "topic": "variables-as-storage",
      "learningSlide": 10,
      "prompt": "What does a variable store inside a program?",
      "choices": [
        "Data or values",
        "Only water",
        "A robot's body",
        "Sunlight"
      ],
      "correctIndex": 0,
      "explanation": "Slide 10 describes variables as named storage spaces for data.",
      "hint": "Imagine a labeled box in a program."
    },
    {
      "id": "l4-telegraphmachine-04",
      "topic": "variables-as-storage",
      "learningSlide": 10,
      "prompt": "If a variable named a stores the number 1, what can the program use a for?",
      "choices": [
        "Remembering that value",
        "Turning it into a motor",
        "Opening an internet site",
        "Changing a sensor's shape"
      ],
      "correctIndex": 0,
      "explanation": "Slide 10 gives a=1 as a simple example of assigning and storing a value.",
      "hint": "Think about what a named box holds."
    },
    {
      "id": "l4-telegraphmachine-05",
      "topic": "assignment-and-counting",
      "learningSlide": 12,
      "prompt": "What do programmers call giving a value to a variable?",
      "choices": [
        "Painting",
        "Assignment",
        "Rotation",
        "Ranging"
      ],
      "correctIndex": 1,
      "explanation": "Slide 12 defines giving a value to a variable as assignment.",
      "hint": "Think about setting what the variable contains."
    },
    {
      "id": "l4-telegraphmachine-06",
      "topic": "assignment-and-counting",
      "learningSlide": 12,
      "prompt": "If a starts at 2, what is a after the instruction a = a + 1?",
      "choices": [
        "1",
        "2",
        "3",
        "4"
      ],
      "correctIndex": 2,
      "explanation": "Slide 12 describes a=a+1 as increasing the stored value by one, so 2 becomes 3.",
      "hint": "The stored number increases by one."
    },
    {
      "id": "l4-telegraphmachine-07",
      "topic": "sensor-reactions",
      "learningSlide": 17,
      "prompt": "What happens when the telegraph's touch sensor is pressed in the first program?",
      "choices": [
        "The buzzer sounds",
        "The wheels reverse",
        "The curtain closes",
        "The robot reads a tag"
      ],
      "correctIndex": 0,
      "explanation": "Slide 17 says a pressed touch sensor makes the buzzer sound.",
      "hint": "Think about a sound output responding to a button."
    },
    {
      "id": "l4-telegraphmachine-08",
      "topic": "sensor-reactions",
      "learningSlide": 18,
      "prompt": "How does the screen behave as the touch sensor is pressed repeatedly in the next task?",
      "choices": [
        "It always stays blue",
        "It alternates between red and off",
        "It shows the time only",
        "It displays a barcode"
      ],
      "correctIndex": 1,
      "explanation": "Slide 18 describes a red screen on one press and off on the next.",
      "hint": "Think about a switch that toggles a light."
    },
    {
      "id": "l4-telegraphmachine-09",
      "topic": "counted-presses",
      "learningSlide": 19,
      "prompt": "What happens to the buzzer after the sensor has been pressed 10 times in the final task?",
      "choices": [
        "It will not sound",
        "It becomes louder",
        "It changes to a motor",
        "It starts music"
      ],
      "correctIndex": 0,
      "explanation": "Slide 19 specifies that after 10 presses the buzzer does not ring.",
      "hint": "Think about the program's stopping condition."
    },
    {
      "id": "l4-telegraphmachine-10",
      "topic": "counted-presses",
      "learningSlide": 19,
      "prompt": "Which other output changes when the count reaches 10?",
      "choices": [
        "The screen turns red",
        "The wheels become larger",
        "The microphone records speech",
        "The sensor reads an ID"
      ],
      "correctIndex": 0,
      "explanation": "Slide 19 states that the screen turns red when the count reaches 10.",
      "hint": "The program gives a visible signal at the final count."
    }
  ]
};
