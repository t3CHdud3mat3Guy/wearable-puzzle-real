# Escape Bracelet – Full Logic Puzzle Game with Step Challenge & Logo Touch Input
def runStepPuzzle():
    global steps, inStepPuzzle, stillnessPass
    steps = 0
    inStepPuzzle = True
    stillnessPass = False
    basic.show_string("Go!")
def runGrammarPuzzle():
    global currentQuestion, options, correctAnswer, selectedIndex
    currentQuestion = 1
    basic.show_string("Their/There/They\"re")
    options = ["Their", "There", "They're"]
    correctAnswer = "They're"
    selectedIndex = 0
    showOptions()
def runMathPuzzle():
    global currentQuestion, options, correctAnswer, selectedIndex
    currentQuestion = 0
    basic.show_string("9x3?")
    options = ["24", "27", "30"]
    correctAnswer = "27"
    selectedIndex = 0
    showOptions()
def showOptions():
    basic.show_string("" + (options[selectedIndex]))
def runCompassPuzzle():
    global currentQuestion
    currentQuestion = 2
    basic.show_string("Face N")
    input.calibrate_compass()
    basic.pause(2000)
    if input.compass_heading() >= 345 or input.compass_heading() <= 15:
        music.start_melody(music.built_in_melody(Melodies.POWER_UP), MelodyOptions.ONCE)
        basic.show_icon(IconNames.HAPPY)
        runStepPuzzle()
    else:
        basic.show_string("Wrong Dir")
        runCompassPuzzle()
# Start the game on logo long press

def on_logo_long_pressed():
    basic.show_string("Start")
    runMathPuzzle()
input.on_logo_event(TouchButtonEvent.LONG_PRESSED, on_logo_long_pressed)

def checkStillness():
    global stillStart, accel, steps, stillnessPass
    stillStart = input.running_time()
    while input.running_time() - stillStart < 5000:
        accel = input.acceleration(Dimension.STRENGTH)
        if accel < 980 or accel > 1070:
            basic.show_string("❌ Move!")
            steps = 0
            basic.show_string("Again")
            return
    stillnessPass = True
    basic.show_string("✅ Done!")
    runFinalComboPuzzle()
def waitForCombo():
    
    def on_button_pressed_a():
        global state
        if state == 0:
            state += 1
        elif state == 2:
            basic.show_icon(IconNames.NO)
            state = 0
    input.on_button_pressed(Button.A, on_button_pressed_a)
    
    
    def on_button_pressed_b():
        global state
        if state == 1:
            state += 1
        else:
            basic.show_icon(IconNames.NO)
            state = 0
    input.on_button_pressed(Button.B, on_button_pressed_b)
    
    
    def on_button_pressed_ab():
        global state
        if state == 2:
            basic.show_string("ESCAPED!")
            music.start_melody(music.built_in_melody(Melodies.BA_DING), MelodyOptions.ONCE)
            basic.show_icon(IconNames.HEART)
        else:
            basic.show_icon(IconNames.NO)
            state = 0
    input.on_button_pressed(Button.AB, on_button_pressed_ab)
    
# Confirm answer using button A

def on_button_pressed_a2():
    if options[selectedIndex] == correctAnswer:
        music.play_tone(262, 200)
        music.play_tone(330, 200)
        music.play_tone(392, 200)
        basic.show_icon(IconNames.YES)
        if currentQuestion == 0:
            runGrammarPuzzle()
        elif currentQuestion == 1:
            runCompassPuzzle()
        elif currentQuestion == 2:
            runStepPuzzle()
        else:
            runFinalComboPuzzle()
    else:
        music.play_tone(262, 300)
        music.play_tone(247, 300)
        basic.show_icon(IconNames.NO)
        basic.show_string("Try Again")
        showOptions()
input.on_button_pressed(Button.A, on_button_pressed_a2)

def runFinalComboPuzzle():
    global currentQuestion
    currentQuestion = 3
    basic.show_string("Combo!")
    basic.show_string("A > B > A+B")
    waitForCombo()

def on_gesture_shake():
    global steps
    if inStepPuzzle and not (stillnessPass):
        steps += 1
        basic.show_number(steps)
        if steps == 20:
            basic.show_string("Freeze!")
            checkStillness()
input.on_gesture(Gesture.SHAKE, on_gesture_shake)

# Cycle answers using logo touch

def on_logo_pressed():
    global selectedIndex
    selectedIndex = (selectedIndex + 1) % len(options)
    basic.show_string("" + (options[selectedIndex]))
input.on_logo_event(TouchButtonEvent.PRESSED, on_logo_pressed)

accel = 0
stillStart = 0
selectedIndex = 0
correctAnswer = ""
options: List[str] = []
currentQuestion = 0
stillnessPass = False
inStepPuzzle = False
steps = 0
state = 0