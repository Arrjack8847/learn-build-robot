/** Verified against public/Level 2/Learning/Foundational Robots/Hammer robot.pdf (22 pages); slide numbers are 1-based. */
import type { QuizBank } from "../../quizStudio";
export const hammerRobotBank: QuizBank = {
  "projectId": "level-2-hammer-robot",
  "title": "Hammer robot",
  "sourcePdfPath": "public/Level 2/Learning/Foundational Robots/Hammer robot.pdf",
  "sourcePageCount": 22,
  "questions": [
    {
      "id": "hm01",
      "topic": "hammer-purpose",
      "learningSlide": 3,
      "prompt": "What moving tool is the Hammer Robot built to operate?",
      "choices": [
        "A paintbrush",
        "A propeller",
        "A scoop",
        "A hammer"
      ],
      "correctIndex": 3,
      "explanation": "Slide 3 introduces a robot that strikes using a hammer.",
      "hint": "Which tool gives this model its name?"
    },
    {
      "id": "hm02",
      "topic": "hammer-purpose",
      "learningSlide": 3,
      "prompt": "Which action best demonstrates the Hammer Robot's purpose?",
      "choices": [
        "Swinging a hammer to strike a target",
        "Floating on water",
        "Projecting a picture",
        "Measuring air temperature"
      ],
      "correctIndex": 0,
      "explanation": "Its main task is to move a hammer for striking.",
      "hint": "Look at the action the lesson proposes."
    },
    {
      "id": "hm03",
      "topic": "bevel-gears",
      "learningSlide": 4,
      "prompt": "Which transmission is suggested to link the motor to the hammer?",
      "choices": [
        "An LED screen",
        "Bevel gears",
        "A magnifying glass",
        "A fixed pulley only"
      ],
      "correctIndex": 1,
      "explanation": "Slide 4 names the bevel gear transmission structure.",
      "hint": "Think about rotating gears that can redirect drive."
    },
    {
      "id": "hm04",
      "topic": "bevel-gears",
      "learningSlide": 4,
      "prompt": "When assembling the hammer, which connection must the designer solve first?",
      "choices": [
        "Solar panel mounting",
        "Wheel suspension geometry",
        "Motor-to-hammer transmission",
        "Speaker-to-camera wiring"
      ],
      "correctIndex": 2,
      "explanation": "The lesson first asks how to connect the motor to the hammer.",
      "hint": "Follow the exploration problem on slide 4."
    },
    {
      "id": "hm05",
      "topic": "touch-control",
      "learningSlide": 5,
      "prompt": "What component lets the student trigger the hammer with a press?",
      "choices": [
        "A barometer",
        "A camera lens",
        "A thermometer",
        "A touch sensor"
      ],
      "correctIndex": 3,
      "explanation": "Slide 5 introduces a touch sensor as the robot's control input.",
      "hint": "What can you press with a finger?"
    },
    {
      "id": "hm06",
      "topic": "touch-control",
      "learningSlide": 5,
      "prompt": "What should happen when the touch sensor is pressed in the introductory design?",
      "choices": [
        "The hammer works",
        "The motor is removed",
        "The robot's frame dissolves",
        "The controller stops existing"
      ],
      "correctIndex": 0,
      "explanation": "The exploration says pressing the touch sensor activates the hammer.",
      "hint": "Link the input to the movement."
    },
    {
      "id": "hm07",
      "topic": "press-counter",
      "learningSlide": 19,
      "prompt": "Which quantity is recorded in the first coding task?",
      "choices": [
        "The number of gears in a shop",
        "The number of touch-sensor presses",
        "The outdoor temperature",
        "The number of windows in a building"
      ],
      "correctIndex": 1,
      "explanation": "Slide 19 asks students to count touch-sensor presses.",
      "hint": "Count events created by pressing the sensor."
    },
    {
      "id": "hm08",
      "topic": "press-counter",
      "learningSlide": 19,
      "prompt": "How does the first program show the counted button presses?",
      "choices": [
        "By disconnecting the motor",
        "By altering the gear teeth",
        "Through the display module",
        "By changing wheel size"
      ],
      "correctIndex": 2,
      "explanation": "The task records presses and displays the count.",
      "hint": "Look for the output component named on slide 19."
    },
    {
      "id": "hm09",
      "topic": "conditional-actions",
      "learningSlide": 20,
      "prompt": "What does one touch-sensor press make the robot do in Task 2?",
      "choices": [
        "Turn left without moving the hammer",
        "Reverse without a hammer swing",
        "Turn off the program permanently",
        "Move forward and swing the hammer"
      ],
      "correctIndex": 3,
      "explanation": "Slide 20 assigns forward travel and a hammer swing to one press.",
      "hint": "Remember the first press behavior."
    },
    {
      "id": "hm10",
      "topic": "conditional-actions",
      "learningSlide": 21,
      "prompt": "What action is proposed for three presses in the evaluation extension?",
      "choices": [
        "Turn left and swing the hammer",
        "Turn right and swing only",
        "Switch off the display",
        "Count no further presses"
      ],
      "correctIndex": 0,
      "explanation": "Slide 21 extends the counter with a left turn and hammer swing on three presses.",
      "hint": "Compare the different actions mapped to counts."
    }
  ]
};
