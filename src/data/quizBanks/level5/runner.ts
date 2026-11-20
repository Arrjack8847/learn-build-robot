/** Source: SHA-matched official Level 5 Learning PDF (38 pages). */
import type { QuizBank } from "../../quizStudio";

export const runnerBank: QuizBank = {
  "projectId": "level-5-runner",
  "title": "Runner",
  "sourcePdfPath": "public/Level 5/Learning/Display & Movement/Runner/25.Runner -Slides.pdf",
  "sourcePageCount": 38,
  "questions": [
    {
      "id": "level-5-runner-01",
      "topic": "running-motion",
      "learningSlide": 3,
      "prompt": "How does the lesson describe the legs during running?",
      "choices": [
        "They move alternately",
        "Both feet stay planted together",
        "The runner rolls on wheels",
        "The legs never change position"
      ],
      "correctIndex": 0,
      "hint": "Think about the alternating steps in running.",
      "explanation": "Slide 3 characterizes running with alternating steps and both feet not touching the ground simultaneously."
    },
    {
      "id": "level-5-runner-02",
      "topic": "running-motion",
      "learningSlide": 11,
      "prompt": "How are the paired moving parts positioned in the runner's gear drive?",
      "choices": [
        "Disconnected from the gear drive",
        "Staggered by 180 degrees",
        "Locked at exactly the same angle",
        "Separated by three full turns"
      ],
      "correctIndex": 1,
      "hint": "Check the gear-building instruction.",
      "explanation": "Slide 11 calls for the mirrored gear-drive parts to be 180 degrees out of phase."
    },
    {
      "id": "level-5-runner-03",
      "topic": "memory-addresses",
      "learningSlide": 23,
      "prompt": "Why does the controller have writable built-in memory?",
      "choices": [
        "To replace all downloaded programs",
        "To mechanically move gears",
        "To store data that can be changed during use",
        "Only to display fixed boot logos"
      ],
      "correctIndex": 2,
      "hint": "Look beyond the program-storage section.",
      "explanation": "Slide 23 introduces memory for mutable data separate from system and downloaded program storage."
    },
    {
      "id": "level-5-runner-04",
      "topic": "memory-addresses",
      "learningSlide": 24,
      "prompt": "How is each separate storage location in controller memory identified?",
      "choices": [
        "By a paint color alone",
        "By motor direction only",
        "By an arbitrary spoken command",
        "By its own address"
      ],
      "correctIndex": 3,
      "hint": "The diagram labels numbered spaces.",
      "explanation": "Slide 24 describes independent memory addresses such as address 1 and address 2."
    },
    {
      "id": "level-5-runner-05",
      "topic": "data-reading",
      "learningSlide": 26,
      "prompt": "What range can be entered for a memory address's data value in the controller interface?",
      "choices": [
        "0 to 4095",
        "0 to 10 only",
        "-500 to -1 only",
        "1 to 50000"
      ],
      "correctIndex": 0,
      "hint": "The data modification slide gives its limits.",
      "explanation": "Slide 26 specifies stored values between 0 and 4095."
    },
    {
      "id": "level-5-runner-06",
      "topic": "data-reading",
      "learningSlide": 27,
      "prompt": "What does the Get Address Data block read?",
      "choices": [
        "The exact weight of the model",
        "A value stored at a specified memory address",
        "The room's temperature",
        "An unconnected Bluetooth pairing name"
      ],
      "correctIndex": 1,
      "hint": "A memory block retrieves a value by location.",
      "explanation": "Slide 27 defines the block for reading address-based stored data."
    },
    {
      "id": "level-5-runner-07",
      "topic": "timed-actions",
      "learningSlide": 29,
      "prompt": "What happens when the controller time reaches the configured run duration?",
      "choices": [
        "The memory erases itself",
        "The model changes direction at random",
        "The runner's motor stops",
        "The motor accelerates forever"
      ],
      "correctIndex": 2,
      "hint": "The program compares current time with a limit.",
      "explanation": "Slide 29 stops the motor when the controller time is no longer below the set duration."
    },
    {
      "id": "level-5-runner-08",
      "topic": "timed-actions",
      "learningSlide": 30,
      "prompt": "Why does pressing the start button reset controller time to zero?",
      "choices": [
        "To remove all stored addresses",
        "To reverse the gear assembly",
        "To permanently disconnect the motor",
        "To begin timing a fresh running interval"
      ],
      "correctIndex": 3,
      "hint": "A reset establishes a new time reference.",
      "explanation": "Slide 30 resets the controller clock when starting a timed movement."
    },
    {
      "id": "level-5-runner-09",
      "topic": "controller-buttons",
      "learningSlide": 5,
      "prompt": "Which button can stop the runner during an active motion?",
      "choices": [
        "Right button",
        "Only the power supply cable",
        "A light sensor",
        "The Bluetooth name button"
      ],
      "correctIndex": 0,
      "hint": "Read the project requirements about interruption.",
      "explanation": "Slide 5 specifies stopping the running motion using the right button."
    },
    {
      "id": "level-5-runner-10",
      "topic": "controller-buttons",
      "learningSlide": 32,
      "prompt": "What is the extension's proposed special button combination?",
      "choices": [
        "Disconnect both buttons",
        "Press the left and right keys together",
        "Press only the power key",
        "Press the wheel encoder"
      ],
      "correctIndex": 1,
      "hint": "The challenge combines both direction keys.",
      "explanation": "Slide 32 suggests simultaneously pressing the left and right keys to set default values."
    }
  ]
};
