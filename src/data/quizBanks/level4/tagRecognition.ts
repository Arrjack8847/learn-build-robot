/** Level 4 — Tag Recognition. Questions checked against the 17-page Learning PDF text; diagram-independent, Acceleration Car difficulty. */
import type { QuizBank } from "../../quizStudio";

export const tagRecognitionBank: QuizBank = {
  "projectId": "level-4-tag-recognition",
  "title": "Tag Recognition",
  "sourcePdfPath": "public/Level 4/Automation & Security/Tag Recognition/06. Tag Recognition.pdf",
  "sourcePageCount": 17,
  "questions": [
    {
      "id": "l4-tagrecognition-01",
      "topic": "qr-applications",
      "learningSlide": 3,
      "prompt": "What can a customer do after scanning a business's QR code?",
      "choices": [
        "Open the services linked to it",
        "Turn a motor by hand",
        "Measure wind speed",
        "Change the phone's battery"
      ],
      "correctIndex": 0,
      "explanation": "Slide 3 describes QR codes linking customers to services on their phones.",
      "hint": "Think about what information a code can lead to."
    },
    {
      "id": "l4-tagrecognition-02",
      "topic": "qr-applications",
      "learningSlide": 4,
      "prompt": "What can a personal QR code be used as in the lesson?",
      "choices": [
        "A wheel axle",
        "An exclusive ID",
        "A temperature probe",
        "A motor gear"
      ],
      "correctIndex": 1,
      "explanation": "Slide 4 says a generated code can serve as an exclusive ID or payment password.",
      "hint": "Think of a code that identifies one user."
    },
    {
      "id": "l4-tagrecognition-03",
      "topic": "recognition-values",
      "learningSlide": 6,
      "prompt": "Which module recognizes the tag code?",
      "choices": [
        "Touch switch",
        "AI audio-visual module",
        "DC motor",
        "Color light"
      ],
      "correctIndex": 1,
      "explanation": "Slide 6 names the AI audio-visual module as the tag-code reader.",
      "hint": "Remember the component with the camera in this lesson."
    },
    {
      "id": "l4-tagrecognition-04",
      "topic": "recognition-values",
      "learningSlide": 6,
      "prompt": "What does the recognition module send to the controller when it reads a tag?",
      "choices": [
        "The tag's corresponding value",
        "The room temperature",
        "The motor's weight",
        "The gate's color"
      ],
      "correctIndex": 0,
      "explanation": "Slide 6 explains that the module returns the recognized tag value.",
      "hint": "Think about the information the controller needs to identify the code."
    },
    {
      "id": "l4-tagrecognition-05",
      "topic": "mode-and-missing-codes",
      "learningSlide": 7,
      "prompt": "Which mode should the AI audio-visual module use for this project?",
      "choices": [
        "Face drawing mode",
        "Voice volume mode",
        "Tag code recognition mode",
        "Wheel-speed mode"
      ],
      "correctIndex": 2,
      "explanation": "Slide 7 instructs students to select tag code recognition mode.",
      "hint": "Think about what the camera is supposed to recognize."
    },
    {
      "id": "l4-tagrecognition-06",
      "topic": "mode-and-missing-codes",
      "learningSlide": 7,
      "prompt": "What value is returned when the tag code is not recognized?",
      "choices": [
        "1",
        "5",
        "10",
        "0"
      ],
      "correctIndex": 3,
      "explanation": "Slide 7 explicitly says the module returns 0 when no tag is recognized.",
      "hint": "Remember the lesson's special value for no result."
    },
    {
      "id": "l4-tagrecognition-07",
      "topic": "robot-connections",
      "learningSlide": 9,
      "prompt": "Where does the lesson connect the AI audio-visual module?",
      "choices": [
        "Port M1",
        "Port M2",
        "Port P8",
        "USB power only"
      ],
      "correctIndex": 2,
      "explanation": "Slide 9 specifies port P8 for the AI audio-visual module.",
      "hint": "The lesson uses a P-numbered port for the sensing module."
    },
    {
      "id": "l4-tagrecognition-08",
      "topic": "robot-connections",
      "learningSlide": 9,
      "prompt": "Which controller ports are used for the two motors?",
      "choices": [
        "M1 and M2",
        "P7 and P8",
        "A1 and A2",
        "USB and HDMI"
      ],
      "correctIndex": 0,
      "explanation": "Slide 9 connects the two motors to M1 and M2.",
      "hint": "Look for the pair of motor ports in the assembly instructions."
    },
    {
      "id": "l4-tagrecognition-09",
      "topic": "password-program",
      "learningSlide": 12,
      "prompt": "What does the robot save from the first tag it recognizes?",
      "choices": [
        "The camera brightness",
        "The tag ID as its password",
        "The motor speed as its password",
        "The gate height"
      ],
      "correctIndex": 1,
      "explanation": "Slide 12 stores the detected tag ID in a password variable.",
      "hint": "Think about what the robot will compare later."
    },
    {
      "id": "l4-tagrecognition-10",
      "topic": "password-program",
      "learningSlide": 14,
      "prompt": "In this lesson's program, what happens when a scanned tag matches the saved password?",
      "choices": [
        "The robot moves backward",
        "The robot makes a phone call",
        "The robot turns on a light only",
        "The robot forgets the password"
      ],
      "correctIndex": 0,
      "explanation": "Slide 14 directs the gatekeeper to move backward for one second when passwords match.",
      "hint": "Remember the movement assigned to an accepted tag."
    }
  ]
};
