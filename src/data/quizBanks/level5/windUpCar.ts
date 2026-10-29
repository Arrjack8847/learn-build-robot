/** Source: SHA-matched official Level 5 Learning PDF (33 pages). */
import type { QuizBank } from "../../quizStudio";

export const windUpCarBank: QuizBank = {
  "projectId": "level-5-wind-up-car",
  "title": "Wind-up Car",
  "sourcePdfPath": "public/Level 5/Learning/Vehicles & Complex Movers/Wind-up Car/05.Wind-up Car_Slides.pdf",
  "sourcePageCount": 33,
  "questions": [
    {
      "id": "level-5-wind-up-car-01",
      "topic": "spring-energy",
      "learningSlide": 3,
      "prompt": "What stores energy in a traditional wind-up toy?",
      "choices": [
        "A wound spring",
        "A camera lens",
        "A photoelectric detector",
        "A speaker"
      ],
      "correctIndex": 0,
      "hint": "A wound-up part supplies energy before release.",
      "explanation": "Slide 3 describes wind-up toys using a spring as their energy source."
    },
    {
      "id": "level-5-wind-up-car-02",
      "topic": "spring-energy",
      "learningSlide": 4,
      "prompt": "How is stored energy transferred to the wind-up toy car's wheels?",
      "choices": [
        "Through an ultrasonic sensor alone",
        "Through gears and chains after the spring is released",
        "By a QR-code scanner",
        "Only through the controller display"
      ],
      "correctIndex": 1,
      "hint": "Follow the energy path from spring to wheels.",
      "explanation": "Slide 4 links released spring energy to wheels via gears and chains."
    },
    {
      "id": "level-5-wind-up-car-03",
      "topic": "encoder-sensing",
      "learningSlide": 22,
      "prompt": "What does the motor encoder measure on the classroom wind-up car?",
      "choices": [
        "The weather outside",
        "The strength of the microphone",
        "The angle of motor rotation",
        "The wheel's color"
      ],
      "correctIndex": 2,
      "hint": "It counts shaft turning rather than sound.",
      "explanation": "Slide 22 describes the encoder as returning a motor-rotation angle."
    },
    {
      "id": "level-5-wind-up-car-04",
      "topic": "encoder-sensing",
      "learningSlide": 23,
      "prompt": "What can students do in the encoder test screen before comparing changes?",
      "choices": [
        "Remove the motor shaft",
        "Disable the controller storage",
        "Set every input to 1000",
        "Reset encoder values to zero"
      ],
      "correctIndex": 3,
      "hint": "Start measurements from a known reference.",
      "explanation": "Slide 23 offers resetting encoder values to zero during testing."
    },
    {
      "id": "level-5-wind-up-car-05",
      "topic": "charging-control",
      "learningSlide": 6,
      "prompt": "What does winding the model's handle do to its recorded energy value?",
      "choices": [
        "Increase it by turning the motor encoder",
        "Erase it immediately",
        "Force the motor to reverse forever",
        "Replace it with the screen color"
      ],
      "correctIndex": 0,
      "hint": "Winding increases the count of stored energy.",
      "explanation": "Slide 6 defines charging as turning the motor to increase its encoder value."
    },
    {
      "id": "level-5-wind-up-car-06",
      "topic": "charging-control",
      "learningSlide": 26,
      "prompt": "What is the maximum energy value in the classroom model?",
      "choices": [
        "1000",
        "360",
        "100",
        "4095"
      ],
      "correctIndex": 1,
      "hint": "One complete rotation is used as the ceiling.",
      "explanation": "Slide 26 caps energy at 360 and sounds the buzzer at the limit."
    },
    {
      "id": "level-5-wind-up-car-07",
      "topic": "release-program",
      "learningSlide": 27,
      "prompt": "What input releases the stored energy to drive the car?",
      "choices": [
        "A detected hand wave",
        "A rising barometric pressure",
        "Pressing the left button",
        "Scanning any QR code"
      ],
      "correctIndex": 2,
      "hint": "The model waits for a button after winding.",
      "explanation": "Slide 27 starts the travel loop when the left button is pressed."
    },
    {
      "id": "level-5-wind-up-car-08",
      "topic": "release-program",
      "learningSlide": 27,
      "prompt": "How is motor M2 speed calculated during the release loop?",
      "choices": [
        "Energy multiplied by 1000",
        "Always fixed at minus 360",
        "Independent of the energy variable",
        "Energy divided by 10"
      ],
      "correctIndex": 3,
      "hint": "The faster movement follows more stored energy.",
      "explanation": "Slide 27 sets motor M2 speed to energy divided by ten."
    },
    {
      "id": "level-5-wind-up-car-09",
      "topic": "advanced-motion",
      "learningSlide": 27,
      "prompt": "How does the program simulate energy being used while the car moves?",
      "choices": [
        "Decrease the energy variable by one each loop",
        "Increase energy indefinitely",
        "Keep energy constant after release",
        "Change every sensor value to zero"
      ],
      "correctIndex": 0,
      "hint": "The simulated spring unwinds with each movement step.",
      "explanation": "Slide 27 decrements energy until it reaches zero."
    },
    {
      "id": "level-5-wind-up-car-10",
      "topic": "advanced-motion",
      "learningSlide": 29,
      "prompt": "What additional effect does the wind-up car's expansion propose?",
      "choices": [
        "Only changing the display text",
        "Spring motion reversing as the car rolls forward",
        "Replacing the wheels with a touchscreen",
        "Always stopping after exactly one second"
      ],
      "correctIndex": 1,
      "hint": "The challenge models a spring unwinding as the car moves.",
      "explanation": "Slide 29 suggests reverse spring rotation during forward motion, with speed based on energy."
    }
  ]
};
