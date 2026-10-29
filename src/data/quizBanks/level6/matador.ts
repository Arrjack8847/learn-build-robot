/** Question facts and 1-based slide references reviewed against the official 20-page Level 6 Learning PDF text. */
import type { QuizBank } from "../../quizStudio";

export const matadorBank: QuizBank = {
  "projectId": "level-6-matador",
  "title": "Matador",
  "sourcePdfPath": "public/Level 6/Learning/Biomimicry & Stimulus Response/Matador/02.Matador-update.pdf",
  "sourcePageCount": 20,
  "questions": [
    {
      "id": "matador-01",
      "learningSlide": 9,
      "topic": "color-detection",
      "prompt": "How does the color sensor recognize a colour according to the lesson?",
      "choices": [
        "It compares the observed colour with a reference colour",
        "It counts motor rotations",
        "It measures barometric pressure",
        "It only reads the controller clock"
      ],
      "correctIndex": 0,
      "hint": "The lesson describes a comparison rather than a physical-contact measurement.",
      "explanation": "Slide 9 says the sensor compares an object's colour with a reference and outputs a result when they match within an error range."
    },
    {
      "id": "matador-02",
      "learningSlide": 9,
      "topic": "color-detection",
      "prompt": "Why should the object's distance from the colour sensor be considered?",
      "choices": [
        "The distance changes arithmetic precedence",
        "The sensor can detect colours accurately only within a suitable range",
        "Every distance creates the same result",
        "The sensor measures distance instead of colour"
      ],
      "correctIndex": 1,
      "hint": "The lesson notes that the sensor works more reliably under appropriate measurement conditions.",
      "explanation": "Slide 9 says that keeping objects within the appropriate detection distance improves colour recognition."
    },
    {
      "id": "matador-03",
      "learningSlide": 10,
      "topic": "order-of-operations",
      "prompt": "Which part of an arithmetic expression should be evaluated first when parentheses are present?",
      "choices": [
        "The last term regardless of brackets",
        "An addition outside the brackets",
        "The expression inside the parentheses",
        "The leftmost variable name"
      ],
      "correctIndex": 2,
      "hint": "Grouping symbols can change the order of calculations.",
      "explanation": "Slide 10 explains that calculations inside parentheses are performed before operations outside them."
    },
    {
      "id": "matador-04",
      "learningSlide": 10,
      "topic": "order-of-operations",
      "prompt": "For operations at the same precedence level, which calculation order does the lesson give?",
      "choices": [
        "Right to left",
        "Largest result first",
        "Alphabetical variable order",
        "Left to right"
      ],
      "correctIndex": 3,
      "hint": "Consider the rule when neither operation has higher priority.",
      "explanation": "Slide 10 states that operations at the same level are calculated successively from left to right."
    },
    {
      "id": "matador-05",
      "learningSlide": 16,
      "topic": "variable-addition-subtraction",
      "prompt": "If the program sets x = 3, what value does the lesson's x + 1 expression display?",
      "choices": [
        "3",
        "4",
        "5",
        "6"
      ],
      "correctIndex": 1,
      "hint": "Substitute the stored number into the expression.",
      "explanation": "Slide 16 sets x to 3 and displays x+1; this equals 4."
    },
    {
      "id": "matador-06",
      "learningSlide": 16,
      "topic": "variable-addition-subtraction",
      "prompt": "If y = 5, what does the lesson's y − 3 expression display?",
      "choices": [
        "2",
        "3",
        "5",
        "8"
      ],
      "correctIndex": 0,
      "hint": "Evaluate the subtraction using the variable's current value.",
      "explanation": "Slide 16 sets y to 5 and displays y−3, giving 2."
    },
    {
      "id": "matador-07",
      "learningSlide": 16,
      "topic": "variable-multiplication",
      "prompt": "With x = 3 and y = 5, what value does x × y produce?",
      "choices": [
        "8",
        "12",
        "18",
        "15"
      ],
      "correctIndex": 3,
      "hint": "Both named values are multiplied in the displayed expression.",
      "explanation": "Slide 16 gives x=3 and y=5; the product x*y is 15."
    },
    {
      "id": "matador-08",
      "learningSlide": 16,
      "topic": "variable-multiplication",
      "prompt": "Which three expressions are displayed on separate rows in the lesson's initial variable exercise?",
      "choices": [
        "x−y, x÷y, x²",
        "x+y, x−y, x÷y",
        "x+1, y−3, x*y",
        "x², y², x+y"
      ],
      "correctIndex": 2,
      "hint": "The example includes an addition, a subtraction and a multiplication.",
      "explanation": "Slide 16 explicitly displays x+1, y−3 and x*y in rows 1, 2 and 3."
    },
    {
      "id": "matador-09",
      "learningSlide": 13,
      "topic": "assembly-and-response",
      "prompt": "Which condition is listed as an assembly requirement for the Matador robot?",
      "choices": [
        "A stable structure",
        "No mechanical support",
        "No controller",
        "All pieces disconnected"
      ],
      "correctIndex": 0,
      "hint": "The robot needs to hold together as it responds to inputs.",
      "explanation": "Slide 13 lists stable structure as an assembly requirement."
    },
    {
      "id": "matador-10",
      "learningSlide": 17,
      "topic": "assembly-and-response",
      "prompt": "How does the Matador programming task make its reactions more challenging?",
      "choices": [
        "By ignoring every sensor reading",
        "By using variable calculations when different colours are detected",
        "By disabling colour detection",
        "By showing only the robot's name"
      ],
      "correctIndex": 1,
      "hint": "The lesson combines sensor detection with arithmetic rules.",
      "explanation": "Slide 17 says the robot uses calculations with variables when different colours are detected to make Matador more difficult."
    }
  ]
};
