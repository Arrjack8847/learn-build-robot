import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 25-page Learning PDF. */
export const digitalCountdownBank: QuizBank = {
  "projectId": "level-6-digital-countdown",
  "title": "Digital Countdown",
  "sourcePdfPath": "public/Level 6/Learning/Display & Movement/Digital Countdown/07.Digital Countdown-Teaching Slides.pdf",
  "sourcePageCount": 25,
  "questions": [
    {
      "id": "dc-01",
      "topic": "countdown-purpose",
      "learningSlide": 10,
      "prompt": "Which everyday activity does the lesson mention as needing countdowns?",
      "choices": [
        "Cooking",
        "Measuring a rainbow",
        "Finding a QR password",
        "Painting a motor"
      ],
      "correctIndex": 0,
      "hint": "Countdowns help manage time in ordinary activities.",
      "explanation": "Slide 10 cites cooking, road crossing and train arrivals."
    },
    {
      "id": "dc-02",
      "topic": "countdown-purpose",
      "learningSlide": 11,
      "prompt": "What does the dot matrix clear-screen block do?",
      "choices": [
        "Start both motors at full speed",
        "Turn off all the display lights",
        "Measure the air pressure",
        "Display every pattern at once"
      ],
      "correctIndex": 1,
      "hint": "It removes the current display output.",
      "explanation": "Slide 11 says the clear block switches off all matrix lights."
    },
    {
      "id": "dc-03",
      "topic": "display-maths",
      "learningSlide": 16,
      "prompt": "How is the ones digit of a countdown number calculated?",
      "choices": [
        "The whole number multiplied by 10",
        "The page count divided by 2",
        "The remainder after dividing by 10",
        "The motor port number plus 1"
      ],
      "correctIndex": 2,
      "hint": "For 29, the ones digit is 9.",
      "explanation": "Slide 16 uses countdown modulo 10 for the ones digit."
    },
    {
      "id": "dc-04",
      "topic": "display-maths",
      "learningSlide": 16,
      "prompt": "How is the tens digit calculated?",
      "choices": [
        "Take the remainder of division by 1000",
        "Add the ones digit to 10",
        "Subtract 100 from every value",
        "Round down the number divided by 10"
      ],
      "correctIndex": 3,
      "hint": "For 29, the tens digit is 2.",
      "explanation": "Slide 16 uses floor(countdown / 10)."
    },
    {
      "id": "dc-05",
      "topic": "starting-countdown",
      "learningSlide": 17,
      "prompt": "What action starts the countdown in the lesson's program?",
      "choices": [
        "Pressing the button",
        "Unplugging the dot matrix",
        "Displaying a random colour",
        "Scanning a QR payment code"
      ],
      "correctIndex": 0,
      "hint": "A start condition avoids beginning too early.",
      "explanation": "Slide 17 checks the button before starting timing."
    },
    {
      "id": "dc-06",
      "topic": "starting-countdown",
      "learningSlide": 17,
      "prompt": "Why does the program use absolute value and rounding down?",
      "choices": [
        "To make the screen physically larger",
        "To avoid invalid negative and fractional countdown inputs",
        "To increase motor torque",
        "To erase the program's functions"
      ],
      "correctIndex": 1,
      "hint": "Countdown displays should represent whole nonnegative seconds.",
      "explanation": "Slide 17 converts the selected time into a valid nonnegative integer."
    },
    {
      "id": "dc-07",
      "topic": "beep-and-timing",
      "learningSlide": 18,
      "prompt": "How frequently does the beep function sound in the lesson?",
      "choices": [
        "Once a week",
        "Every ten minutes",
        "Every half second",
        "Every hundred seconds"
      ],
      "correctIndex": 2,
      "hint": "The beep is faster than the one-second countdown step.",
      "explanation": "Slide 18 defines a half-second beep."
    },
    {
      "id": "dc-08",
      "topic": "beep-and-timing",
      "learningSlide": 19,
      "prompt": "How does the countdown value change as time passes?",
      "choices": [
        "It doubles every second",
        "It stays frozen at its starting value",
        "It increases until 9999",
        "It decreases by one every second until zero"
      ],
      "correctIndex": 3,
      "hint": "The display follows the remaining whole seconds.",
      "explanation": "Slide 19 decrements the countdown once per second."
    },
    {
      "id": "dc-09",
      "topic": "display-limits",
      "learningSlide": 23,
      "prompt": "What maximum countdown is required in the optimization task?",
      "choices": [
        "99",
        "999",
        "240",
        "360"
      ],
      "correctIndex": 0,
      "hint": "The display is intended to show at most two digits.",
      "explanation": "Slide 23 limits the displayed countdown to 99."
    },
    {
      "id": "dc-10",
      "topic": "display-limits",
      "learningSlide": 23,
      "prompt": "Why should the program limit the countdown's maximum?",
      "choices": [
        "To disconnect the timer",
        "To prevent display bugs from values too large for the screen",
        "To stop people setting any countdown",
        "To replace the dot matrix with a camera"
      ],
      "correctIndex": 1,
      "hint": "The maximum must match the available display format.",
      "explanation": "Slide 23 gives avoiding display bugs as the purpose of the 99 limit."
    }
  ]
};
