# LEVEL 5 EXAM — BSR ROBOTICS SYLLABUS

**Name: _______________________  Date: ____________  Score: ______ / 20**

*This exam is based on Level 5 lessons: Face Tracking, Autonomous Driving, Traffic Signs, Facial Recognition Time Clock, Lucky Prize Wheel (gesture sensor), Hexapod Robot, and Voice Control Snail.*

======================================

## SECTION A: MULTIPLE CHOICE (15 questions)

**Instructions: Circle the letter of the best answer.**

1. In the Face Tracking lesson, when the AI audio-visual module is set to face detection mode and captures a face, what data does it return to the controller?

   A. The colour and brightness of the face
   B. The X and Y coordinate values of the face
   C. The name of the person detected
   D. The distance of the face in centimetres

2. On the AI module's face-detection screen, where is the coordinate origin (0, 0) located and what is the range of the X (horizontal) coordinate?

   A. Centre of the screen, X range 0–150
   B. Lower-left corner, X range 0–160
   C. Upper-left corner, X range 0–240
   D. Upper-right corner, X range 0–120

3. Your face-tracking robot turns left and right too violently and overshoots the face. In the program, the turn amount is calculated as (X − 150) × K1 with K1 set to 0.3. What is the purpose of multiplying by K1?

   A. To convert the coordinate into centimetres
   B. To slow down and smooth the turning speed so the robot does not overshoot
   C. To make the motors spin faster
   D. To switch the module into face-detection mode

4. In the face-tracking program, the variable X stores the face's X coordinate. If X = 0, what does this mean and what should the motors M1 and M2 do?

   A. The face is in the middle; the motors speed up
   B. No face is detected; the motors stop
   C. The face is on the far right; the motors reverse
   D. The battery is low; the motors brake

5. In the Autonomous Driving lesson, the AI module uses road-recognition mode. What offset value is shown when the road is in the middle (the baseline is centred)?

   A. 0
   B. 60
   C. 120
   D. 240

6. While testing your self-driving robot, the "Recognition Result" variable reads 105. According to the lesson's rule (less than 110 = left, 110–130 = middle, greater than 130 = right), what is happening and what should the robot do?

   A. The road is on the left, so the robot turns left
   B. The road is on the right, so the robot turns right
   C. The road is in the middle, so the robot goes straight
   D. No road is detected, so the robot stops

7. In the Traffic Signs lesson, how many traffic signs are built into the AI audio-visual module, and what ID values do they return?

   A. 3 signs, IDs 0–2
   B. 4 signs, IDs 1–4
   C. 5 signs, IDs 1–5
   D. 8 signs, IDs 1–8

8. In the Traffic Signs program, when the "Stop" sign (ID value 5) is recognized, what should the robot do?

   A. Move forward at speed 50
   B. Reverse at speed −50
   C. Make a left turn
   D. Stop, and the buzzer sounds for one second

9. In the Facial Recognition Time Clock lesson, the "face recognition learning" block returns a value based on the face in the picture. What value is returned when no face is recognized or no learning image is available?

   A. 0
   B. 1
   C. 150
   D. −1

10. The Lucky Prize Wheel uses a gesture sensor. How many gestures can it detect, at what distance, and what numbers does it return?

    A. 4 gestures, 0–2 cm, returns 0–4
    B. 8 gestures, about 3–10 cm, returns 1–8 (0 means no gesture)
    C. 5 gestures, about 20 cm, returns 1–5
    D. 2 gestures, any distance, returns true/false

11. In the Lucky Prize Wheel program, the robot reads the gesture into a variable. When a **left wave** is recognized, what does the prize wheel do?

    A. Turns clockwise
    B. Stops immediately
    C. Sounds the buzzer
    D. Displays "No Gesture"

12. The Hexapod Robot lesson explains the mechanism that lets the six legs walk in a coordinated way. Which mechanism is used to simulate the walking motion?

    A. The rack-and-pinion mechanism
    B. The Chebyshev linkage mechanism
    C. The worm-gear mechanism
    D. The crank-slider pump mechanism

13. The Hexapod Robot decides whether to move forward, stop, or turn based on a sensor reading. Which sensor provides this value?

    A. The colour sensor
    B. The acoustic (sound) sensor
    C. The ultrasonic sensor (distance)
    D. The gesture sensor

14. In the Voice Control Snail lesson, the program reacts to sound. Which block/value is used to read the loudness of the sound the snail "hears"?

    A. "read InVolume" from the acoustic (sound-sensitive) sensor
    B. "get gesture" from the gesture sensor
    C. "road identification" from the AI module
    D. "ultrasonic distance" from the ultrasonic sensor

15. You want the Voice Control Snail to crawl **only** when the sound volume is loud enough but not extremely loud — that is, greater than a low value **and** less than a high value at the same time. Which logic operator correctly combines these two conditions?

    A. NOT
    B. OR
    C. AND
    D. Equals (=)

---

## SECTION B: ESSAY (5 questions)

