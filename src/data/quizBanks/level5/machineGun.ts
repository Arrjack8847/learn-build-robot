/** Official Level 5 Learning PDF: 35 pages, Git blob identity verified. */
import type { QuizBank } from "../../quizStudio";

export const machineGunBank: QuizBank = {
  "projectId": "level-5-machine-gun",
  "title": "Machine Gun (Simulation)",
  "sourcePdfPath": "public/Level 5/Learning/Mechanisms & Simulators/Machine Gun/10.Machine Gun-Slides.pdf",
  "sourcePageCount": 35,
  "questions": [
    {
      "id": "level-5-machine-gun-01",
      "topic": "overheating",
      "learningSlide": 4,
      "prompt": "What can happen when a real machine gun's barrel overheats, according to the background section?",
      "choices": [
        "Wear and jamming become more likely",
        "It becomes a cooler flashlight",
        "All friction disappears",
        "It instantly recharges its battery"
      ],
      "correctIndex": 0,
      "hint": "The lesson highlights overheating hazards.",
      "explanation": "Slide 4 describes increased wear and possible jamming from excessive heat."
    },
    {
      "id": "level-5-machine-gun-02",
      "topic": "overheating",
      "learningSlide": 6,
      "prompt": "Why does the classroom model track a temperature variable during repeated simulated firing?",
      "choices": [
        "To calculate the bullet's mass",
        "To model an automatic overheat shutdown",
        "To measure the room's humidity",
        "To change the color of targets"
      ],
      "correctIndex": 1,
      "hint": "The model stops when its simulated temperature rises.",
      "explanation": "Slide 6 specifies stopping the simulated action when the temperature rises too much."
    },
    {
      "id": "level-5-machine-gun-03",
      "topic": "touch-control",
      "learningSlide": 6,
      "prompt": "Which input starts the classroom simulation's motorized action?",
      "choices": [
        "Barometric sensor",
        "Ambient microphone",
        "Pressed touch sensor",
        "GPS satellite"
      ],
      "correctIndex": 2,
      "hint": "The model uses a button.",
      "explanation": "Slide 6 uses a touch-sensor button to control the simulated firing action."
    },
    {
      "id": "level-5-machine-gun-04",
      "topic": "touch-control",
      "learningSlide": 24,
      "prompt": "What happens when the user releases the simulated firing button?",
      "choices": [
        "The motor spins faster automatically",
        "Temperature rises without limit",
        "The sound sensor takes over",
        "The modeled firing action stops"
      ],
      "correctIndex": 3,
      "hint": "Read the flowchart's stop conditions.",
      "explanation": "Slide 24 stops simulated operation when the button is released."
    },
    {
      "id": "level-5-machine-gun-05",
      "topic": "or-logic",
      "learningSlide": 25,
      "prompt": "When is a logical OR condition true?",
      "choices": [
        "When at least one input condition is true",
        "Only if every input condition is true",
        "Only if all input conditions are false",
        "Only if a counter equals zero"
      ],
      "correctIndex": 0,
      "hint": "One true check is sufficient.",
      "explanation": "Slide 25 teaches OR using a decision table where either condition can satisfy the overall test."
    },
    {
      "id": "level-5-machine-gun-06",
      "topic": "or-logic",
      "learningSlide": 26,
      "prompt": "Why does OR work for two alternative shutdown triggers?",
      "choices": [
        "It guarantees the motor runs forever",
        "Either a released button or excessive temperature can stop the simulation",
        "It requires both signals to be identical",
        "It removes the need for a control loop"
      ],
      "correctIndex": 1,
      "hint": "Either warning should be enough to stop an action.",
      "explanation": "Slide 26 defines OR logic as satisfied if one of its two checks is met."
    },
    {
      "id": "level-5-machine-gun-07",
      "topic": "temperature-counter",
      "learningSlide": 27,
      "prompt": "Under what temperature value can the model continue when the touch input is pressed?",
      "choices": [
        "Exactly 500",
        "Below minus 100",
        "Below 100",
        "Above 1,000"
      ],
      "correctIndex": 2,
      "hint": "Look for the simulation's upper limit.",
      "explanation": "Slide 27 checks that the temperature variable is less than 100."
    },
    {
      "id": "level-5-machine-gun-08",
      "topic": "temperature-counter",
      "learningSlide": 28,
      "prompt": "How much is added to the temperature variable every 0.5 seconds of operation?",
      "choices": [
        "1,000",
        "0.1",
        "100",
        "10"
      ],
      "correctIndex": 3,
      "hint": "Read the increment in the simulated heating loop.",
      "explanation": "Slide 28 increments the model's temperature by 10 every 0.5 seconds."
    },
    {
      "id": "level-5-machine-gun-09",
      "topic": "simulation-extension",
      "learningSlide": 29,
      "prompt": "How does the simulated temperature cool while above zero?",
      "choices": [
        "It decreases by 10 after one second",
        "It increases by 10 continuously",
        "It becomes permanently locked at 100",
        "It is ignored by the program"
      ],
      "correctIndex": 0,
      "hint": "The variable represents gradual cooldown.",
      "explanation": "Slide 29 decreases temperature by 10 after a one-second interval when above zero."
    },
    {
      "id": "level-5-machine-gun-10",
      "topic": "simulation-extension",
      "learningSlide": 31,
      "prompt": "Which program value can simulate remaining ammunition in the extension?",
      "choices": [
        "A photoelectric distance reading",
        "Motor encoder count",
        "Ambient humidity",
        "A fixed LED color"
      ],
      "correctIndex": 1,
      "hint": "Think of counting motor movements.",
      "explanation": "Slide 31 proposes using the motor encoder value to represent a simulated round count."
    }
  ]
};
