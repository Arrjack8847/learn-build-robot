/** Official Level 5 Learning PDF: 25 pages, Git blob identity verified. */
import type { QuizBank } from "../../quizStudio";

export const drawingMachineBank: QuizBank = {
  "projectId": "level-5-drawing-machine",
  "title": "Drawing Machine",
  "sourcePdfPath": "public/Level 5/Learning/Action-Oriented/Drawing Machine/23. Drawing Machine-Teaching Slides.pdf",
  "sourcePageCount": 25,
  "questions": [
    {
      "id": "level-5-drawing-machine-01",
      "topic": "digital-drawing",
      "learningSlide": 6,
      "prompt": "Why can computer-controlled drawing machines make highly precise images?",
      "choices": [
        "They provide stable, accurately controlled movements",
        "They always use more paint",
        "They do not need motors",
        "They randomly move the paper"
      ],
      "correctIndex": 0,
      "hint": "Think about what machines can repeat consistently.",
      "explanation": "Slide 6 links computer drawing to stable, accurate motion control."
    },
    {
      "id": "level-5-drawing-machine-02",
      "topic": "digital-drawing",
      "learningSlide": 7,
      "prompt": "Which device is listed as a common way of drawing a digital design on paper?",
      "choices": [
        "Optical telescope",
        "Plotter",
        "Loudspeaker",
        "Thermometer"
      ],
      "correctIndex": 1,
      "hint": "Look for a machine that draws physical output.",
      "explanation": "Slide 7 lists printers and plotters as machines that put drawings onto paper."
    },
    {
      "id": "level-5-drawing-machine-03",
      "topic": "plotter-axes",
      "learningSlide": 9,
      "prompt": "Which directions are controlled by plotter motors for moving a drawing tool?",
      "choices": [
        "Only clockwise circles",
        "Only left and right audio channels",
        "X and Y directions",
        "Only the vertical Z direction"
      ],
      "correctIndex": 2,
      "hint": "Think about the two axes of a flat drawing surface.",
      "explanation": "Slide 9 says a computer-controlled plotter moves its motors in the X and Y directions."
    },
    {
      "id": "level-5-drawing-machine-04",
      "topic": "plotter-axes",
      "learningSlide": 9,
      "prompt": "How does a computer tell a plotter to draw different lines?",
      "choices": [
        "By changing sunlight",
        "By disconnecting all controls",
        "By waiting for random ink splashes",
        "By sending different movement instructions to motors"
      ],
      "correctIndex": 3,
      "hint": "Consider what controls a plotter's motion.",
      "explanation": "Slide 9 describes motor actions determined by different computer instructions."
    },
    {
      "id": "level-5-drawing-machine-05",
      "topic": "linkage-paths",
      "learningSlide": 10,
      "prompt": "What determines the brush's repeated path when the motor turns the linkage?",
      "choices": [
        "The linkage mechanism's movement",
        "The room's temperature",
        "The paper's printed color",
        "The screen's battery percentage"
      ],
      "correctIndex": 0,
      "hint": "Read what happens when the linkage rotates.",
      "explanation": "Slide 10 says the motor-driven linkage produces a fixed brush trajectory for drawing a pattern."
    },
    {
      "id": "level-5-drawing-machine-06",
      "topic": "linkage-paths",
      "learningSlide": 11,
      "prompt": "What can happen when the drawing board also rotates?",
      "choices": [
        "The drawing disappears from the paper",
        "The repeated graphic can be stretched",
        "The brush stops drawing permanently",
        "The machine becomes a printer with no motor"
      ],
      "correctIndex": 1,
      "hint": "Combine brush motion with a moving paper surface.",
      "explanation": "Slide 11 explains that turning the drawing board stretches a single repeated figure."
    },
    {
      "id": "level-5-drawing-machine-07",
      "topic": "motor-controls",
      "learningSlide": 15,
      "prompt": "Which motor controls the drawing disc in the practice setup?",
      "choices": [
        "Motorless spring",
        "A color sensor",
        "Medium motor",
        "Large motor only"
      ],
      "correctIndex": 2,
      "hint": "The flowchart distinguishes two motor sizes.",
      "explanation": "Slide 15 assigns the medium motor to the disc and the large motor to the linkage."
    },
    {
      "id": "level-5-drawing-machine-08",
      "topic": "motor-controls",
      "learningSlide": 17,
      "prompt": "Which controls adjust brush and drawing-board speeds in the lesson?",
      "choices": [
        "The camera lens",
        "The speaker volume",
        "A temperature threshold",
        "Controller left and right buttons"
      ],
      "correctIndex": 3,
      "hint": "Look for two controls managing two speed values.",
      "explanation": "Slide 17 uses the controller's left and right buttons to adjust brush and board speeds."
    },
    {
      "id": "level-5-drawing-machine-09",
      "topic": "switch-logic",
      "learningSlide": 18,
      "prompt": "How does the practice track repeated touchscreen presses?",
      "choices": [
        "Increment a switch variable after each touch and release",
        "Erase the speed variables after each touch",
        "Disconnect the motors",
        "Randomize all output ports"
      ],
      "correctIndex": 0,
      "hint": "A variable counts completed touch actions.",
      "explanation": "Slide 18 increases the switch variable by one after every touch-and-release action."
    },
    {
      "id": "level-5-drawing-machine-10",
      "topic": "switch-logic",
      "learningSlide": 19,
      "prompt": "When does the practice's switch program start drawing?",
      "choices": [
        "Whenever the button has never been touched",
        "When the switch variable's remainder after division by 2 is 1",
        "Only when the remainder is 0",
        "When both motors are disconnected"
      ],
      "correctIndex": 1,
      "hint": "A remainder alternates between two values.",
      "explanation": "Slide 19 uses the switch variable modulo two; remainder 1 means drawing starts."
    }
  ]
};
