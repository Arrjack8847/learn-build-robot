/** Source-checked Level 3 Learning PDF questions; slides are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const sunflowerBank: QuizBank = {
  "projectId": "level-3-sunflower",
  "title": "Sunflower",
  "sourcePdfPath": "public/Level 3/Learning/Biomimicry & Stimulus Response/Sunflower/09.Sunflower.pdf",
  "sourcePageCount": 19,
  "questions": [
    {
      "id": "sun-01",
      "topic": "light-and-vision",
      "learningSlide": 6,
      "prompt": "What makes objects visible to us according to the lesson?",
      "choices": [
        "Light reflected from objects",
        "A sound produced by the object",
        "A magnetic pull",
        "The object's weight"
      ],
      "correctIndex": 0,
      "hint": "The introduction asks why we can see the colorful world.",
      "explanation": "Slide 6 explains that reflected light allows us to see objects."
    },
    {
      "id": "sun-02",
      "topic": "light-and-vision",
      "learningSlide": 6,
      "prompt": "What helps explain why different objects appear to have different colors?",
      "choices": [
        "They absorb light waves differently",
        "They all produce identical light",
        "They have different masses only",
        "Their motors spin at different speeds"
      ],
      "correctIndex": 0,
      "hint": "The lesson discusses absorbing and reflecting light.",
      "explanation": "Slide 6 links the visible world with differences in how objects absorb light waves."
    },
    {
      "id": "sun-03",
      "topic": "light-sensor-principle",
      "learningSlide": 9,
      "prompt": "What does a photosensitive sensor turn an optical signal into?",
      "choices": [
        "An electrical signal",
        "A mechanical gear",
        "A sound file",
        "A paper image"
      ],
      "correctIndex": 0,
      "hint": "The sensor transforms incoming light into usable electronic information.",
      "explanation": "Slide 9 defines photosensitive sensors as converting light signals to electrical signals."
    },
    {
      "id": "sun-04",
      "topic": "light-sensor-principle",
      "learningSlide": 9,
      "prompt": "Which other sensor can also be used as a light sensor, according to the lesson?",
      "choices": [
        "A color sensor",
        "A pressure gauge",
        "A gyroscope",
        "A wheel encoder"
      ],
      "correctIndex": 0,
      "hint": "Look for the alternative sensor named on the slide.",
      "explanation": "Slide 9 says a color sensor can serve as a light sensor."
    },
    {
      "id": "sun-05",
      "topic": "sensor-care",
      "learningSlide": 10,
      "prompt": "Which environment should be avoided when using the photosensitive sensor?",
      "choices": [
        "A humid environment",
        "A normal dry classroom",
        "A bright room",
        "An indoor desk"
      ],
      "correctIndex": 0,
      "hint": "The sensor-care page mentions moisture.",
      "explanation": "Slide 10 advises avoiding humid environments."
    },
    {
      "id": "sun-06",
      "topic": "sensor-care",
      "learningSlide": 10,
      "prompt": "Why should the photosensitive sensor surface be protected from damage and pollution?",
      "choices": [
        "They can affect the photocurrent",
        "They help it measure better",
        "They turn light into sound",
        "They make the motor spin faster"
      ],
      "correctIndex": 0,
      "hint": "The page connects surface condition to electrical sensing.",
      "explanation": "Slide 10 says surface damage and contamination affect the photocurrent."
    },
    {
      "id": "sun-07",
      "topic": "light-sensor-applications",
      "learningSlide": 11,
      "prompt": "Which household feature is mentioned as an application of photosensitive sensing?",
      "choices": [
        "Automatic television brightness adjustment",
        "Automatic water filtration",
        "Mechanical clock winding",
        "Air pressure calibration"
      ],
      "correctIndex": 0,
      "hint": "Think about an appliance adapting to light.",
      "explanation": "Slide 11 names automatic TV brightness adjustment."
    },
    {
      "id": "sun-08",
      "topic": "light-sensor-applications",
      "learningSlide": 11,
      "prompt": "How can a simple photosensitive resistor help an automatic lamp?",
      "choices": [
        "Sense light changes to help control switching",
        "Measure distance by ultrasound",
        "Produce music without speakers",
        "Detect touch pressure"
      ],
      "correctIndex": 0,
      "hint": "The lesson describes automatic LED switching.",
      "explanation": "Slide 11 says light-dependent electrical signals can be amplified to control lamps automatically."
    },
    {
      "id": "sun-09",
      "topic": "sunflower-response",
      "learningSlide": 7,
      "prompt": "What is the intended movement of the robot sunflower?",
      "choices": [
        "Turn toward the light",
        "Follow a black floor line",
        "Close when touched",
        "Avoid sound sources"
      ],
      "correctIndex": 0,
      "hint": "The model imitates how sunflowers face sunlight.",
      "explanation": "Slide 7 describes the robot turning toward light."
    },
    {
      "id": "sun-10",
      "topic": "sunflower-response",
      "learningSlide": 16,
      "prompt": "How does the sunflower program decide which way to turn its motor?",
      "choices": [
        "Compare light intensities on the two sides",
        "Select a random direction",
        "Read sound values only",
        "Count the floor tiles"
      ],
      "correctIndex": 0,
      "hint": "The task compares brightness from each side.",
      "explanation": "Slide 16 instructs comparing light intensity on both sides and turning toward the brighter side."
    }
  ]
};
