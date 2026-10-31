/** Level 4 Learning PDF text checked page by page; no unreviewed diagrams assumed. */
import type { QuizBank } from "../../quizStudio";

export const guideDogsBank: QuizBank = {
  "projectId": "level-4-guide-dogs",
  "title": "Guide Dogs",
  "sourcePdfPath": "public/Level 4/Autonomous Navigation & Ranging/Guide Dogs/10. Guide Dogs - Slides.pdf",
  "sourcePageCount": 24,
  "questions": [
    {
      "id": "l4-gd-01",
      "topic": "guide-dog-purpose",
      "learningSlide": 5,
      "prompt": "Who are trained guide dogs described as helping?",
      "choices": [
        "People with visual impairments",
        "Traffic lights",
        "Unmanned aircraft",
        "The motors inside robots"
      ],
      "correctIndex": 0,
      "explanation": "Slide 5 says trained guide dogs help blind people travel safely.",
      "hint": "Consider whom a guide dog leads through a street."
    },
    {
      "id": "l4-gd-02",
      "topic": "guide-dog-purpose",
      "learningSlide": 5,
      "prompt": "What might a trained guide dog do when an obstacle requires a turn?",
      "choices": [
        "Speed up without warning",
        "Ignore the obstacle",
        "Guide its owner to stop",
        "Turn off every nearby light"
      ],
      "correctIndex": 2,
      "explanation": "Slide 5 describes guiding the owner to stop in potentially dangerous conditions.",
      "hint": "How can stopping prevent an accident?"
    },
    {
      "id": "l4-gd-03",
      "topic": "robot-components",
      "learningSlide": 10,
      "prompt": "Which sensor measures distance in the lesson's guide-dog robot?",
      "choices": [
        "Pressure sensor",
        "Ultrasonic sensor",
        "Color sensor",
        "Temperature sensor"
      ],
      "correctIndex": 1,
      "explanation": "Slide 10 identifies an ultrasonic sensor for measuring distance.",
      "hint": "It detects how far obstacles are from the robot."
    },
    {
      "id": "l4-gd-04",
      "topic": "robot-components",
      "learningSlide": 10,
      "prompt": "What turns the robot's head during distance checking?",
      "choices": [
        "A lamp switch",
        "A hand crank",
        "A microphone",
        "A medium motor"
      ],
      "correctIndex": 3,
      "explanation": "Slide 10 labels the medium motor as driving the rotating head.",
      "hint": "Look for the motor named beside the head."
    },
    {
      "id": "l4-gd-05",
      "topic": "movement-cycle",
      "learningSlide": 11,
      "prompt": "What does the guide-dog program do when it recognizes an obstacle?",
      "choices": [
        "Turn",
        "Measure air pressure",
        "Play a melody continuously",
        "Change to an unrelated project"
      ],
      "correctIndex": 0,
      "explanation": "Slide 11 shows straight movement followed by turning at obstacles.",
      "hint": "What is a safe alternative to moving straight into an object?"
    },
    {
      "id": "l4-gd-06",
      "topic": "movement-cycle",
      "learningSlide": 11,
      "prompt": "What happens after a turn in the basic flowchart?",
      "choices": [
        "The program permanently shuts down",
        "The controller is replaced",
        "The move-and-check cycle repeats",
        "The sensor is disconnected"
      ],
      "correctIndex": 2,
      "explanation": "Slide 11 explicitly repeats the go-straight and turn cycle.",
      "hint": "What does a loop do after an action?"
    },
    {
      "id": "l4-gd-07",
      "topic": "decision-operators",
      "learningSlide": 16,
      "prompt": "What can the operator module return after checking a comparison?",
      "choices": [
        "A picture of the map",
        "A true or false result",
        "A new physical motor",
        "A measured temperature"
      ],
      "correctIndex": 1,
      "explanation": "Slide 16 describes comparisons that return a yes/no judgement.",
      "hint": "The operator decides whether a condition is met."
    },
    {
      "id": "l4-gd-08",
      "topic": "decision-operators",
      "learningSlide": 16,
      "prompt": "Which comparison is supported by the operator module?",
      "choices": [
        "Only changing lamp colors",
        "Only sending a sound",
        "Only starting a timer",
        "Checking whether one value is greater than another"
      ],
      "correctIndex": 3,
      "explanation": "Slide 16 lists greater-than, less-than and equality comparisons.",
      "hint": "A distance comparison needs to decide which number is bigger."
    },
    {
      "id": "l4-gd-09",
      "topic": "path-improvement",
      "learningSlide": 18,
      "prompt": "Which improvement does the optimization activity ask students to design?",
      "choices": [
        "Compare left-side and right-side distances",
        "Remove the distance sensor",
        "Always choose the same turn",
        "Move without checking the surroundings"
      ],
      "correctIndex": 0,
      "explanation": "Slide 18 asks how to compare the distances to the two sides.",
      "hint": "What would make choosing the safer turn smarter?"
    },
    {
      "id": "l4-gd-10",
      "topic": "path-improvement",
      "learningSlide": 18,
      "prompt": "Which movement parameter does the improvement task ask students to consider for the robot head?",
      "choices": [
        "Wheel color",
        "Buzzer pitch",
        "Middle motor rotation angle",
        "Battery brand"
      ],
      "correctIndex": 2,
      "explanation": "Slide 18 explicitly asks about the middle motor's suitable turning angle.",
      "hint": "Turning the head lets it inspect different directions."
    }
  ]
};
