import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 24-page Learning PDF. */
export const parcelSortingMachineBank: QuizBank = {
  "projectId": "level-6-parcel-sorting-machine",
  "title": "Parcel Sorting Machine",
  "sourcePdfPath": "public/Level 6/Learning/Sensor Automation/Parcel Sorting Machine/31. Parcel Sorting Machine-Teaching Slides.pdf",
  "sourcePageCount": 24,
  "questions": [
    {
      "id": "psm-01",
      "topic": "sorting-principle",
      "learningSlide": 9,
      "prompt": "What are the two main parts named in an automatic sorting system?",
      "choices": [
        "Sorter and conveyor belts",
        "Camera and rain gauge",
        "Headphones and joystick",
        "Solar panel and antenna"
      ],
      "correctIndex": 0,
      "hint": "One decides a destination and the other transports goods.",
      "explanation": "Slide 9 describes a sorter with conveyor belts."
    },
    {
      "id": "psm-02",
      "topic": "sorting-principle",
      "learningSlide": 10,
      "prompt": "What kind of sorting model is built in this lesson?",
      "choices": [
        "A QR-code password lock",
        "A colour sorter related to the baffle type",
        "A robot that tracks a ball",
        "A voice-controlled airplane"
      ],
      "correctIndex": 1,
      "hint": "The machine sends blocks to positions based on colour.",
      "explanation": "Slide 10 identifies a colour sorter of the baffle family."
    },
    {
      "id": "psm-03",
      "topic": "colour-sensor",
      "learningSlide": 12,
      "prompt": "Which sensor selects the sorter's rotation direction?",
      "choices": [
        "Thermometer",
        "Ultrasonic sensor",
        "Colour sensor",
        "Humidity sensor"
      ],
      "correctIndex": 2,
      "hint": "The machine identifies coloured blocks.",
      "explanation": "Slide 12 uses a colour sensor to control sorter direction."
    },
    {
      "id": "psm-04",
      "topic": "colour-sensor",
      "learningSlide": 17,
      "prompt": "What does colour value 5 represent in this lesson?",
      "choices": [
        "Red, meaning send to position one",
        "Green, meaning position two",
        "Blue, meaning position three",
        "Black, meaning no block is present"
      ],
      "correctIndex": 3,
      "hint": "One code indicates there is nothing to move.",
      "explanation": "Slide 17 maps 5 to black/no building block."
    },
    {
      "id": "psm-05",
      "topic": "angle-control",
      "learningSlide": 14,
      "prompt": "Why must the sorter know its initial motor position?",
      "choices": [
        "To calculate accurate rotation angles to delivery points",
        "To play louder sound effects",
        "To count QR-code digits",
        "To change the display's brightness"
      ],
      "correctIndex": 0,
      "hint": "The motor needs a consistent starting reference.",
      "explanation": "Slide 14 initializes the sorter before calculating turns."
    },
    {
      "id": "psm-06",
      "topic": "angle-control",
      "learningSlide": 17,
      "prompt": "What default angle interval separates neighbouring colour positions?",
      "choices": [
        "5 degrees",
        "30 degrees",
        "90 degrees",
        "180 degrees"
      ],
      "correctIndex": 1,
      "hint": "Each colour destination has a regular spacing.",
      "explanation": "Slide 17 uses a 30-degree interval."
    },
    {
      "id": "psm-07",
      "topic": "sorting-sequence",
      "learningSlide": 16,
      "prompt": "What two actions move the block off the sorter?",
      "choices": [
        "Flash red and green lights",
        "Start and stop a countdown",
        "Raise and lower a baffle",
        "Scan and print a password"
      ],
      "correctIndex": 2,
      "hint": "The lifting mechanism needs both movements.",
      "explanation": "Slide 16 describes lifting and lowering the baffle."
    },
    {
      "id": "psm-08",
      "topic": "sorting-sequence",
      "learningSlide": 19,
      "prompt": "Why does the program read the colour for about a second?",
      "choices": [
        "To increase the size of the building block",
        "To clear the program automatically",
        "To make all positions identical",
        "To reduce colour misjudgement"
      ],
      "correctIndex": 3,
      "hint": "A stable reading improves the sorting result.",
      "explanation": "Slide 19 reads for one second to improve colour accuracy."
    },
    {
      "id": "psm-09",
      "topic": "optimization",
      "learningSlide": 23,
      "prompt": "What should students change in the optimization task?",
      "choices": [
        "Increase the spacing between colour positions",
        "Remove the colour sensor",
        "Make all delivery positions overlap",
        "Reverse the camera image"
      ],
      "correctIndex": 0,
      "hint": "A wider delivery range needs larger motor turns.",
      "explanation": "Slide 23 asks for greater angular spacing."
    },
    {
      "id": "psm-10",
      "topic": "optimization",
      "learningSlide": 23,
      "prompt": "What motor behaviour supports the enlarged colour spacing?",
      "choices": [
        "Stop after every tiny vibration",
        "Rotate through more degrees",
        "Ignore the starting angle",
        "Use no destination calculation"
      ],
      "correctIndex": 1,
      "hint": "Positions further apart require larger turns.",
      "explanation": "Slide 23 specifies more motor rotation degrees."
    }
  ]
};
