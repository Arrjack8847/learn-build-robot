/** Questions checked against the official 22-page Level 5 Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const facialRecognitionTimeClockBank: QuizBank = {
  "projectId": "level-5-facial-recognition-time-clock",
  "title": "Facial Recognition Time Clock",
  "sourcePdfPath": "public/Level 5/Learning/Sensor-Focused Robots/Facial Recognition Time Clock/28.Facial Recognition Time Clock-Slides.pdf",
  "sourcePageCount": 22,
  "questions": [
    {
      "id": "level-5-facial-recognition-time-clock-01",
      "topic": "attendance-purpose",
      "learningSlide": 5,
      "prompt": "What is the main purpose of a time clock in the workplace?",
      "choices": [
        "Record when employees arrive and leave work",
        "Determine wind speed around the building",
        "Calculate a robot's wheel ratio",
        "Measure a storage cabinet's magnetism"
      ],
      "correctIndex": 0,
      "hint": "The lesson introduces attendance systems.",
      "explanation": "Slide 5 describes a time clock as a device that records employees' entry and exit times."
    },
    {
      "id": "level-5-facial-recognition-time-clock-02",
      "topic": "attendance-purpose",
      "learningSlide": 5,
      "prompt": "What information does a facial-attendance system use to help identify staff?",
      "choices": [
        "Outdoor air pressure alone",
        "Facial images captured by a camera",
        "Only the color of a person's shirt",
        "The sound of a robot motor"
      ],
      "correctIndex": 1,
      "hint": "The model uses a camera to collect identification data.",
      "explanation": "Slide 5 explains capturing face images and analyzing facial feature values."
    },
    {
      "id": "level-5-facial-recognition-time-clock-03",
      "topic": "face-learning",
      "learningSlide": 9,
      "prompt": "How does the AI module learn to distinguish different registered faces?",
      "choices": [
        "By measuring laser distance to the door",
        "By using random IDs without observing faces",
        "By examining and storing facial features from sample images",
        "By relying only on employee height"
      ],
      "correctIndex": 2,
      "hint": "The lesson shows a sample-collection and feature-extraction process.",
      "explanation": "Slide 9 describes learning and comparing distinctive facial features from collected face images."
    },
    {
      "id": "level-5-facial-recognition-time-clock-04",
      "topic": "face-learning",
      "learningSlide": 10,
      "prompt": "What return value indicates no face image is recognized or available for recognition learning?",
      "choices": [
        "100",
        "-1000",
        "360",
        "0"
      ],
      "correctIndex": 3,
      "hint": "The lesson reserves zero for no recognition.",
      "explanation": "Slide 10 specifies a return value of zero for no recognized or learned image."
    },
    {
      "id": "level-5-facial-recognition-time-clock-05",
      "topic": "hardware-setup",
      "learningSlide": 13,
      "prompt": "Which port does the model use for its AI face-recognition module?",
      "choices": [
        "P8",
        "M1",
        "M2",
        "P3"
      ],
      "correctIndex": 0,
      "hint": "The camera plugs into a P-labeled connection.",
      "explanation": "Slide 13 specifies connecting the AI module to controller port P8."
    },
    {
      "id": "level-5-facial-recognition-time-clock-06",
      "topic": "hardware-setup",
      "learningSlide": 15,
      "prompt": "Which AI module mode is selected during the program's initialization?",
      "choices": [
        "Magnetic strength mode",
        "Face recognition learning mode",
        "Traffic sign mode",
        "Laser ranging mode"
      ],
      "correctIndex": 1,
      "hint": "The program needs to learn faces before checking attendance.",
      "explanation": "Slide 15 instructs setting the AI module to face recognition learning mode."
    },
    {
      "id": "level-5-facial-recognition-time-clock-07",
      "topic": "id-handling",
      "learningSlide": 16,
      "prompt": "What does the variable called 'ID number' store?",
      "choices": [
        "Only the motor's speed",
        "A random display color",
        "The face recognition learning ID",
        "Only the current humidity"
      ],
      "correctIndex": 2,
      "hint": "It is assigned the result of the AI module.",
      "explanation": "Slide 16 says the ID number variable stores the AI face-recognition-learning ID."
    },
    {
      "id": "level-5-facial-recognition-time-clock-08",
      "topic": "id-handling",
      "learningSlide": 17,
      "prompt": "When does the lesson's program give a short 0.1-second buzzer signal?",
      "choices": [
        "Whenever the camera sees no face",
        "Only when humidity exceeds 100%",
        "When the motor reaches maximum speed",
        "When the recognized ID number is not zero"
      ],
      "correctIndex": 3,
      "hint": "The beep indicates that a face ID has been found.",
      "explanation": "Slide 17 says the buzzer sounds for 0.1 seconds if ID number is not zero."
    },
    {
      "id": "level-5-facial-recognition-time-clock-09",
      "topic": "clock-in-feedback",
      "learningSlide": 18,
      "prompt": "What is displayed after a valid face triggers the attendance step?",
      "choices": [
        "Attendance information",
        "Only the distance to the Moon",
        "Only a prize-wheel number",
        "The current magnetic pole"
      ],
      "correctIndex": 0,
      "hint": "The employee needs confirmation of check-in.",
      "explanation": "Slide 18 says the controller shows attendance information when clock-in completes."
    },
    {
      "id": "level-5-facial-recognition-time-clock-10",
      "topic": "clock-in-feedback",
      "learningSlide": 18,
      "prompt": "How long does the attendance information remain before the program clears the screen?",
      "choices": [
        "1 hour",
        "1 second",
        "10 minutes",
        "0.001 seconds"
      ],
      "correctIndex": 1,
      "hint": "The feedback is brief before resetting the display.",
      "explanation": "Slide 18 instructs waiting one second before clearing the screen."
    }
  ]
};
