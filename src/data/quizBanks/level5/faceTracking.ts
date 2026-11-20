/** Source-reviewed against the official 22-page Level 5 Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const faceTrackingBank: QuizBank = {
  "projectId": "level-5-face-tracking",
  "title": "Face Tracking",
  "sourcePdfPath": "public/Level 5/Learning/Automation & Security/Face tracking/07. Face tracking.pdf",
  "sourcePageCount": 22,
  "questions": [
    {
      "id": "level-5-face-tracking-01",
      "topic": "face-coordinates",
      "learningSlide": 6,
      "prompt": "Which values does the AI audiovisual module send back to describe a detected face's position?",
      "choices": [
        "X and Y coordinates",
        "Humidity and air pressure",
        "Only a sound frequency",
        "Wheel radius and gear teeth"
      ],
      "correctIndex": 0,
      "hint": "A camera locates objects in two dimensions.",
      "explanation": "Slide 6 says the face-detection module returns face-position X and Y coordinates to the controller."
    },
    {
      "id": "level-5-face-tracking-02",
      "topic": "face-coordinates",
      "learningSlide": 7,
      "prompt": "Where is the origin (0, 0) of the lesson's camera coordinate system?",
      "choices": [
        "At the robot's left wheel",
        "Upper-left corner of the image",
        "Bottom-right corner",
        "Exact center of the image"
      ],
      "correctIndex": 1,
      "hint": "The slide draws axes from a corner.",
      "explanation": "Slide 7 identifies the upper-left corner of the camera screen as coordinate (0, 0)."
    },
    {
      "id": "level-5-face-tracking-03",
      "topic": "camera-detection",
      "learningSlide": 8,
      "prompt": "What appears around a face detected by the module in face detection mode?",
      "choices": [
        "A magnetic field indicator",
        "An ultrasonic distance graph",
        "A green rectangle around the face",
        "A red horizontal speedometer"
      ],
      "correctIndex": 2,
      "hint": "The display marks the tracked area.",
      "explanation": "Slide 8 describes a green box around the recognized face."
    },
    {
      "id": "level-5-face-tracking-04",
      "topic": "camera-detection",
      "learningSlide": 8,
      "prompt": "What point in the displayed face box is represented by the returned X and Y coordinates?",
      "choices": [
        "Only its bottom-right corner",
        "A fixed controller button",
        "The robot's front motor",
        "The center point of the face box"
      ],
      "correctIndex": 3,
      "hint": "The box contains a point used for position.",
      "explanation": "Slide 8 says the X–Y coordinates represent the center point inside the detected face box."
    },
    {
      "id": "level-5-face-tracking-05",
      "topic": "hardware-and-setup",
      "learningSlide": 11,
      "prompt": "To which ports are the face-tracking robot's two motors connected?",
      "choices": [
        "M1 and M2",
        "P7 and P8",
        "M5 and M6",
        "P1 and P2"
      ],
      "correctIndex": 0,
      "hint": "The motor ports have M labels.",
      "explanation": "Slide 11 assigns the two motors to M1 and M2."
    },
    {
      "id": "level-5-face-tracking-06",
      "topic": "hardware-and-setup",
      "learningSlide": 11,
      "prompt": "Where does the AI audiovisual module connect on the controller?",
      "choices": [
        "USB-C only",
        "P8",
        "M1",
        "M2"
      ],
      "correctIndex": 1,
      "hint": "The camera uses a P-number port, not a motor port.",
      "explanation": "Slide 11 specifies the AI module connection to P8."
    },
    {
      "id": "level-5-face-tracking-07",
      "topic": "steering-logic",
      "learningSlide": 17,
      "prompt": "What should both motors do when X is 0 in the lesson's face-tracking program?",
      "choices": [
        "Rotate only clockwise",
        "Play a sound while ignoring the face",
        "Stop because no face is detected",
        "Run at maximum speed"
      ],
      "correctIndex": 2,
      "hint": "X = 0 is the no-face condition.",
      "explanation": "Slide 17 interprets X = 0 as no face and stops M1 and M2."
    },
    {
      "id": "level-5-face-tracking-08",
      "topic": "steering-logic",
      "learningSlide": 18,
      "prompt": "The program sets turn = X - 150. What is turn when a face is detected at X = 120?",
      "choices": [
        "0",
        "30",
        "270",
        "-30"
      ],
      "correctIndex": 3,
      "hint": "Subtract the center coordinate from X.",
      "explanation": "Slide 18 explicitly calculates turn = 120 - 150 = -30."
    },
    {
      "id": "level-5-face-tracking-09",
      "topic": "proportional-control",
      "learningSlide": 18,
      "prompt": "If a face is centered at X = 150, what happens to turn and the motors?",
      "choices": [
        "Turn becomes 0 and the motors stop",
        "Turn becomes 150 and motors accelerate",
        "Turn becomes -150 and one motor always reverses",
        "The sensor is automatically unplugged"
      ],
      "correctIndex": 0,
      "hint": "Centered means no left/right correction is needed.",
      "explanation": "Slide 18 states that X = 150 produces turn = 0, so the robot faces forward without rotating."
    },
    {
      "id": "level-5-face-tracking-10",
      "topic": "proportional-control",
      "learningSlide": 19,
      "prompt": "Why multiply X - 150 by a coefficient K1 in the updated program?",
      "choices": [
        "To make motor speeds independent of face position",
        "To reduce overly fast turning when the face is far left or right",
        "To turn X into a temperature value",
        "To disable the module's X coordinate"
      ],
      "correctIndex": 1,
      "hint": "A smaller multiplier produces gentler turns.",
      "explanation": "Slide 19 introduces turn = (X - 150) × K1 to slow the tracking rotation and improve control."
    }
  ]
};
