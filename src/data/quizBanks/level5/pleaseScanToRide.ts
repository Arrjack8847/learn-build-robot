/** Source: hash-matched official Level 5 Learning PDF (22 pages). */
import type { QuizBank } from "../../quizStudio";

export const pleaseScanToRideBank: QuizBank = {
  "projectId": "level-5-please-scan-to-ride",
  "title": "Please Scan to Ride",
  "sourcePdfPath": "public/Level 5/Learning/Automation & Security/Please Scan to Ride/03.Please Scan to Ride-Teaching Slides.pdf",
  "sourcePageCount": 22,
  "questions": [
    {
      "id": "level-5-please-scan-to-ride-01",
      "topic": "digital-rides",
      "learningSlide": 9,
      "prompt": "What technology helped popularize app-based temporary car services?",
      "choices": [
        "Mobile payment and communication software",
        "Only mechanical coin counters",
        "Steam engines alone",
        "Handwritten paper route maps"
      ],
      "correctIndex": 0,
      "hint": "Think about booking and paying from a phone.",
      "explanation": "Slide 9 links the rise of mobile payment to app-based travel services."
    },
    {
      "id": "level-5-please-scan-to-ride-02",
      "topic": "digital-rides",
      "learningSlide": 11,
      "prompt": "What does the classroom taxi robot use to choose a travel distance?",
      "choices": [
        "The motor's serial number",
        "A scanned QR code value",
        "The driver's favorite color",
        "Randomly chosen weather reports"
      ],
      "correctIndex": 1,
      "hint": "Read the model's assigned scanning task.",
      "explanation": "Slide 11 asks the robot to scan code values and move different distances."
    },
    {
      "id": "level-5-please-scan-to-ride-03",
      "topic": "qr-code-scanning",
      "learningSlide": 12,
      "prompt": "Which device reads the QR code for the classroom ride?",
      "choices": [
        "Barometric pressure sensor",
        "A speaker",
        "Scanning camera",
        "Infrared TV remote"
      ],
      "correctIndex": 2,
      "hint": "The lesson names the device before the flowchart.",
      "explanation": "Slide 12 describes a scanning camera that reads different QR code values."
    },
    {
      "id": "level-5-please-scan-to-ride-04",
      "topic": "qr-code-scanning",
      "learningSlide": 13,
      "prompt": "Where does the starter program repeatedly store the code returned by the camera?",
      "choices": [
        "A moving rod",
        "An unconnected motor port",
        "An analog compass",
        "A variable"
      ],
      "correctIndex": 3,
      "hint": "The value needs to be read again and again.",
      "explanation": "Slide 13 repeatedly reads the scanning-camera value into a variable."
    },
    {
      "id": "level-5-please-scan-to-ride-05",
      "topic": "invalid-codes",
      "learningSlide": 12,
      "prompt": "Which value means the scanning camera has not recognized a code?",
      "choices": [
        "999",
        "123",
        "0",
        "100"
      ],
      "correctIndex": 0,
      "hint": "Look for the camera's no-recognition output.",
      "explanation": "Slide 12 identifies 999 as a non-recognition value, not a valid ride code."
    },
    {
      "id": "level-5-please-scan-to-ride-06",
      "topic": "invalid-codes",
      "learningSlide": 12,
      "prompt": "Which additional value is treated as an invalid end-of-code marker?",
      "choices": [
        "2000",
        "65488",
        "240",
        "4095"
      ],
      "correctIndex": 1,
      "hint": "The flowchart names two abnormal values to ignore.",
      "explanation": "Slide 12 names 65488 as the end code that must be masked."
    },
    {
      "id": "level-5-please-scan-to-ride-07",
      "topic": "ride-movement",
      "learningSlide": 15,
      "prompt": "What happens when the programmed travel time ends?",
      "choices": [
        "The QR code becomes a motor angle",
        "The robot begins recording sound",
        "The motor stops and the lights switch off",
        "The robot continues forever"
      ],
      "correctIndex": 2,
      "hint": "Follow the end of the ride function.",
      "explanation": "Slide 15 stops the motor and switches off the photoelectric lights after travelling."
    },
    {
      "id": "level-5-please-scan-to-ride-08",
      "topic": "ride-movement",
      "learningSlide": 15,
      "prompt": "What is the photoelectric sensor used for during the ride function?",
      "choices": [
        "Counting QR codes",
        "Measuring the rider's weight",
        "Storing the taxi fare",
        "Lighting the car"
      ],
      "correctIndex": 3,
      "hint": "The sensor is repurposed as a lamp.",
      "explanation": "Slide 15 turns on a photoelectric sensor as vehicle lighting during movement."
    },
    {
      "id": "level-5-please-scan-to-ride-09",
      "topic": "duration-settings",
      "learningSlide": 16,
      "prompt": "How does the lesson relate different scanned code values to movement?",
      "choices": [
        "It multiplies selected values by corresponding timing factors",
        "It ignores the code after every scan",
        "It sets every ride to an identical distance",
        "It changes the robot's paint"
      ],
      "correctIndex": 0,
      "hint": "Look for magnification factors affecting time.",
      "explanation": "Slide 16 adjusts motion duration according to the detected code value."
    },
    {
      "id": "level-5-please-scan-to-ride-10",
      "topic": "duration-settings",
      "learningSlide": 20,
      "prompt": "According to the optimization prompt, what happens as the valid code value increases?",
      "choices": [
        "The motor immediately reverses",
        "The robot travels farther",
        "The robot always moves less",
        "The camera permanently turns off"
      ],
      "correctIndex": 1,
      "hint": "Think about the relationship between time and distance.",
      "explanation": "Slide 20 says larger code values correspond to longer travel distances."
    }
  ]
};
