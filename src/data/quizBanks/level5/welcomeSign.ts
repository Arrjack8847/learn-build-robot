/** Source-reviewed against the official 25-page Level 5 Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const welcomeSignBank: QuizBank = {
  "projectId": "level-5-welcome-sign",
  "title": "Welcome Sign",
  "sourcePdfPath": "public/Level 5/Learning/Display & Movement/Welcome Sign/08. Welcome Sign-Teaching Slides.pdf",
  "sourcePageCount": 25,
  "questions": [
    {
      "id": "level-5-welcome-sign-01",
      "topic": "sign-purpose",
      "learningSlide": 4,
      "prompt": "Why do shops display signs and advertising near their entrances?",
      "choices": [
        "To communicate information to passing customers",
        "To measure passing cars' speed",
        "To block all customers from entering",
        "To find underground magnetic minerals"
      ],
      "correctIndex": 0,
      "hint": "Think about what the passerby learns from the sign.",
      "explanation": "Slide 4 says signs and advertisements help communicate messages to consumers who pass a shop."
    },
    {
      "id": "level-5-welcome-sign-02",
      "topic": "sign-purpose",
      "learningSlide": 6,
      "prompt": "What can an eye-catching sign help a store do?",
      "choices": [
        "Become memorable and attract new customers",
        "Calculate Earth's rotation",
        "Prevent people from reading the shop name",
        "Replace every product in the store"
      ],
      "correctIndex": 0,
      "hint": "Good signs help with recognition and promotion.",
      "explanation": "Slide 6 discusses sign design as part of the store image, helping customers remember and attracting visitors."
    },
    {
      "id": "level-5-welcome-sign-03",
      "topic": "matrix-display",
      "learningSlide": 11,
      "prompt": "Which directions are supported by the dot-matrix moving-string feature?",
      "choices": [
        "Left, right, up and down",
        "Only clockwise and counterclockwise",
        "North and south magnetic poles only",
        "Forward and backward wheel motion only"
      ],
      "correctIndex": 0,
      "hint": "Text can move horizontally or vertically.",
      "explanation": "Slide 11 lists four string movement directions: left, right, up and down."
    },
    {
      "id": "level-5-welcome-sign-04",
      "topic": "matrix-display",
      "learningSlide": 11,
      "prompt": "What is the specified dot-matrix brightness setting range?",
      "choices": [
        "0 to 15",
        "0 to 2",
        "100 to 200",
        "-50 to -1"
      ],
      "correctIndex": 0,
      "hint": "The slide calls these 16 controllable levels.",
      "explanation": "Slide 11 gives 16 brightness levels, encoded from 0 to 15."
    },
    {
      "id": "level-5-welcome-sign-05",
      "topic": "visitor-sensing",
      "learningSlide": 13,
      "prompt": "What sensor makes the classroom welcome sign respond to an approaching object?",
      "choices": [
        "Ultrasonic sensor",
        "Magnetic pole sensor",
        "Barometric sensor",
        "Color sensor only"
      ],
      "correctIndex": 0,
      "hint": "The sensor measures objects at a distance.",
      "explanation": "Slide 13 identifies an ultrasonic sensor that triggers the dot-matrix welcome display."
    },
    {
      "id": "level-5-welcome-sign-06",
      "topic": "visitor-sensing",
      "learningSlide": 14,
      "prompt": "What happens after the moving detection head senses someone passing?",
      "choices": [
        "The dot-matrix screen shows a welcome message",
        "The sensor starts measuring Moon distance",
        "The car changes its gear ratio",
        "The sign erases every display function"
      ],
      "correctIndex": 0,
      "hint": "The program should greet the visitor.",
      "explanation": "Slide 14 explains that detecting an object triggers a welcome slogan on the screen."
    },
    {
      "id": "level-5-welcome-sign-07",
      "topic": "direction-switching",
      "learningSlide": 15,
      "prompt": "Which values are acceptable initial motor-direction states in the lesson?",
      "choices": [
        "1 or -1, but not 0",
        "Only 0",
        "Any number greater than 100",
        "Only 3.6"
      ],
      "correctIndex": 0,
      "hint": "The direction variable uses positive and negative signs.",
      "explanation": "Slide 15 permits an initial direction of -1 or 1, but not zero."
    },
    {
      "id": "level-5-welcome-sign-08",
      "topic": "direction-switching",
      "learningSlide": 18,
      "prompt": "How does the program reverse the detection head's motor direction periodically?",
      "choices": [
        "Multiply the direction variable by -1",
        "Multiply the direction by 0 every time",
        "Always set the direction to 1",
        "Increase humidity readings by 2"
      ],
      "correctIndex": 0,
      "hint": "Changing the sign reverses the value.",
      "explanation": "Slide 18 alternates direction values 1, -1, 1, -1 by multiplying by -1."
    },
    {
      "id": "level-5-welcome-sign-09",
      "topic": "display-and-extension",
      "learningSlide": 17,
      "prompt": "What should the moving welcome-text display do after its final display function?",
      "choices": [
        "Clear the screen",
        "Remove the ultrasonic sensor",
        "Unplug both dot matrices",
        "Store the car speed as a password"
      ],
      "correctIndex": 0,
      "hint": "Old displayed text should not remain indefinitely.",
      "explanation": "Slide 17 notes that the last moving-display function must include screen-clearing code."
    },
    {
      "id": "level-5-welcome-sign-10",
      "topic": "display-and-extension",
      "learningSlide": 23,
      "prompt": "Which feature does the optimization task suggest adding to the welcome sign?",
      "choices": [
        "A prompt sound while text is displayed",
        "A second laser speed sensor for highways",
        "A magnetic theft alarm for jewelry",
        "An automatic gate that blocks visitors"
      ],
      "correctIndex": 0,
      "hint": "The extension adds an audio greeting.",
      "explanation": "Slide 23 asks for a sound prompt when the dot-matrix screen displays text."
    }
  ]
};
