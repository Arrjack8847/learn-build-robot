/** Question facts and 1-based slide references reviewed against the official 23-page Level 6 Learning PDF text. */
import type { QuizBank } from "../../quizStudio";

export const interestingRotorBank: QuizBank = {
  "projectId": "level-6-the-interesting-rotor",
  "title": "The Interesting Rotor",
  "sourcePdfPath": "public/Level 6/Learning/Interactive Systems/The Interesting Rotor/19. The Interesting Rotor-Teaching Slides.pdf",
  "sourcePageCount": 23,
  "questions": [
    {
      "id": "theinte-01",
      "learningSlide": 5,
      "topic": "altitude-and-air-density",
      "prompt": "According to the lesson, approximately what proportion of sea-level air density remains at 4,000 metres?",
      "choices": [
        "10–20%",
        "30–40%",
        "60–70%",
        "90–100%"
      ],
      "correctIndex": 2,
      "hint": "The lesson gives a range between about half and three quarters.",
      "explanation": "Slide 5 states that air density at 4,000 m is approximately 60–70% of its sea-level value."
    },
    {
      "id": "theinte-02",
      "learningSlide": 8,
      "topic": "altitude-and-air-density",
      "prompt": "What happens to air density as air pressure becomes lower at higher altitude?",
      "choices": [
        "It becomes lower",
        "It stays exactly constant",
        "It always doubles",
        "It stops affecting flight"
      ],
      "correctIndex": 0,
      "hint": "The lesson links pressure and density when discussing higher altitude.",
      "explanation": "Slide 8 says lower air pressure corresponds to lower air density."
    },
    {
      "id": "theinte-03",
      "learningSlide": 8,
      "topic": "physical-rotor-lift",
      "prompt": "What produces the upward force that helps a helicopter fly?",
      "choices": [
        "A stationary wheel",
        "The screen's backlight",
        "The controller's battery label",
        "Rotating rotor blades driven by the engine"
      ],
      "correctIndex": 3,
      "hint": "Consider how powered rotation interacts with the air.",
      "explanation": "Slide 8 describes the engine turning the propeller to generate an upward pull."
    },
    {
      "id": "theinte-04",
      "learningSlide": 9,
      "topic": "physical-rotor-lift",
      "prompt": "When thinner air reduces rotor effectiveness, what might a helicopter need to do to maintain flight height?",
      "choices": [
        "Stop the engine",
        "Increase engine power and rotor speed",
        "Remove the rotor",
        "Reduce rotor speed to zero"
      ],
      "correctIndex": 1,
      "hint": "The lesson contrasts the work available in thinner air with the power needed to maintain flight.",
      "explanation": "Slide 9 says increased engine power and propeller speed help maintain distance and altitude."
    },
    {
      "id": "theinte-05",
      "learningSlide": 10,
      "topic": "simulated-altitude-control",
      "prompt": "Which measurement does the classroom helicopter model use to estimate its altitude?",
      "choices": [
        "Air pressure from a barometric sensor",
        "Color seen by a camera",
        "Sound level in the room",
        "Wheel rotation distance"
      ],
      "correctIndex": 0,
      "hint": "The model uses an environmental reading that changes with height.",
      "explanation": "Slide 10 says altitude is calculated using the air-pressure sensor."
    },
    {
      "id": "theinte-06",
      "learningSlide": 13,
      "topic": "simulated-altitude-control",
      "prompt": "In the lesson's original simulation, what rotor speed is chosen when the air-pressure difference is small?",
      "choices": [
        "Zero",
        "Slow",
        "Fast",
        "Reverse"
      ],
      "correctIndex": 2,
      "hint": "The first simulation intentionally uses a simplified, non-realistic control relationship.",
      "explanation": "Slide 13 specifies faster rotation when the pressure difference is small, representing low altitude."
    },
    {
      "id": "theinte-07",
      "learningSlide": 15,
      "topic": "initialization-and-ranges",
      "prompt": "What reference reading is stored during initial sensor setup?",
      "choices": [
        "The highest later altitude",
        "The last motor speed",
        "The robot's favourite colour",
        "Initial atmospheric pressure"
      ],
      "correctIndex": 3,
      "hint": "The program needs a baseline for comparing subsequent pressure readings.",
      "explanation": "Slide 15 instructs the program to initialize the sensor and store the initial atmospheric-pressure value."
    },
    {
      "id": "theinte-08",
      "learningSlide": 17,
      "topic": "initialization-and-ranges",
      "prompt": "In the original simulation, what happens when the difference in atmospheric pressure becomes large?",
      "choices": [
        "The motor stops",
        "The motor accelerates without limit",
        "The display turns into a camera",
        "The sensor measures humidity instead"
      ],
      "correctIndex": 0,
      "hint": "The lesson divides the simulated rotor response into three pressure-difference ranges.",
      "explanation": "Slide 17 says moderate differences slow the rotor and large differences return its speed to zero."
    },
    {
      "id": "theinte-09",
      "learningSlide": 21,
      "topic": "realistic-optimization",
      "prompt": "What change is requested to make the rotor simulation closer to the lesson's real-helicopter explanation?",
      "choices": [
        "Make rotor speed independent of altitude",
        "Make the rotor spin faster when altitude increases",
        "Make the motor stop at every height",
        "Ignore atmospheric pressure entirely"
      ],
      "correctIndex": 1,
      "hint": "The optimization reverses the original demonstration's simplified behaviour.",
      "explanation": "Slide 21 asks students to make the rotor faster at greater altitude, when atmospheric pressure is lower."
    },
    {
      "id": "theinte-10",
      "learningSlide": 21,
      "topic": "realistic-optimization",
      "prompt": "Why must the optimized rotor speed respond differently from the initial classroom demonstration?",
      "choices": [
        "The controller cannot read sensors",
        "The robot's colour changes with height",
        "The initial simulation was deliberately opposite to real-flight behaviour",
        "The original demonstration used no motor"
      ],
      "correctIndex": 2,
      "hint": "Compare the first simulation's stated purpose with the optimization goal.",
      "explanation": "Slide 21 requests a control relation consistent with reality; slide 10 notes that the initial simulation is deliberately opposite."
    }
  ]
};
