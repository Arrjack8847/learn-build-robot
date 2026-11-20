/** Level 4 Learning PDF text checked page by page; no unreviewed diagrams assumed. */
import type { QuizBank } from "../../quizStudio";

export const personalBodyguardBank: QuizBank = {
  "projectId": "level-4-personal-bodyguard",
  "title": "Personal Bodyguard",
  "sourcePdfPath": "public/Level 4/Automation & Security/Personal Bodyguard/09. Personal Bodyguard-Teaching Slides.pdf",
  "sourcePageCount": 25,
  "questions": [
    {
      "id": "l4-pb-01",
      "topic": "follower-purpose",
      "learningSlide": 8,
      "prompt": "How does the follower robot decide whether to change its movement?",
      "choices": [
        "By reading a random number",
        "By measuring how far it is from a target",
        "By measuring air pressure",
        "By checking the time of day"
      ],
      "correctIndex": 1,
      "explanation": "Slide 8 explains using target distance to select different movements.",
      "hint": "Think about how the robot maintains its distance."
    },
    {
      "id": "l4-pb-02",
      "topic": "follower-purpose",
      "learningSlide": 8,
      "prompt": "Which sensor is selected for following in this lesson?",
      "choices": [
        "Humidity sensor",
        "Color camera only",
        "Thermometer",
        "Laser ranging sensor"
      ],
      "correctIndex": 3,
      "explanation": "Slide 8 chooses a laser ranging sensor for the following function.",
      "hint": "It measures how far away the target is."
    },
    {
      "id": "l4-pb-03",
      "topic": "laser-sensing",
      "learningSlide": 9,
      "prompt": "How does the sensor determine distance?",
      "choices": [
        "By timing the emitted and returned laser light",
        "By weighing the object",
        "By detecting sound volume",
        "By reading a QR code"
      ],
      "correctIndex": 0,
      "explanation": "Slide 9 describes distance based on the laser's return time.",
      "hint": "Light travels to the target and back."
    },
    {
      "id": "l4-pb-04",
      "topic": "laser-sensing",
      "learningSlide": 10,
      "prompt": "Which target surface does the lesson say reflects a laser more effectively under the same illumination?",
      "choices": [
        "A black surface",
        "An invisible surface",
        "A white surface",
        "A vibrating speaker"
      ],
      "correctIndex": 2,
      "explanation": "Slide 10 states white objects generally reflect laser light more effectively than dark objects.",
      "hint": "Lighter surfaces reflect more of the emitted light."
    },
    {
      "id": "l4-pb-05",
      "topic": "sensor-modes",
      "learningSlide": 9,
      "prompt": "What is the longest range of the standard detection mode?",
      "choices": [
        "10 metres",
        "1.2 metres",
        "2 metres",
        "200 metres"
      ],
      "correctIndex": 1,
      "explanation": "Slide 9 gives 1.2 metres for standard mode.",
      "hint": "It is shorter than the long-distance mode."
    },
    {
      "id": "l4-pb-06",
      "topic": "sensor-modes",
      "learningSlide": 9,
      "prompt": "What is the maximum range of the long-distance mode?",
      "choices": [
        "20 centimetres",
        "1.2 metres",
        "12 metres",
        "2 metres"
      ],
      "correctIndex": 3,
      "explanation": "Slide 9 gives 2 metres as the long-distance maximum.",
      "hint": "Choose the farther of the two stated modes."
    },
    {
      "id": "l4-pb-07",
      "topic": "reading-handling",
      "learningSlide": 11,
      "prompt": "What special value indicates the laser sensor is outside its measurement range?",
      "choices": [
        "8888",
        "0",
        "1000",
        "25"
      ],
      "correctIndex": 0,
      "explanation": "Slide 11 identifies 8888 as the out-of-range return value.",
      "hint": "This is a four-digit sentinel, not a distance."
    },
    {
      "id": "l4-pb-08",
      "topic": "reading-handling",
      "learningSlide": 16,
      "prompt": "What does the follower program repeatedly store and show on the display?",
      "choices": [
        "Only the motor brand",
        "The wall color",
        "The sensor's measured distance value",
        "A saved password"
      ],
      "correctIndex": 2,
      "explanation": "Slide 16 instructs students to keep reading the sensor into a variable and displaying it.",
      "hint": "The display presents the changing measurement."
    },
    {
      "id": "l4-pb-09",
      "topic": "following-behavior",
      "learningSlide": 14,
      "prompt": "What should the model do if its target is too far away?",
      "choices": [
        "Stay stopped at every distance",
        "Move forward",
        "Turn off its sensor",
        "Only play a warning sound"
      ],
      "correctIndex": 1,
      "explanation": "Slide 14 describes moving forward when far away and backward when close.",
      "hint": "The follower attempts to close a large gap."
    },
    {
      "id": "l4-pb-10",
      "topic": "following-behavior",
      "learningSlide": 19,
      "prompt": "What happens when neither the too-far nor too-near condition is met?",
      "choices": [
        "The robot accelerates forever",
        "The robot deletes its program",
        "The sensor stops sending data",
        "The robot remains still"
      ],
      "correctIndex": 3,
      "explanation": "Slide 19 states that between the two distance conditions the robot stops.",
      "hint": "It has reached a suitable middle distance."
    }
  ]
};
