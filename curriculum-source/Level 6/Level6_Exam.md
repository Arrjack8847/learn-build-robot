LEVEL 6 EXAM — BSR ROBOTICS SYLLABUS
======================================

Based on Level 6 lessons: Ball Tracking, Smart Camera (Face Detection),
Finger-guessing / Rock-paper-scissors Robot, Colorblind Assistant Robot,
Product Search (Lists), Intelligent Sorting Machine, Autonomous Driving,
and the Robotic Arm.

Name: ____________________     Date: ____________     Score: ______ / 100


SECTION A: MULTIPLE CHOICE (15 questions)
Instructions: Circle the letter of the best answer. (4 marks each)

1. The AI audio-visual (AI vision) module taught in Level 6 combines which two
   main hardware components?
   A. An HD camera and a voice collector
   B. An ultrasonic sensor and a gyroscope
   C. A colour sensor and a touch sensor
   D. A buzzer and an LED matrix

2. In the Ball Tracking lesson, the AI module is switched into "blob (ball)
   recognition" mode. By default, which coloured ball does it recognise?
   A. A blue ball
   B. A red ball
   C. A green ball
   D. A yellow ball

3. In the Ball Tracking program, the X-axis and Y-axis variables store the
   ball's position. What does an X value of 0 mean, and what should happen?
   A. The ball is in the centre, so the robot drives straight
   B. The ball is on the far right, so the robot turns right
   C. No ball is detected, so motors M1 and M2 stop
   D. The camera has failed and must be restarted

4. The Ball Tracking robot calculates turning with the formula
   turn = (X-axis − 90) × K1. What does the number 90 represent?
   A. The motor speed limit
   B. The horizontal target/centre position the ball should be held at
   C. The maximum X-coordinate the camera can return
   D. The gain that slows the motors down

5. In the Ball Tracking program the variables are set to K1 = 0.3 and
   K2 = −0.3. What is the role of K1 and K2 in the control formulas?
   A. They are the camera's coordinate ranges
   B. They are gain (proportionality) constants that scale how strongly the
      error changes the motor speed
   C. They are the port numbers for the motors
   D. They store the random numbers used for guessing

6. In Ball Tracking, the motor speeds are set to M1 = Go + turn and
   M2 = Go − turn. Why are "turn" and "Go" combined this way on the two motors?
   A. To make both wheels always spin at the same speed
   B. So "Go" drives forward/back while "turn" steers left/right by speeding up
      one wheel and slowing the other
   C. To stop the robot whenever a ball appears
   D. To convert the X-coordinate into a Y-coordinate

7. In the Smart Camera (face detection) lesson, the module returns face
   coordinates on its screen. What are the coordinate ranges?
   A. X: 0–160 and Y: 0–120
   B. X: 0–240 and Y: 0–180
   C. X: −120 to 120 only
   D. X: 0–100 and Y: 0–100

8. In the Smart Camera lesson the camera at first "rotates too fast and cannot
   track the face." How does the program fix this?
   A. By increasing the motor port voltage
   B. By multiplying the turn value by the gain variable K1 (0.3) to slow the
      rotation
   C. By switching the module to road-recognition mode
   D. By stopping the camera whenever X = 0

9. The AI module has three built-in gesture models used by the Finger-guessing
   and Rock-paper-scissors robots. What does the module return when it
   recognises rock, paper, or scissors?
   A. The X and Y coordinates of the hand
   B. A gesture ID value (e.g. ID1, ID2, ID3)
   C. A Boolean true/false only
   D. The RGB colour of the hand

10. In the guessing-robot program, Result = ID − (random number 1–3).
    According to the lesson's win/lose table, which Result values mean the
    robot/player WINS?
    A. Result = 0
    B. Result = 1 or −2
    C. Result = −1 or 2
    D. Result = 3 only

11. The Product Search lesson introduces "lists." Why is a list used instead of
    ordinary variables to store the product information?
    A. A list runs faster than the motors
    B. A list can hold many pieces of data together, like a row of cabinets with
       many grids, while one variable holds only one value
    C. A list is the only block that can read a colour sensor
    D. A list automatically connects to the AI vision module

12. In the Intelligent Sorting Machine lesson, the "image classification (ID)"
    coding block returns a value. What is returned when NO learned image is
    recognised?
    A. The block returns −1
    B. The block returns 0
    C. The block returns 240
    D. The block returns the last ID seen

13. The Intelligent Sorting lesson explains how to teach the module. What is the
    correct image-learning procedure?
    A. Photograph one object once and start immediately
    B. Choose three objects (Learning ID 1, 2, 3), photograph each, then take
       about nine more photos as a training collection
    C. Type the product names into a list by hand
    D. Scan a barcode with a touch sensor

14. In the Autonomous Driving lesson, the robot reads a road-recognition
    "result." Using the lesson's thresholds, what does the robot do when the
    result is between 110 and 130?
    A. It turns left
    B. It turns right
    C. It moves straight forward (road is in the middle)
    D. It stops and reverses

15. In the Colorblind Assistant Robot lesson, the "colour recognition learning"
    coding block reports whether a learned colour is present. What kind of value
    does it return?
    A. A coordinate from 0 to 240
    B. A Boolean value: 1 or 0
    C. A list of RGB numbers
    D. A motor angle in degrees

--------------------------------------------------------------------------------

SECTION B: ESSAY (5 questions)
Instructions: Answer each question in 3–5 sentences. (8 marks each)

