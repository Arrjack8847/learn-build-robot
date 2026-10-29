/**
 * Phase 2 source-text-grounded question bank (PDF visual review pending).
 * Do not register or publish until diagram/age QA is complete.
 */
import type { QuizBank } from "../quizStudio";

export const helloWorldBank: QuizBank = {
  "projectId": "hello-world",
  "title": "Hello World",
  "sourcePdfPath": "public/Level 1/Learning/Display & Movement/Hello World/01.Hello World-Slides.pdf",
  "sourcePageCount": 38,
  "questions": [
    {
      "id": "hello-world-01",
      "topic": "programming-purpose",
      "learningSlide": 4,
      "prompt": "What simple message is commonly displayed in a first programming exercise?",
      "choices": [
        "Hello, World!",
        "Goodbye forever",
        "Battery low",
        "Motor stopped"
      ],
      "correctIndex": 0,
      "hint": "Recall the usual starting exercise in programming.",
      "explanation": "The lesson introduces displaying 'Hello, World!' as a simple first program."
    },
    {
      "id": "hello-world-02",
      "topic": "programming-purpose",
      "learningSlide": 3,
      "prompt": "Why do electronic devices need programs according to the lesson?",
      "choices": [
        "To perform tasks according to instructions",
        "To replace their batteries",
        "To increase their physical weight",
        "To remove their screens"
      ],
      "correctIndex": 0,
      "hint": "Think about giving a device a task to carry out.",
      "explanation": "Programming allows devices such as computers and robots to perform intended tasks."
    },
    {
      "id": "hello-world-03",
      "topic": "controller-display",
      "learningSlide": 8,
      "prompt": "What should appear on the first screen line in the project task?",
      "choices": [
        "Hello world in English",
        "A Chinese sentence only",
        "The number 100",
        "A random gear symbol"
      ],
      "correctIndex": 0,
      "hint": "The project asks for two different languages on two lines.",
      "explanation": "The requirements specify English 'Hello world' on the first line."
    },
    {
      "id": "hello-world-04",
      "topic": "controller-display",
      "learningSlide": 11,
      "prompt": "Which content can the controller's 3.2-inch screen display?",
      "choices": [
        "Numbers, characters, pictures and shapes",
        "Only numbers",
        "Only sound waves",
        "Only motor speed"
      ],
      "correctIndex": 0,
      "hint": "Think about the different visual elements listed.",
      "explanation": "The controller screen can display numbers, characters, images and shapes."
    },
    {
      "id": "hello-world-05",
      "topic": "machine-language",
      "learningSlide": 19,
      "prompt": "Which two digits does the lesson say machines recognize?",
      "choices": [
        "0 and 1",
        "1 and 2",
        "2 and 3",
        "5 and 9"
      ],
      "correctIndex": 0,
      "hint": "Recall the two symbols used in binary.",
      "explanation": "The machine-language slide introduces binary digits 0 and 1."
    },
    {
      "id": "hello-world-06",
      "topic": "machine-language",
      "learningSlide": 20,
      "prompt": "What software is named for translating a human-written program for the robot?",
      "choices": [
        "ZMROBO3.0",
        "A video player",
        "A photo gallery",
        "A music recorder"
      ],
      "correctIndex": 0,
      "hint": "Recall the programming application shown.",
      "explanation": "The translation diagram identifies ZMROBO3.0 software."
    },
    {
      "id": "hello-world-07",
      "topic": "block-programming",
      "learningSlide": 23,
      "prompt": "Which coding block starts the program in this lesson?",
      "choices": [
        "RCU task 1",
        "Wait 20 minutes",
        "Motor stop forever",
        "Play random video"
      ],
      "correctIndex": 0,
      "hint": "Look for the block placed above the following commands.",
      "explanation": "The lesson starts execution under the 'RCU task 1' block."
    },
    {
      "id": "hello-world-08",
      "topic": "block-programming",
      "learningSlide": 25,
      "prompt": "Where is the display-text coding block placed?",
      "choices": [
        "Below RCU task 1",
        "Outside the programming workspace",
        "Inside the motor housing",
        "Before connecting the controller to the computer"
      ],
      "correctIndex": 0,
      "hint": "Think about how the two coding blocks are spliced.",
      "explanation": "The text-display module is dragged below the RCU task block."
    },
    {
      "id": "hello-world-09",
      "topic": "download-and-run",
      "learningSlide": 30,
      "prompt": "Which order is given for downloading the program?",
      "choices": [
        "Connect controller, enter download mode, download",
        "Download, disconnect, connect",
        "Press Run, remove controller, download",
        "Switch off computer, download, build"
      ],
      "correctIndex": 0,
      "hint": "Recall the three numbered steps.",
      "explanation": "The source lists connecting the controller, entering download mode, then downloading."
    },
    {
      "id": "hello-world-10",
      "topic": "download-and-run",
      "learningSlide": 31,
      "prompt": "What should you try if pressing Run does not produce the expected result?",
      "choices": [
        "Check whether the program downloaded successfully",
        "Replace every beam immediately",
        "Remove the entire screen",
        "Delete every coding block without checking"
      ],
      "correctIndex": 0,
      "hint": "The lesson points to a common issue after running.",
      "explanation": "The slide warns that no response may mean the program was not downloaded successfully."
    }
  ]
};