**Instructions: Answer each question in 3–5 sentences.**

16. In the Voice Control Snail program, two sound conditions are combined (for example, volume greater than a low value and volume less than a high value). Explain the difference between using the **AND** operator and the **OR** operator when combining two sensor conditions like these, and describe what would happen to the snail's behaviour if AND were changed to OR.

17. Your tracking/dancing robot is supposed to react differently depending on what the camera detects, but it keeps performing the same one action over and over. You notice that the variable storing the recognition value (such as X or the recognition result) always shows the same number. What would you investigate first, and what step-by-step actions would you take to find and fix the problem?

18. Explain how the Face Tracking robot uses the face's X coordinate together with a variable to decide which way to turn. In your answer, explain why the value 150 is treated as the "middle," and describe what the robot does when X is less than 150, equal to 150, and greater than 150.

19. In the Autonomous Driving lesson, the robot uses the road offset / "Recognition Result" value with the threshold numbers 110 and 130. Explain how these two thresholds let the robot decide between going straight, turning left, and turning right, and explain why using a middle *range* (110–130) instead of a single exact value makes the robot drive more reliably.

20. The Hexapod Robot coordinates six legs and more than one motor to walk. Explain how the robot combines the ultrasonic-sensor reading, conditional judgements, and a movement sub-function (which controls motors such as M3 and M4) to move forward, turn, or stop. Mention why the lesson says it is important to measure the distance correctly so the robot is not fooled by being too close to the table.

---

# ANSWER KEY
==========

**Multiple Choice:**

1. B — The module returns the X and Y coordinates of the detected face.
2. C — Origin (0, 0) is the upper-left corner; X (horizontal) ranges 0–240 (Y ranges 0–160).
3. B — Multiplying by K1 (0.3) scales down the turn amount so the robot slows and does not overshoot the face (proportional control).
4. B — X = 0 means no face is detected, so motors M1 and M2 stop.
5. C — When the road/baseline is centred, the offset value is 120.
6. A — 105 is less than 110, so the road is on the left and the robot turns left.
7. C — 5 signs (Forward, Backward, Turn Left, Turn Right, Stop), IDs 1–5.
8. D — ID 5 = Stop: the robot stops and the buzzer sounds for one second.
9. A — Returns 0 when no face is recognized or no learning image is available.
10. B — 8 gestures at about 3–10 cm, returning 1–8 (0 means no gesture detected).
11. A — A left wave makes the wheel turn clockwise (a right wave turns it counterclockwise).
12. B — The Chebyshev linkage mechanism is used to simulate the walking motion.
13. C — The ultrasonic sensor (distance) controls forward / stop / turn.
14. A — "read InVolume" from the acoustic (sound-sensitive) sensor.
15. C — AND, because both conditions (greater than low value AND less than high value) must be true at once.

**Essay (suggested answer points):**

16. AND requires **both** conditions to be true at the same time, so the snail crawls only when the sound is inside the chosen range (loud enough but not too loud). OR requires only **one** condition to be true. If AND were changed to OR, almost any sound would satisfy at least one condition (every sound is either "greater than the low value" or "less than the high value"), so the snail would react to nearly all sounds and the range filtering would stop working.

17. Look first at whether the variable is actually being updated inside the loop — i.e. whether the line that re-reads the sensor/recognition value (set X to … ) is inside the repeat/forever loop rather than before it. Steps: (1) display the variable on the controller screen and watch whether the number changes when you move/show different inputs; (2) confirm the AI module or sensor is set to the correct mode; (3) check that the "set variable" block is inside the loop so it refreshes each cycle; (4) check the if/else conditions and thresholds are correct; (5) re-run and verify the action now changes with the input.

18. The robot reads the face's X coordinate into a variable each loop. Because the X range is about 60–240 with 150 in the centre, 150 represents the face being directly in front (middle). When X is less than 150 the face is to one side and the robot rotates toward it; when X is greater than 150 it rotates the other way; when X equals 150 the calculated turn value is 0 so the motors stop. The turn amount is based on (X − 150), often scaled by a constant (K1) so the correction is proportional to how far off-centre the face is.

19. The recognition result ranges roughly 0–240 with 120 in the middle. If the value is less than 110 the road is on the left so the robot turns left; if greater than 130 the road is on the right so it turns right; if between 110 and 130 the road is centred so it goes straight. Using a range (110–130) instead of one exact number gives tolerance for small sensor fluctuations, so tiny changes around the centre do not cause constant, jittery left-right corrections — the driving is smoother and more stable.

20. The hexapod repeatedly reads the distance from the ultrasonic sensor into a variable, then uses conditional judgements to choose an action: if the distance is large it moves forward, if too close it stops, and if it is in between it turns to one side. The actual leg motion is produced by a movement sub-function that drives the coordinated motors (such as M3 and M4) so the six legs step together in a tripod-style gait. Measuring distance correctly matters because if the reading is taken when the robot is too close to the table it can misjudge the situation and perform the wrong action; validating the distance first prevents this misreading.
