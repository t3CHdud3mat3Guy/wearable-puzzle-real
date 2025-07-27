// Escape Bracelet – Full Logic Puzzle Game with Step Challenge & Logo Touch Input
function runStepPuzzle () {
    steps = 0
    inStepPuzzle = true
    stillnessPass = false
    basic.showString("Go!")
}
function runGrammarPuzzle () {
    currentQuestion = 1
    basic.showString("Their/There/They\"re")
    options = ["Their", "There", "They're"]
    correctAnswer = "They're"
    selectedIndex = 0
    showOptions()
}
function runMathPuzzle () {
    currentQuestion = 0
    basic.showString("9x3?")
    options = ["24", "27", "30"]
    correctAnswer = "27"
    selectedIndex = 0
    showOptions()
}
function showOptions () {
    basic.showString("" + (options[selectedIndex]))
}
function runCompassPuzzle () {
    currentQuestion = 2
    basic.showString("Face N")
    input.calibrateCompass()
    basic.pause(2000)
    if (input.compassHeading() >= 345 || input.compassHeading() <= 15) {
        music.startMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once)
        basic.showIcon(IconNames.Happy)
        runStepPuzzle()
    } else {
        basic.showString("Wrong Dir")
        runCompassPuzzle()
    }
}
// Start the game on logo long press
input.onLogoEvent(TouchButtonEvent.LongPressed, function () {
    basic.showString("Start")
    runMathPuzzle()
})
function checkStillness () {
    stillStart = input.runningTime()
    while (input.runningTime() - stillStart < 5000) {
        accel = input.acceleration(Dimension.Strength)
        if (accel < 980 || accel > 1070) {
            basic.showString("❌ Move!")
            steps = 0
            basic.showString("Again")
            return
        }
    }
    stillnessPass = true
    basic.showString("✅ Done!")
    runFinalComboPuzzle()
}
function waitForCombo () {
    input.onButtonPressed(Button.A, function on_button_pressed_a() {
        
        if (state == 0) {
            state += 1
        } else if (state == 2) {
            basic.showIcon(IconNames.No)
            state = 0
        }
        
    })
input.onButtonPressed(Button.B, function on_button_pressed_b() {
        
        if (state == 1) {
            state += 1
        } else {
            basic.showIcon(IconNames.No)
            state = 0
        }
        
    })
input.onButtonPressed(Button.AB, function on_button_pressed_ab() {
        
        if (state == 2) {
            basic.showString("ESCAPED!")
            music.startMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once)
            basic.showIcon(IconNames.Heart)
        } else {
            basic.showIcon(IconNames.No)
            state = 0
        }
        
    })
}
// Confirm answer using button A
input.onButtonPressed(Button.A, function () {
    if (options[selectedIndex] == correctAnswer) {
        music.playTone(262, 200)
        music.playTone(330, 200)
        music.playTone(392, 200)
        basic.showIcon(IconNames.Yes)
        if (currentQuestion == 0) {
            runGrammarPuzzle()
        } else if (currentQuestion == 1) {
            runCompassPuzzle()
        } else if (currentQuestion == 2) {
            runStepPuzzle()
        } else {
            runFinalComboPuzzle()
        }
    } else {
        music.playTone(262, 300)
        music.playTone(247, 300)
        basic.showIcon(IconNames.No)
        basic.showString("Try Again")
        showOptions()
    }
})
function runFinalComboPuzzle () {
    currentQuestion = 3
    basic.showString("Combo!")
    basic.showString("A > B > A+B")
    waitForCombo()
}
input.onGesture(Gesture.Shake, function () {
    if (inStepPuzzle && !(stillnessPass)) {
        steps += 1
        basic.showNumber(steps)
        if (steps == 20) {
            basic.showString("Freeze!")
            checkStillness()
        }
    }
})
// Cycle answers using logo touch
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    selectedIndex = (selectedIndex + 1) % options.length
    basic.showString("" + (options[selectedIndex]))
})
let accel = 0
let stillStart = 0
let selectedIndex = 0
let correctAnswer = ""
let options: string[] = []
let currentQuestion = 0
let stillnessPass = false
let inStepPuzzle = false
let steps = 0
let state = 0
