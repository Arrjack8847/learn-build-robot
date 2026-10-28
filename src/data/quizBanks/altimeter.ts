/** Checked against the actual 22-page Learning PDF. */
import type { QuizBank } from "../quizStudio";

export const altimeterBank: QuizBank = {
  "projectId": "level-6-altimeter",
  "title": "Altimeter",
  "sourcePdfPath": "public/Level 6/Learning/Sensor Automation/Altimeter/18. Altimeter-Teaching Slides.pdf",
  "sourcePageCount": 22,
  "questions": [
    {
      "id": "alt-01",
      "topic": "altimeter-basics",
      "learningSlide": 9,
      "prompt": "What does the lesson's altimeter measure to estimate altitude?",
      "choices": [
        "Atmospheric pressure",
        "Motor torque",
        "Ambient sound level",
        "Wheel rotation speed"
      ],
      "correctIndex": 0,
      "explanation": "The altimeter estimates altitude from its current atmospheric pressure measurement.",
      "hint": "Think about how the amount of air above you changes with height."
    },
    {
      "id": "alt-02",
      "topic": "altimeter-basics",
      "learningSlide": 9,
      "prompt": "What sea-level reference pressure is used in the lesson?",
      "choices": [
        "101,325 Pa",
        "10,132 Pa",
        "100 Pa",
        "300 Pa"
      ],
      "correctIndex": 0,
      "explanation": "Slide 9 uses an average sea-level atmospheric pressure of about 101,325 Pa.",
      "hint": "Look for the standard reference value used before calculating a difference."
    },
    {
      "id": "alt-03",
      "topic": "pressure-and-height",
      "learningSlide": 9,
      "prompt": "Below about 3,000 m altitude, what does the lesson say happens to air pressure as altitude increases?",
      "choices": [
        "It decreases",
        "It increases",
        "It stays unchanged",
        "It depends only on sound"
      ],
      "correctIndex": 0,
      "explanation": "The slide states that air pressure drops with increasing altitude within the stated range.",
      "hint": "Think about what happens to the weight of air above you as you climb."
    },
    {
      "id": "alt-04",
      "topic": "pressure-and-height",
      "learningSlide": 8,
      "prompt": "Why might a climber use atmospheric pressure to estimate altitude?",
      "choices": [
        "Pressure changes with elevation",
        "Pressure directly measures the length of a hiking path",
        "Pressure gives the compass direction",
        "Pressure tells the exact GPS satellite position"
      ],
      "correctIndex": 0,
      "explanation": "The lesson describes using atmospheric pressure as one method of estimating height during climbing.",
      "hint": "Think about the relationship between air pressure and height."
    },
    {
      "id": "alt-05",
      "topic": "altitude-calculation",
      "learningSlide": 16,
      "prompt": "Using the lesson's approximation, a 200 Pa drop from sea-level pressure corresponds to about how much height?",
      "choices": [
        "18 m",
        "9 m",
        "27 m",
        "200 m"
      ],
      "correctIndex": 0,
      "explanation": "The lesson uses (pressure drop / 100) × 9, so (200 / 100) × 9 = 18 m.",
      "hint": "First work out how many groups of 100 Pa the drop contains."
    },
    {
      "id": "alt-06",
      "topic": "altitude-calculation",
      "learningSlide": 16,
      "prompt": "Using the same lesson formula, a 400 Pa pressure drop corresponds to approximately what altitude?",
      "choices": [
        "36 m",
        "4 m",
        "9 m",
        "400 m"
      ],
      "correctIndex": 0,
      "explanation": "Four groups of 100 Pa multiplied by 9 m gives approximately 36 m.",
      "hint": "Break the pressure difference into equal 100 Pa portions."
    },
    {
      "id": "alt-07",
      "topic": "sensor-setup",
      "learningSlide": 13,
      "prompt": "What should the altimeter program initialize at the start?",
      "choices": [
        "The sensor and unchanging display text",
        "Only the color of the robot's wheels",
        "Only the motor's speed",
        "All GPS satellites"
      ],
      "correctIndex": 0,
      "explanation": "The first programming step initializes the sensor and text that does not need refreshing.",
      "hint": "Think about which items need setup before displaying changing altitude."
    },
    {
      "id": "alt-08",
      "topic": "sensor-setup",
      "learningSlide": 14,
      "prompt": "How long does the barometric sensor take to activate after power-on, according to the lesson?",
      "choices": [
        "About 1–2 seconds",
        "About 20–30 seconds",
        "About 2–3 minutes",
        "About one hour"
      ],
      "correctIndex": 0,
      "explanation": "Slide 14 says the barometric sensor needs roughly one to two seconds to activate.",
      "hint": "Look for the short sensor power-on preparation time."
    },
    {
      "id": "alt-09",
      "topic": "checking-results",
      "learningSlide": 15,
      "prompt": "If the calculated altitude exceeds the program's supported range, what should appear?",
      "choices": [
        "An out-of-range prompt",
        "A battery recharge screen",
        "A motor-angle limit message",
        "A successful GPS lock message"
      ],
      "correctIndex": 0,
      "explanation": "The programming step shows an exceeded-range prompt and advises checking the program.",
      "hint": "Think about how the program can warn that a calculated value is outside its limits."
    },
    {
      "id": "alt-10",
      "topic": "checking-results",
      "learningSlide": 20,
      "prompt": "In the lesson's optimization activity, what do students calculate from several altitude readings?",
      "choices": [
        "The local average altitude",
        "The motor's average speed",
        "The average sound level",
        "The number of robot parts"
      ],
      "correctIndex": 0,
      "explanation": "Slide 20 asks students to collect height readings and calculate the local average.",
      "hint": "Think about how several measurements can be combined into one representative value."
    }
  ]
};
