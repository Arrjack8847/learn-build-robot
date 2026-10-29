/** Source-checked questions from the 22-page official Level 5 Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const revolvingDoorBank: QuizBank = {
  "projectId": "level-5-revolving-door",
  "title": "Revolving Door",
  "sourcePdfPath": "public/Level 5/Learning/Mechanisms & Simulators/Revolving Door/15. Revolving Door-Teaching Slides.pdf",
  "sourcePageCount": 22,
  "questions": [
    {
      "id": "level-5-revolving-door-01",
      "topic": "crowd-flow",
      "learningSlide": 6,
      "prompt": "Why do some subway stations restrict the number of passengers entering during rush hour?",
      "choices": [
        "To reduce unsafe crowding on station facilities",
        "To make every train travel backward",
        "To stop passengers from using tickets",
        "To keep all platforms permanently empty"
      ],
      "correctIndex": 0,
      "hint": "Think about the station's limited capacity.",
      "explanation": "Slide 6 explains that when stations exceed their operating limits, passenger flow may be restricted to keep the station operating safely."
    },
    {
      "id": "level-5-revolving-door-02",
      "topic": "crowd-flow",
      "learningSlide": 8,
      "prompt": "What does extending a passenger's route to the carriage help the station do?",
      "choices": [
        "Increase the number of trains available instantly",
        "Manage how quickly passengers reach crowded platforms and carriages",
        "Measure magnetic field strength",
        "Make the trains move faster"
      ],
      "correctIndex": 1,
      "hint": "The flow-control measure changes the rate of arrivals.",
      "explanation": "Slide 8 describes extending the route or restricting entry to reduce pressure on crowded platforms and carriages."
    },
    {
      "id": "level-5-revolving-door-03",
      "topic": "manual-and-automatic-gates",
      "learningSlide": 9,
      "prompt": "How is the manually controlled subway passage opened in the lesson's example?",
      "choices": [
        "It stays open regardless of crowding",
        "Staff check conditions and open when capacity permits",
        "It opens only when the temperature is low",
        "Passengers always turn it themselves"
      ],
      "correctIndex": 1,
      "hint": "Staff decide based on the platform's situation.",
      "explanation": "Slide 9 says staff communicate about platform conditions and release passengers only when there is enough space."
    },
    {
      "id": "level-5-revolving-door-04",
      "topic": "manual-and-automatic-gates",
      "learningSlide": 11,
      "prompt": "Which sensor is part of the classroom flow-limiting revolving-door model?",
      "choices": [
        "Barometric sensor",
        "Magnetic pole sensor",
        "Infrared ranging sensor",
        "Ambient temperature sensor"
      ],
      "correctIndex": 2,
      "hint": "It detects when objects pass through the entrance.",
      "explanation": "Slide 11 identifies an infrared ranging sensor on the model."
    },
    {
      "id": "level-5-revolving-door-05",
      "topic": "passenger-counting",
      "learningSlide": 14,
      "prompt": "When the program detects that an object has passed, which values are increased?",
      "choices": [
        "Only elapsed time",
        "Current passenger flow and total passenger flow",
        "Only motor voltage",
        "Current humidity and temperature"
      ],
      "correctIndex": 1,
      "hint": "The program tracks both a short-term count and a cumulative count.",
      "explanation": "Slide 14 says to add one to both current and total passenger flow after a passage."
    },
    {
      "id": "level-5-revolving-door-06",
      "topic": "passenger-counting",
      "learningSlide": 15,
      "prompt": "Which passenger count does the lesson explicitly instruct the display to show?",
      "choices": [
        "Total passenger traffic",
        "Total distance in kilometers",
        "Temperature below freezing",
        "The seat cabin speed"
      ],
      "correctIndex": 0,
      "hint": "One value accumulates across passages.",
      "explanation": "Slide 15 instructs students to display the total passenger traffic data."
    },
    {
      "id": "level-5-revolving-door-07",
      "topic": "gate-control",
      "learningSlide": 12,
      "prompt": "What is the automated door's response to passenger flow becoming too high?",
      "choices": [
        "Increase rotation without limit",
        "Stop the door and resume after waiting",
        "Ignore the sensor entirely",
        "Change the display to a different language"
      ],
      "correctIndex": 1,
      "hint": "The robot temporarily limits access.",
      "explanation": "Slide 12 states that the revolving door stops when too many passengers are counted and opens again after a waiting period."
    },
    {
      "id": "level-5-revolving-door-08",
      "topic": "gate-control",
      "learningSlide": 16,
      "prompt": "What should happen to the current passenger-flow count before the gate begins its next operating cycle?",
      "choices": [
        "It should be doubled",
        "It should be reset to zero",
        "It should be stored only as a motor speed",
        "It should always remain above the threshold"
      ],
      "correctIndex": 1,
      "hint": "The cycle needs a fresh short-term count.",
      "explanation": "Slide 16 says to reset current passenger flow to zero before turning again."
    },
    {
      "id": "level-5-revolving-door-09",
      "topic": "optimization-and-analogy",
      "learningSlide": 20,
      "prompt": "What change is proposed to allow more guests through before the revolving door pauses?",
      "choices": [
        "Modify the stop-time parameters to permit longer rotation",
        "Remove the sensor and all controls",
        "Reset the total count after every person",
        "Set the motor permanently to zero"
      ],
      "correctIndex": 0,
      "hint": "Look for the adjustment that increases operating time.",
      "explanation": "Slide 20 asks students to modify closing parameters so the door can rotate longer."
    },
    {
      "id": "level-5-revolving-door-10",
      "topic": "optimization-and-analogy",
      "learningSlide": 21,
      "prompt": "What other system does the lesson compare to a passenger-flow-limited gate?",
      "choices": [
        "A website that queues requests during very heavy traffic",
        "A light that senses color",
        "A pendulum with no control",
        "A battery that stores sound"
      ],
      "correctIndex": 0,
      "hint": "The analogy controls a large number of arrivals.",
      "explanation": "Slide 21 compares crowd limiting with websites restricting and queuing excessive traffic to avoid overload."
    }
  ]
};
