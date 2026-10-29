/** Ten questions checked against the official 23-page Level 5 Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const magneticObjectFinderBank: QuizBank = {
  "projectId": "level-5-magnetic-object-finder",
  "title": "Magnetic Object Finder",
  "sourcePdfPath": "public/Level 5/Learning/Interactive Mechanisms/Magnetic Object Finder/07. Magnetic Object Finder-Teaching Slides.pdf",
  "sourcePageCount": 23,
  "questions": [
    {
      "id": "level-5-magnetic-object-finder-01",
      "topic": "magnetic-poles",
      "learningSlide": 7,
      "prompt": "What happens when two like magnetic poles are brought close together?",
      "choices": [
        "They repel one another",
        "They always attract",
        "They stop producing magnetic fields",
        "They turn into electric charges"
      ],
      "correctIndex": 0,
      "hint": "Compare north facing north with north facing south.",
      "explanation": "Slide 7 states that like magnetic poles repel each other."
    },
    {
      "id": "level-5-magnetic-object-finder-02",
      "topic": "magnetic-poles",
      "learningSlide": 7,
      "prompt": "What happens when a north magnetic pole approaches a south magnetic pole?",
      "choices": [
        "They repel more strongly than like poles",
        "They attract each other",
        "Both poles disappear",
        "The magnets have no interaction"
      ],
      "correctIndex": 1,
      "hint": "Different poles behave differently from like poles.",
      "explanation": "Slide 7 says opposite magnetic poles attract."
    },
    {
      "id": "level-5-magnetic-object-finder-03",
      "topic": "sensor-operation",
      "learningSlide": 9,
      "prompt": "Which two detection modes are described for the magnetic sensor?",
      "choices": [
        "Color and temperature",
        "Pressure and altitude",
        "Magnetic field strength and magnetic field direction",
        "Wheel rotation and laser distance"
      ],
      "correctIndex": 2,
      "hint": "One mode gives a strength value and another gives polarity.",
      "explanation": "Slide 9 describes modes for magnetic intensity and magnetic field direction."
    },
    {
      "id": "level-5-magnetic-object-finder-04",
      "topic": "sensor-operation",
      "learningSlide": 9,
      "prompt": "What does a magnetic direction reading of 2 indicate in this lesson?",
      "choices": [
        "Magnetic intensity is exactly two units",
        "No nearby magnet",
        "The south pole is nearby",
        "The north pole is nearby"
      ],
      "correctIndex": 3,
      "hint": "The direction codes are 0, 1, and 2.",
      "explanation": "Slide 9 maps direction code 2 to the north magnetic pole being close."
    },
    {
      "id": "level-5-magnetic-object-finder-05",
      "topic": "field-readings",
      "learningSlide": 9,
      "prompt": "What output range is specified for the magnetic-field intensity mode?",
      "choices": [
        "0 to 2000",
        "-100 to 100",
        "1000 to 5000",
        "0 to 2"
      ],
      "correctIndex": 0,
      "hint": "This is the strength number, not the polarity code.",
      "explanation": "Slide 9 gives the field-intensity reading range as 0–2000."
    },
    {
      "id": "level-5-magnetic-object-finder-06",
      "topic": "field-readings",
      "learningSlide": 10,
      "prompt": "Why might the magnetic sensor show a small nonzero reading when no magnet is placed beside it?",
      "choices": [
        "A magnet must be hidden in every desk",
        "Earth itself has a magnetic field",
        "The sensor is measuring the room's clock",
        "The controller always adds exactly 2000"
      ],
      "correctIndex": 1,
      "hint": "Think about a natural magnetic field around the planet.",
      "explanation": "Slide 10 warns that Earth's magnetic field can create a reading of tens even without a nearby magnet."
    },
    {
      "id": "level-5-magnetic-object-finder-07",
      "topic": "sound-feedback",
      "learningSlide": 16,
      "prompt": "What warning sound pattern does the example program assign to a field strength between 400 and 1200?",
      "choices": [
        "A continuous music track",
        "No sound ever",
        "A long-pause tone",
        "A short-pause tone"
      ],
      "correctIndex": 2,
      "hint": "The two sound patterns differ in the pause length.",
      "explanation": "Slide 16 specifies a long-pause tone for strength values between 400 and 1200."
    },
    {
      "id": "level-5-magnetic-object-finder-08",
      "topic": "sound-feedback",
      "learningSlide": 16,
      "prompt": "What sound pattern is triggered when the magnetic field strength exceeds 1200?",
      "choices": [
        "A long-pause tone",
        "A spoken temperature value",
        "The same sound as zero strength",
        "A short-pause tone"
      ],
      "correctIndex": 3,
      "hint": "The stronger case gets the shorter pause.",
      "explanation": "Slide 16 specifies a short-pause tone above 1200."
    },
    {
      "id": "level-5-magnetic-object-finder-09",
      "topic": "display-and-optimization",
      "learningSlide": 14,
      "prompt": "How does the sample program arrange magnetic sensor information on the screen?",
      "choices": [
        "Direction on line one and intensity on line two",
        "Only a picture, with no sensor readings",
        "Strength first, time second",
        "Temperature first, pressure second"
      ],
      "correctIndex": 0,
      "hint": "There are two lines for two different types of data.",
      "explanation": "Slide 14 places direction on the first line and field intensity on the second."
    },
    {
      "id": "level-5-magnetic-object-finder-10",
      "topic": "display-and-optimization",
      "learningSlide": 21,
      "prompt": "What adjustment does the extension activity recommend when the finder beeps for distant targets?",
      "choices": [
        "Remove the entire judgment step",
        "Adjust the sound-triggering threshold values",
        "Increase the screen font size only",
        "Change the detector's name"
      ],
      "correctIndex": 1,
      "hint": "The sound is controlled by threshold comparisons.",
      "explanation": "Slide 21 asks students to optimize the decision values so it does not beep when a magnet is too far away."
    }
  ]
};
