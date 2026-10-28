/** Source: 17-page Gyro Transmitter Learning PDF. Diagrams await visual QA. */
import type { QuizBank } from "../quizStudio";
export const gyroTransmitterBank: QuizBank = {
  "projectId": "gyro-transmitter",
  "title": "Gyro Transmitter",
  "sourcePdfPath": "public/Level 1/Learning/Sensor-Focused Robots/Gyro transmitter/Gyro transmitter_Powerpoint.pdf",
  "sourcePageCount": 17,
  "questions": [
    {
      "id": "gyro-transmitter-01",
      "topic": "gear-motion",
      "learningSlide": 7,
      "prompt": "What happens when the gyro's large driving gear turns a smaller gear?",
      "choices": [
        "The smaller gear stops",
        "Both gears become disconnected",
        "The large gear must reverse randomly",
        "The smaller gear spins faster"
      ],
      "correctIndex": 3,
      "explanation": "Slide 7 describes acceleration by transmitting motion through a large-to-small gear set.",
      "hint": "Think about how many turns the smaller gear makes for one turn of the larger gear."
    },
    {
      "id": "gyro-transmitter-02",
      "topic": "gear-motion",
      "learningSlide": 7,
      "prompt": "Which components are named in the gyro's accelerating mechanism?",
      "choices": [
        "Two speakers and a microphone",
        "Large gear, small gear and long shaft",
        "A camera and two lights",
        "A hydraulic pump and tube"
      ],
      "correctIndex": 1,
      "explanation": "The introduction describes two differently sized gears and a long shaft.",
      "hint": "Recall the parts transferring rotational energy to the gyro."
    },
    {
      "id": "gyro-transmitter-03",
      "topic": "drive-gear",
      "learningSlide": 6,
      "prompt": "Which value is used when comparing the speed of two meshing gears?",
      "choices": [
        "Number of gear teeth",
        "Color of the gears",
        "Length of the motor cable",
        "Weight of the RCU display"
      ],
      "correctIndex": 0,
      "explanation": "The lesson revisits gear ratios using tooth counts.",
      "hint": "Think about a measurement directly related to gear size."
    },
    {
      "id": "gyro-transmitter-04",
      "topic": "drive-gear",
      "learningSlide": 3,
      "prompt": "What calculation is identified as a learning difficulty?",
      "choices": [
        "Barometric pressure and altitude",
        "Sound frequency conversions",
        "Gear acceleration and deceleration ratios",
        "RGB color mixing"
      ],
      "correctIndex": 2,
      "explanation": "The learning target highlights calculating speed changes in gear sets.",
      "hint": "Think about calculating how rotating speeds change through gears."
    },
    {
      "id": "gyro-transmitter-05",
      "topic": "rotation",
      "learningSlide": 11,
      "prompt": "How do the first and last gears rotate relative to one another in an odd-numbered stage gear train, as described?",
      "choices": [
        "Always in the same direction",
        "They do not move",
        "In opposite directions",
        "Only the middle gear turns"
      ],
      "correctIndex": 2,
      "explanation": "Slide 11 says the direction is opposite for an odd number of transmission grades.",
      "hint": "Think about how each meshing pair reverses the direction."
    },
    {
      "id": "gyro-transmitter-06",
      "topic": "rotation",
      "learningSlide": 11,
      "prompt": "What direction relationship does the lesson give for even-numbered transmission grades?",
      "choices": [
        "The same rotational direction",
        "Always opposite direction",
        "No rotation possible",
        "Random direction every turn"
      ],
      "correctIndex": 0,
      "explanation": "The slide says an even number of grades produces the same direction.",
      "hint": "Count how many times motion reverses across the stages."
    },
    {
      "id": "gyro-transmitter-07",
      "topic": "stability",
      "learningSlide": 7,
      "prompt": "Why is the gyro's center of gravity set relatively low?",
      "choices": [
        "To make the gyro sound louder",
        "To help it stay stable while spinning",
        "To light up the RCU screen",
        "To prevent gear teeth from meshing"
      ],
      "correctIndex": 1,
      "explanation": "The gyro description connects a lower center of gravity with stability.",
      "hint": "Think about how a top-heavy spinning object behaves."
    },
    {
      "id": "gyro-transmitter-08",
      "topic": "stability",
      "learningSlide": 7,
      "prompt": "Why should the gyro's center of gravity not be too low according to the lesson?",
      "choices": [
        "The gear ratio becomes zero",
        "The sound output changes",
        "The sensor loses its address",
        "The model may hit the ground"
      ],
      "correctIndex": 3,
      "explanation": "The slide warns that too low a position can cause ground contact.",
      "hint": "Think about clearance below a moving part."
    },
    {
      "id": "gyro-transmitter-09",
      "topic": "assembly",
      "learningSlide": 13,
      "prompt": "Which is part of the gyro model's assembly requirements?",
      "choices": [
        "Loose frame",
        "Unmatched shape",
        "Unbalanced support",
        "Stable structure"
      ],
      "correctIndex": 3,
      "explanation": "The checklist includes structure stability and matching shape.",
      "hint": "Think about maintaining the gyro frame during rotation."
    },
    {
      "id": "gyro-transmitter-10",
      "topic": "assembly",
      "learningSlide": 16,
      "prompt": "What does the homework ask students to calculate about the gyro drive?",
      "choices": [
        "Room temperature",
        "Color of the lights",
        "Changes in speed through gear stages",
        "Total microphone sound level"
      ],
      "correctIndex": 2,
      "explanation": "The homework asks for speed changes, transmission grades, and driving/driven gears.",
      "hint": "Think about following rotational motion through several gears."
    }
  ]
};
