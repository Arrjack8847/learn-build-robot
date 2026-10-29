/** Level 4 — Password box. Questions checked against the 19-page Learning PDF text; diagram-independent, Acceleration Car difficulty. */
import type { QuizBank } from "../../quizStudio";

export const passwordBoxBank: QuizBank = {
  "projectId": "level-4-password-box",
  "title": "Password box",
  "sourcePdfPath": "public/Level 4/Sensor Automation/Password box/06.Password box-update.pdf",
  "sourcePageCount": 19,
  "questions": [
    {
      "id": "l4-passwordbox-01",
      "topic": "safe-purpose",
      "learningSlide": 6,
      "prompt": "Why do people use a safe deposit box?",
      "choices": [
        "To keep valuable items secure",
        "To make music louder",
        "To paint buildings",
        "To measure road speed"
      ],
      "correctIndex": 0,
      "explanation": "Slide 6 describes safe deposit boxes as places where customers can keep valuables.",
      "hint": "Think about objects people want to protect."
    },
    {
      "id": "l4-passwordbox-02",
      "topic": "safe-purpose",
      "learningSlide": 10,
      "prompt": "Which item might someone store in a safe?",
      "choices": [
        "A bicycle lane",
        "Important household belongings",
        "A school bell's sound",
        "Sunlight"
      ],
      "correctIndex": 1,
      "explanation": "Slide 10 names important household belongings and valuable goods as uses for a safe.",
      "hint": "Consider something that should be kept secure."
    },
    {
      "id": "l4-passwordbox-03",
      "topic": "color-sensing",
      "learningSlide": 2,
      "prompt": "Which sensor does the Password Box lesson focus on?",
      "choices": [
        "Ultrasonic sensor",
        "Light sensor",
        "Color sensor",
        "Sound sensor"
      ],
      "correctIndex": 2,
      "explanation": "Slide 2 says the lesson introduces color sensors and how to use them.",
      "hint": "Think about how a robot can recognize a chosen color."
    },
    {
      "id": "l4-passwordbox-04",
      "topic": "color-sensing",
      "learningSlide": 7,
      "prompt": "What does the lesson combine with the idea of a safe?",
      "choices": [
        "A color sensor and a password door",
        "A fan and a temperature chart",
        "A compass and a map",
        "A camera and a music player"
      ],
      "correctIndex": 0,
      "explanation": "Slide 7 describes using a color sensor to design a password function for a door.",
      "hint": "Think about the new sensor the class is learning."
    },
    {
      "id": "l4-passwordbox-05",
      "topic": "combination-lock",
      "learningSlide": 11,
      "prompt": "In the example combination lock, what does one wheel represent?",
      "choices": [
        "One minute",
        "One password digit",
        "One motor",
        "One sensor"
      ],
      "correctIndex": 1,
      "explanation": "Slide 11 says one wheel represents one cipher digit.",
      "hint": "Think about how the lock remembers a multi-digit code."
    },
    {
      "id": "l4-passwordbox-06",
      "topic": "combination-lock",
      "learningSlide": 11,
      "prompt": "What happens to the wheel notches when the correct password is dialed?",
      "choices": [
        "They line up",
        "They disappear",
        "They change color",
        "They become larger"
      ],
      "correctIndex": 0,
      "explanation": "Slide 11 explains that the notches align when the correct combination is entered.",
      "hint": "Imagine a lock whose parts must reach matching positions."
    },
    {
      "id": "l4-passwordbox-07",
      "topic": "assembly-rules",
      "learningSlide": 13,
      "prompt": "Which is one assembly requirement for the Password Box?",
      "choices": [
        "A loose frame",
        "A stable structure",
        "No moving parts",
        "A completely round box"
      ],
      "correctIndex": 1,
      "explanation": "Slide 13 lists a stable structure among the build requirements.",
      "hint": "The finished model needs to work without falling apart."
    },
    {
      "id": "l4-passwordbox-08",
      "topic": "assembly-rules",
      "learningSlide": 13,
      "prompt": "What should the finished box's shape match?",
      "choices": [
        "The intended design",
        "The size of the classroom",
        "The teacher's computer",
        "The sound of the motor"
      ],
      "correctIndex": 0,
      "explanation": "Slide 13 requires that the assembled shape match the plan.",
      "hint": "Compare the build with the model you designed."
    },
    {
      "id": "l4-passwordbox-09",
      "topic": "program-display",
      "learningSlide": 15,
      "prompt": "Which two programming ideas are shown in the Password Box lesson?",
      "choices": [
        "Camera filters and music",
        "Variables and logical relationships",
        "Road maps and traffic lights",
        "Battery chemistry and heat"
      ],
      "correctIndex": 1,
      "explanation": "Slide 15 labels defining variables and logical relationships.",
      "hint": "Programs may need to remember information and make decisions."
    },
    {
      "id": "l4-passwordbox-10",
      "topic": "program-display",
      "learningSlide": 16,
      "prompt": "What should the Password Box show on the screen when tested?",
      "choices": [
        "The rotation and time needed to unlock",
        "The city's weather",
        "The robot's paint color",
        "A list of nearby shops"
      ],
      "correctIndex": 0,
      "explanation": "Slide 16 asks the program to display rotation and unlocking time.",
      "hint": "Think about which measurements help check the lock."
    }
  ]
};
