/** Verified against public/Level 2/Learning/Characters & Structures/Tower crane/Tower crane_Powerpoint.pdf (16 pages); slide numbers are 1-based. */
import type { QuizBank } from "../../quizStudio";
export const towerCraneBank: QuizBank = {
  "projectId": "level-2-tower-crane",
  "title": "Tower crane",
  "sourcePdfPath": "public/Level 2/Learning/Characters & Structures/Tower crane/Tower crane_Powerpoint.pdf",
  "sourcePageCount": 16,
  "questions": [
    {
      "id": "tc01",
      "topic": "tower-crane-purpose",
      "learningSlide": 6,
      "prompt": "Where does the lesson say tower cranes are usually used?",
      "choices": [
        "Underwater classrooms",
        "Passenger aircraft",
        "Kitchen counters",
        "Construction sites"
      ],
      "correctIndex": 3,
      "explanation": "Slide 6 associates heavy lifting by tower cranes with construction sites.",
      "hint": "Think of places where heavy building materials are raised."
    },
    {
      "id": "tc02",
      "topic": "tower-crane-purpose",
      "learningSlide": 6,
      "prompt": "How does the lesson contrast a mobile crane with a tower crane?",
      "choices": [
        "Mobile cranes can move between locations",
        "Tower cranes are small handheld tools",
        "Mobile cranes cannot lift any object",
        "Tower cranes always travel faster"
      ],
      "correctIndex": 0,
      "explanation": "The lesson contrasts movable cranes with tower cranes set at the construction site.",
      "hint": "Which machine is designed to relocate?"
    },
    {
      "id": "tc03",
      "topic": "pulley-groups",
      "learningSlide": 8,
      "prompt": "What is a pulley block?",
      "choices": [
        "A wooden hammer",
        "A system of multiple pulleys",
        "A single fixed gear tooth",
        "An electronic color sensor"
      ],
      "correctIndex": 1,
      "explanation": "Slide 8 defines pulley blocks as combinations of pulleys.",
      "hint": "A block has more than one pulley."
    },
    {
      "id": "tc04",
      "topic": "pulley-groups",
      "learningSlide": 8,
      "prompt": "Why combine fixed and movable pulleys?",
      "choices": [
        "To make gears disappear",
        "To convert light into sound",
        "To reduce pulling effort and change force direction",
        "To create battery voltage"
      ],
      "correctIndex": 2,
      "explanation": "Slide 8 describes both effort savings and changing direction.",
      "hint": "Think about pulling a heavy load on a rope."
    },
    {
      "id": "tc05",
      "topic": "mechanical-advantage",
      "learningSlide": 9,
      "prompt": "What helps determine how much effort a pulley block saves?",
      "choices": [
        "The paint color of the hook",
        "The height of the operator",
        "The number of lights on the crane",
        "The number of supporting rope segments"
      ],
      "correctIndex": 3,
      "explanation": "Slide 9 relates labor saving to the number of supporting rope strands.",
      "hint": "Focus on the ropes holding up the moving load."
    },
    {
      "id": "tc06",
      "topic": "mechanical-advantage",
      "learningSlide": 11,
      "prompt": "Why can't a pulley system save both effort and pulling distance?",
      "choices": [
        "Saving effort requires moving more rope",
        "The rope cannot move",
        "All pulleys make loads heavier",
        "Only motors can lift objects"
      ],
      "correctIndex": 0,
      "explanation": "The lesson warns about the trade-off between force and distance.",
      "hint": "If the load rises a little, how far might the rope end move?"
    },
    {
      "id": "tc07",
      "topic": "rope-distance",
      "learningSlide": 10,
      "prompt": "If a load rises 1 m with two supporting rope segments, how much rope does the free end move ideally?",
      "choices": [
        "4 m",
        "2 m",
        "0.5 m",
        "1 m"
      ],
      "correctIndex": 1,
      "explanation": "Using s = n × h, two segments times 1 m gives 2 m.",
      "hint": "Use the formula s = nh from slide 10."
    },
    {
      "id": "tc08",
      "topic": "rope-distance",
      "learningSlide": 10,
      "prompt": "In the slide's equation s = nh, what is h?",
      "choices": [
        "The mass of the motor",
        "The rope color",
        "The height the load is lifted",
        "The number of pulleys"
      ],
      "correctIndex": 2,
      "explanation": "Slide 10 defines h as the weight's lifting height.",
      "hint": "Identify the vertical movement of the object."
    },
    {
      "id": "tc09",
      "topic": "pulling-force",
      "learningSlide": 10,
      "prompt": "For an ideal two-strand pulley block lifting a 100 N total load, what pulling force does F = G/n give?",
      "choices": [
        "100 N",
        "200 N",
        "2 N",
        "50 N"
      ],
      "correctIndex": 3,
      "explanation": "Slide 10 gives F = Gtotal/n, so 100/2 = 50 N, ignoring friction.",
      "hint": "Divide the load by the number of supporting rope segments."
    },
    {
      "id": "tc10",
      "topic": "pulling-force",
      "learningSlide": 10,
      "prompt": "In the ideal relationship F = Gtotal/n, what happens to required pulling force as n increases?",
      "choices": [
        "It decreases",
        "It always increases",
        "It becomes zero for n = 2",
        "It never changes"
      ],
      "correctIndex": 0,
      "explanation": "More supporting rope segments share the load in the ideal lesson formula.",
      "hint": "Look at what happens when a divisor becomes larger."
    }
  ]
};
