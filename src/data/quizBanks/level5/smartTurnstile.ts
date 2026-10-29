/** Source-checked questions from the 20-page official Level 5 Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const smartTurnstileBank: QuizBank = {
  "projectId": "level-5-smart-turnstile",
  "title": "Smart Turnstile",
  "sourcePdfPath": "public/Level 5/Learning/Mechanisms & Simulators/Smart Turnstile/21.Smart Turnstile-Slides.pdf",
  "sourcePageCount": 20,
  "questions": [
    {
      "id": "level-5-smart-turnstile-01",
      "topic": "tag-identity",
      "learningSlide": 5,
      "prompt": "What can a phone-generated tag or QR code represent for a smart turnstile?",
      "choices": [
        "A unique ID or door-opening credential",
        "The room's temperature",
        "The turnstile's mass",
        "An uncontrolled motor speed"
      ],
      "correctIndex": 0,
      "hint": "The code can function like a key.",
      "explanation": "Slide 5 explains that tag and QR codes can serve as IDs or passwords for scanning and authentication."
    },
    {
      "id": "level-5-smart-turnstile-02",
      "topic": "tag-identity",
      "learningSlide": 7,
      "prompt": "What characteristic of the printed pattern allows tag and QR codes to store information?",
      "choices": [
        "A rotating axle",
        "A pattern of black and white blocks",
        "The temperature of the paper",
        "The weight of the phone"
      ],
      "correctIndex": 1,
      "hint": "The camera looks at a visual pattern.",
      "explanation": "Slide 7 describes information represented by the arrangement of black and white blocks."
    },
    {
      "id": "level-5-smart-turnstile-03",
      "topic": "ai-recognition",
      "learningSlide": 7,
      "prompt": "What does the AI vision module return when it recognizes a tag code?",
      "choices": [
        "The tag's recognized value or ID",
        "Only the user's height",
        "Only the ambient light temperature",
        "A random motor speed"
      ],
      "correctIndex": 0,
      "hint": "The program needs a code value it can compare.",
      "explanation": "Slide 7 says the AI module captures the information in the tag code and returns the corresponding value."
    },
    {
      "id": "level-5-smart-turnstile-04",
      "topic": "ai-recognition",
      "learningSlide": 8,
      "prompt": "Which piece of information is returned by the tag-recognition programming block?",
      "choices": [
        "Elapsed ride duration",
        "Measured humidity",
        "Tag code value ID",
        "The infrared travel distance"
      ],
      "correctIndex": 2,
      "hint": "The returned number identifies the scanned tag.",
      "explanation": "Slide 8 specifies the block's return value as the recognized tag-code ID."
    },
    {
      "id": "level-5-smart-turnstile-05",
      "topic": "hardware-setup",
      "learningSlide": 11,
      "prompt": "Which controller port is specified for the AI module in the smart turnstile?",
      "choices": [
        "M1",
        "P8",
        "M4",
        "P1"
      ],
      "correctIndex": 1,
      "hint": "The module is connected to a P-number port.",
      "explanation": "Slide 11 instructs students to connect the AI module to P8."
    },
    {
      "id": "level-5-smart-turnstile-06",
      "topic": "hardware-setup",
      "learningSlide": 11,
      "prompt": "Which controller port does the lesson assign to the turnstile motor?",
      "choices": [
        "P8",
        "P2",
        "M1",
        "P7"
      ],
      "correctIndex": 2,
      "hint": "Motors use M-number ports in this setup.",
      "explanation": "Slide 11 instructs students to connect the motor to M1."
    },
    {
      "id": "level-5-smart-turnstile-07",
      "topic": "password-enrollment",
      "learningSlide": 13,
      "prompt": "How is the initial password established in the lesson's program?",
      "choices": [
        "Use the first tag code the AI module recognizes",
        "Ask a random number generator for every opening",
        "Always use the number zero",
        "Choose the code of the last incorrect attempt"
      ],
      "correctIndex": 0,
      "hint": "A tag must be learned before later comparisons.",
      "explanation": "Slide 13 says the first recognized tag code becomes the initial password."
    },
    {
      "id": "level-5-smart-turnstile-08",
      "topic": "password-enrollment",
      "learningSlide": 15,
      "prompt": "What happens when the detected tag-code ID equals the stored initial password?",
      "choices": [
        "An alarm sounds for an hour",
        "The controller deletes the password",
        "The turnstile motor rotates to open the gate",
        "The controller switches to humidity mode"
      ],
      "correctIndex": 2,
      "hint": "Matching a registered tag allows access.",
      "explanation": "Slide 15 makes the motor rotate to open when the detected password matches the initial password."
    },
    {
      "id": "level-5-smart-turnstile-09",
      "topic": "turnstile-safety",
      "learningSlide": 14,
      "prompt": "Why does the lesson set the motor speed to zero while reading the detected password?",
      "choices": [
        "To keep the gate stopped during recognition",
        "To turn the AI module into a camera light",
        "To erase the code",
        "To make the turnstile count the room temperature"
      ],
      "correctIndex": 0,
      "hint": "Zero speed means no motor rotation.",
      "explanation": "Slide 14 describes zero motor speed, stopping the gate while the detected code value is read."
    },
    {
      "id": "level-5-smart-turnstile-10",
      "topic": "turnstile-safety",
      "learningSlide": 16,
      "prompt": "What happens in the example when the detected password is not accepted?",
      "choices": [
        "A warning alarm is activated for one second",
        "The controller automatically opens both gates",
        "The AI module forgets its port",
        "The motor doubles its speed forever"
      ],
      "correctIndex": 0,
      "hint": "The incorrect-code branch gives a short warning.",
      "explanation": "Slide 16 states that the otherwise branch activates an alarm for one second."
    }
  ]
};
