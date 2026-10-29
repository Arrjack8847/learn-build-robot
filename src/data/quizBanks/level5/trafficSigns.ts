/** Questions checked against the official 20-page Level 5 Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const trafficSignsBank: QuizBank = {
  "projectId": "level-5-traffic-signs",
  "title": "Traffic Signs",
  "sourcePdfPath": "public/Level 5/Learning/Programming & Precise Control/Traffic signs/05.traffic signs.pdf",
  "sourcePageCount": 20,
  "questions": [
    {
      "id": "level-5-traffic-signs-01",
      "topic": "traffic-sign-role",
      "learningSlide": 3,
      "prompt": "What kinds of information can road traffic signs communicate?",
      "choices": [
        "Guidance, restrictions, warnings and instructions",
        "Only the time of a soccer match",
        "Only motor temperature",
        "Only the Earth's magnetic field direction"
      ],
      "correctIndex": 0,
      "hint": "Road signs help people drive safely.",
      "explanation": "Slide 3 defines traffic signs as communicating guidance, restriction, warning or instruction information."
    },
    {
      "id": "level-5-traffic-signs-02",
      "topic": "traffic-sign-role",
      "learningSlide": 4,
      "prompt": "Why does the lesson use traffic sign recognition in a robot activity?",
      "choices": [
        "To model understanding signs that help drivers travel safely",
        "To teach a robot to dry clothes",
        "To show how to count passing customers",
        "To measure laser reflection time"
      ],
      "correctIndex": 0,
      "hint": "The signs guide road movement decisions.",
      "explanation": "Slide 4 links the robot's traffic sign recognition to safe driving."
    },
    {
      "id": "level-5-traffic-signs-03",
      "topic": "sign-id-codes",
      "learningSlide": 6,
      "prompt": "How many built-in traffic sign categories can the AI module recognize in the lesson?",
      "choices": [
        "5",
        "2",
        "10",
        "50"
      ],
      "correctIndex": 0,
      "hint": "The slide lists ID values from 1 through 5.",
      "explanation": "Slide 6 says five built-in signs map to IDs 1, 2, 3, 4 and 5."
    },
    {
      "id": "level-5-traffic-signs-04",
      "topic": "sign-id-codes",
      "learningSlide": 7,
      "prompt": "What traffic sign is associated with recognized ID value 3?",
      "choices": [
        "Turn Left",
        "Forward",
        "Stop",
        "Backward"
      ],
      "correctIndex": 0,
      "hint": "The slide orders signs forward, backward, left, right, stop.",
      "explanation": "Slide 7 assigns ID 3 to 'Turn Left'."
    },
    {
      "id": "level-5-traffic-signs-05",
      "topic": "hardware-configuration",
      "learningSlide": 10,
      "prompt": "Which ports control the left and right drive motors in this traffic-sign robot?",
      "choices": [
        "M1 and M2",
        "P1 and P2",
        "P8 and P9",
        "USB1 and USB2"
      ],
      "correctIndex": 0,
      "hint": "They are labeled motor ports.",
      "explanation": "Slide 10 connects the two motors to M1 and M2."
    },
    {
      "id": "level-5-traffic-signs-06",
      "topic": "hardware-configuration",
      "learningSlide": 10,
      "prompt": "Where should the AI audiovisual module be installed on the robot?",
      "choices": [
        "On top of the model",
        "Under the classroom floor",
        "Inside a sealed clothes drum",
        "Under the rear tire"
      ],
      "correctIndex": 0,
      "hint": "The camera must have a view of the signs.",
      "explanation": "Slide 10 explicitly requires mounting the AI module on top of the traffic sign robot."
    },
    {
      "id": "level-5-traffic-signs-07",
      "topic": "straight-driving",
      "learningSlide": 14,
      "prompt": "If the forward sign (ID 1) is recognized, what do the motors do?",
      "choices": [
        "Both drive at speed 50 for 0.5 seconds, then stop",
        "Both drive at speed -50 for an hour",
        "The motor reverses every 2 seconds indefinitely",
        "Only the buzzer activates"
      ],
      "correctIndex": 0,
      "hint": "Both wheels move in the same forward direction.",
      "explanation": "Slide 14 sets both motor speeds to 50 and stops after 0.5 seconds for the forward sign."
    },
    {
      "id": "level-5-traffic-signs-08",
      "topic": "straight-driving",
      "learningSlide": 15,
      "prompt": "What motor speed does the example use to move backward for sign ID 2?",
      "choices": [
        "-50 on both motors",
        "50 on only the left motor",
        "0 on both motors for a full minute",
        "2000 on both motors"
      ],
      "correctIndex": 0,
      "hint": "Negative speed indicates reversing.",
      "explanation": "Slide 15 sets both motors to -50 for the backward sign."
    },
    {
      "id": "level-5-traffic-signs-09",
      "topic": "turning-and-stopping",
      "learningSlide": 16,
      "prompt": "How should the robot respond to recognized left-turn and right-turn signs?",
      "choices": [
        "Turn in the corresponding direction",
        "Ignore both signs and move forward",
        "Increase humidity readings",
        "Always perform the same clockwise spin"
      ],
      "correctIndex": 0,
      "hint": "Each turn sign maps to its intended turn.",
      "explanation": "Slide 16 tells the robot to turn left or right according to the recognized sign."
    },
    {
      "id": "level-5-traffic-signs-10",
      "topic": "turning-and-stopping",
      "learningSlide": 17,
      "prompt": "What happens when the AI module recognizes the Stop sign?",
      "choices": [
        "The robot stops and the buzzer sounds for one second",
        "It accelerates for 10 seconds",
        "It erases its sign definitions",
        "It displays a magnetic field reading"
      ],
      "correctIndex": 0,
      "hint": "The lesson combines a stop with an audible alert.",
      "explanation": "Slide 17 specifies stopping the robot and sounding the buzzer for one second."
    }
  ]
};