16. In the Ball Tracking (and Smart Camera) control system, the program first
    works out an "error" such as (X-axis − 90). Explain the role of this error
    value and describe how it flows through the gain K and the turn/Go variables
    to change the motor output. Why does the robot slow down or steer more gently
    as the ball gets closer to the target position?

17. The Product Search lesson teaches the difference between a variable and a
    list. Explain what a list is, why it is needed to store product information
    (number, name, price), and how the item numbers in a list correspond to the
    stored content. Give an example using the "chocolate" and "potato chips"
    products from the lesson.

18. Several Level 6 projects (the reset function in the Colorblind / guessing
    robots, and the "grab at point" function in the Intelligent Sorting Machine)
    use custom sub-functions. Explain what a sub-function is, why programmers
    create them in these complex programs, and at least two benefits compared to
    writing all the code in one long block.

19. SCENARIO — Your ball-tracking robot loses the target when the ball moves to
    the far left of the camera frame. The AI module still returns X/Y
    coordinates, but the motors do not respond correctly beyond a certain range.
    Walk through, step by step, how you would diagnose and fix this issue.
    Refer to the coordinate range (X: 0–160), the target value (90), the gain
    K1, the "X = 0 means no ball" check, and the motor formulas in your answer.

20. SCENARIO — Your autonomous-driving robot keeps swinging left and right and
    never settles into driving straight, even on a straight road. Using the
    lesson's road-recognition logic (turn left if result < 110, turn right if
    result > 130, go straight if the result is between 110 and 130), explain what
    could be causing the oscillation and describe at least two changes you would
    make to the program so the robot drives smoothly down the middle of the road.

================================================================================

ANSWER KEY
==========

Multiple Choice:
1.  A   (AI module = HD camera + voice collector)
2.  B   (blob recognition recognises a red ball by default)
3.  C   (X = 0 → no ball detected → motors M1 and M2 stop)
4.  B   (90 is the horizontal target/centre position for the ball)
5.  B   (K1/K2 are gain/proportionality constants scaling the error)
6.  B   (Go = forward/back, turn = steering by differencing the two wheels)
7.  B   (Face detection: X 0–240, Y 0–180; 240×240 screen)
8.  B   (Multiply turn by K1 = 0.3 to slow the rotation)
9.  B   (Returns a gesture ID value: ID1/ID2/ID3)
10. C   (Win when Result = −1 or 2; lose when 1 or −2; draw when 0)
11. B   (A list stores many values together; a variable holds only one)
12. B   (Image classification block returns 0 when nothing is recognised; range 0–4)
13. B   (3 objects as Learning ID 1–3, photograph each, plus ~9 training photos)
14. C   (Result 110–130 → in the middle → drive forward)
15. B   (Colour recognition learning returns a Boolean 1 or 0)

Essay (suggested answer points):

16. Look for: the error = how far the ball is from the target (X − 90, or
    Y − 65); a positive/negative error tells direction. The error is multiplied
    by the gain K (K1 = 0.3, K2 = −0.3) to produce "turn" and "Go," which are
    added/subtracted to set M1 and M2 speeds. As the ball nears the target the
    error shrinks toward 0, so turn/Go shrink and the robot moves more gently;
    at the exact target the error is 0 and the correction stops. This is
    proportional (PID-like) control — bigger error → stronger response.

17. Look for: a variable holds only one piece of data, so many variables would
    be needed; a list is a collection that stores many values together (the
    "cabinet with many grids" analogy). The list lets product number, name and
    price be stored and looked up. Item numbers (index/position) map to content:
    e.g. position 1 → "chocolate" (red block), position 2 → "potato chips"
    (green block); reading item 1 of each list returns chocolate's number, name
    and price. Mentions creating the list via Variables → "Make a list" and the
    "add ( ) to ( )" block.

18. Look for: a sub-function is a named block of code that can be called
    (reused) elsewhere, e.g. "reset" to return the pointer, or "grab at point."
    Programmers create them to break a large, complex program into manageable
    pieces. Benefits (any two): avoids repeating the same code, makes the main
    program shorter and easier to read, easier to debug/modify in one place,
    and lets the same routine be called multiple times with one block.

19. Look for a logical diagnostic sequence such as: (1) Confirm the AI module is
    in blob/ball recognition mode and still returning X/Y (read the values on
    screen). (2) Check the "X = 0 means no ball → stop" condition isn't firing
    incorrectly when the ball is at the edge (X can legitimately be small near
    the left). (3) Recognise that at the far left X approaches the low end of
    the 0–160 range, so error (X − 90) becomes a large negative number; verify
    the turn formula and gain K1 actually drive the motors in the correct
    direction and aren't being clamped/limited. (4) Test/adjust: ensure the
    target value (90) and gain are right, make sure motors are on the correct
    M1/M2 ports with M1 = Go + turn and M2 = Go − turn, and consider that the
    ball may simply be leaving the camera's field of view at the extreme left.
    A strong answer separates "no-ball logic," "coordinate/error maths," and
    "motor wiring/direction" as possible causes.

20. Look for: the oscillation comes from over-correcting — the result hovers near
    the 110/130 boundaries, so the robot keeps flipping between "turn left" and
    "turn right" and rarely stays in the 110–130 straight band. Fixes (any two):
    widen the straight-ahead band (e.g. accept a larger middle range so small
    deviations go straight), reduce the turning speed/strength (use a gain to
    make corrections gentler, like the K1 idea from Smart Camera), add a
    proportional turn based on how far the result is from 120 instead of a fixed
    hard left/right, or smooth/average the readings. The key idea: gentler,
    proportional correction and a wider centre zone stop the left-right swinging.

================================================================================
END OF EXAM
