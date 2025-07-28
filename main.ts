// Escape Bracelet – Full Logic Puzzle Game with Step Challenge & Logo Touch Input

let steps = 0
let inStepPuzzle = false
let stillnessPass = false
let currentQuestion = 0
let options: string[] = []
let correctAnswer = ""
let selectedIndex = 0
let lastAccel = 0
let stepThreshold = 200
let lastStepTime = 0

// Start the game on logo long press
input.onLogoEvent(TouchButtonEvent.LongPressed, function () {
    basic.showString("Start")
    runMathPuzzle()
})

// Cycle answers using logo touch
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    selectedIndex = (selectedIndex + 1) % options.length
    basic.showString(options[selectedIndex])
})

// Confirm answer using button A
input.onButtonPressed(Button.A, function () {
    if (options[selectedIndex] == correctAnswer) {
        music.playTone(Note.C, 200)
        music.playTone(Note.E, 200)
        music.playTone(Note.G, 200)
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
        music.playTone(Note.C, 300)
        music.playTone(Note.B3, 300)
        basic.showIcon(IconNames.No)
        basic.showString("Try Again")
        showOptions()
    }
})

function runMathPuzzle() {
    currentQuestion = 0
    basic.showString("9x3?")
    options = ["24", "27", "30"]
    correctAnswer = "27"
    selectedIndex = 0
    showOptions()
}

function runGrammarPuzzle() {
    currentQuestion = 1
    basic.showString("Their/There/They\"re")
    options = ["Their", "There", "They're"]
    correctAnswer = "They're"
    selectedIndex = 0
    showOptions()
}

function runCompassPuzzle() {
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

function runStepPuzzle() {
    steps = 0
    inStepPuzzle = true
    stillnessPass = false
    lastAccel = input.acceleration(Dimension.Strength)
    lastStepTime = input.runningTime()
    basic.showString("Go!")
}

basic.forever(function () {
    if (inStepPuzzle && !stillnessPass) {
        let accel = input.acceleration(Dimension.Strength)
        let delta = Math.abs(accel - lastAccel)

        if (delta > stepThreshold && input.runningTime() - lastStepTime > 400) {
            steps++
            lastStepTime = input.runningTime()
            basic.showNumber(steps)

            if (steps == 20) {
                basic.showString("Freeze!")
                checkStillness()
            }
        }
        lastAccel = accel
    }
})

function checkStillness() {
    let stillStart = input.runningTime()
    while (input.runningTime() - stillStart < 5000) {
        let accel = input.acceleration(Dimension.Strength)
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

function runFinalComboPuzzle() {
    currentQuestion = 3
    basic.showString("Combo!")
    basic.showString("A > B > A+B")
    waitForCombo()
}

function waitForCombo() {
    let state = 0
    input.onButtonPressed(Button.A, function () {
        if (state == 0) {
            state++
        } else if (state == 2) {
            basic.showIcon(IconNames.No)
            state = 0
        }
    })
    input.onButtonPressed(Button.B, function () {
        if (state == 1) {
            state++
        } else {
            basic.showIcon(IconNames.No)
            state = 0
        }
    })
    input.onButtonPressed(Button.AB, function () {
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

function showOptions() {
    basic.showString(options[selectedIndex])
}
