import type { QuizBank } from "../../quizStudio";
/** Verified against Level 2 Pirate Ship Learning PDF slides. */
export const pirateShipBank: QuizBank = {
  "projectId": "level-2-pirate-ship",
  "title": "Pirate ship",
  "sourcePdfPath": "public/Level 2/Learning/Action-Oriented/Pirate ship/Pirate ship__Powerpoint.pdf",
  "sourcePageCount": 15,
  "questions": [
    {
      "id": "ps1",
      "topic": "drive-types",
      "learningSlide": 6,
      "prompt": "What connects the pulleys in the lesson's belt drive?",
      "choices": [
        "Flexible tensioned belt",
        "Solid beam only",
        "Electric cable only",
        "Water hose"
      ],
      "correctIndex": 0,
      "hint": "Consider the material that transmits movement between the pulley wheels.",
      "explanation": "Slide 6 defines belt transmission using a flexible tensioned belt."
    },
    {
      "id": "ps2",
      "topic": "drive-types",
      "learningSlide": 6,
      "prompt": "What causes a friction-type belt drive to transfer motion?",
      "choices": [
        "Contact friction between belt and pulley",
        "Infrared reflections",
        "Electrical sparks",
        "Air-pressure pulses"
      ],
      "correctIndex": 0,
      "hint": "Think about how a moving belt grips a wheel.",
      "explanation": "Slide 6 identifies friction at the belt and pulley as the driving mechanism."
    },
    {
      "id": "ps3",
      "topic": "ride-mechanism",
      "learningSlide": 7,
      "prompt": "Around which axis does the pirate ship ride swing?",
      "choices": [
        "Horizontal axis",
        "Vertical-only axis",
        "Diagonal camera axis",
        "No axis"
      ],
      "correctIndex": 0,
      "hint": "Picture a suspended ride moving backward and forward.",
      "explanation": "Slide 7 describes pirate ship rides reciprocating around a horizontal axis."
    },
    {
      "id": "ps4",
      "topic": "ride-mechanism",
      "learningSlide": 7,
      "prompt": "What transmission is used in the model Pirate Ship?",
      "choices": [
        "Belt drive",
        "Hydraulic press",
        "Ultrasonic sensor",
        "Direct jet propulsion"
      ],
      "correctIndex": 0,
      "hint": "Look at the flexible drive connection in the introduction.",
      "explanation": "Slide 7 says the model uses the belt-drive principle."
    },
    {
      "id": "ps5",
      "topic": "belt-strengths",
      "learningSlide": 9,
      "prompt": "Which is an advantage of belt transmission?",
      "choices": [
        "Smooth motion and load cushioning",
        "Perfect speed ratio without slip",
        "No pulley requirement",
        "No belt wear ever"
      ],
      "correctIndex": 0,
      "hint": "A flexible connection can reduce sudden loading.",
      "explanation": "Slide 9 lists smooth transmission and buffering as advantages."
    },
    {
      "id": "ps6",
      "topic": "belt-strengths",
      "learningSlide": 9,
      "prompt": "Which maintenance feature is listed as an advantage?",
      "choices": [
        "Simple structure and convenient service",
        "A complex hydraulic circuit",
        "No access to moving components",
        "Specialized calibration after each turn"
      ],
      "correctIndex": 0,
      "hint": "Think about the number of complicated parts in a simple belt drive.",
      "explanation": "Slide 9 includes low complexity and easy maintenance."
    },
    {
      "id": "ps7",
      "topic": "belt-limits",
      "learningSlide": 9,
      "prompt": "Which limitation of belt drives does the lesson mention?",
      "choices": [
        "Transmission ratio may be inaccurate",
        "They cannot transmit power",
        "They need no installation space",
        "They never slip"
      ],
      "correctIndex": 0,
      "hint": "Slipping affects how precisely the speed ratio is maintained.",
      "explanation": "Slide 9 lists inaccurate transmission ratio as a drawback."
    },
    {
      "id": "ps8",
      "topic": "belt-limits",
      "learningSlide": 9,
      "prompt": "Which other limitation is specifically mentioned?",
      "choices": [
        "Limited belt lifetime",
        "Zero belt wear",
        "No load on shafts",
        "Perfect efficiency"
      ],
      "correctIndex": 0,
      "hint": "Think about wear on a moving flexible belt.",
      "explanation": "Slide 9 names low belt life among disadvantages."
    },
    {
      "id": "ps9",
      "topic": "real-applications",
      "learningSlide": 10,
      "prompt": "Which household machine is named as an application of belt drives?",
      "choices": [
        "Washing machine",
        "Microwave display",
        "Digital clock screen",
        "Wireless router"
      ],
      "correctIndex": 0,
      "hint": "Consider appliances with rotating mechanical parts.",
      "explanation": "Slide 10 lists washing machines as belt-drive applications."
    },
    {
      "id": "ps10",
      "topic": "real-applications",
      "learningSlide": 10,
      "prompt": "Which belt-drive type is named in the lesson?",
      "choices": [
        "V-belt drive",
        "Light-based belt drive",
        "Infrared belt drive",
        "Optical belt drive"
      ],
      "correctIndex": 0,
      "hint": "Look at belt names based on shape or timing.",
      "explanation": "Slide 10 lists flat, V-belt, and timing-belt types."
    }
  ]
};
