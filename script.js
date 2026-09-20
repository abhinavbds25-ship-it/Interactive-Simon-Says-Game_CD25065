let gameSequence = [];
let userSequence = [];

let level = 0;
let score = 0;

let gameStarted = false;
let acceptingInput = false;

let colors = ["red", "blue", "green", "yellow"];


// Get HTML elements
const startButton = document.getElementById("startButton");
const startText = document.getElementById("startText");

const levelDisplay = document.getElementById("level");
const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("bestScore");

const statusText = document.getElementById("status");
const instructionText = document.getElementById("instruction");

const buttons = document.querySelectorAll(".simon-button");


// Load best score
let bestScore = localStorage.getItem("simonBestScore") || 0;

bestScoreDisplay.innerText = bestScore;


// ------------------------------------
// START BUTTON
// ------------------------------------

startButton.addEventListener("click", function () {

    startGame();

});


// ------------------------------------
// GAME BUTTONS
// ------------------------------------

buttons.forEach(function (button) {

    button.addEventListener("click", function () {

        if (!gameStarted || !acceptingInput) {
            return;
        }

        let selectedColor = button.dataset.color;

        playSound(selectedColor);

        flashButton(selectedColor);

        userSequence.push(selectedColor);

        checkAnswer(userSequence.length - 1);

    });

});


// ------------------------------------
// START GAME
// ------------------------------------

function startGame() {

    gameSequence = [];

    userSequence = [];

    level = 0;

    score = 0;

    gameStarted = true;

    acceptingInput = false;

    document.body.classList.remove("game-over");

    startText.innerText = "Restart Game";

    scoreDisplay.innerText = score;

    levelDisplay.innerText = level;

    statusText.innerText = "Get Ready!";

    instructionText.innerText =
        "Watch the sequence carefully";

    setTimeout(function () {

        nextLevel();

    }, 800);

}


// ------------------------------------
// NEXT LEVEL
// ------------------------------------

function nextLevel() {

    userSequence = [];

    level++;

    levelDisplay.innerText = level;

    statusText.innerText =
        "Level " + level;

    instructionText.innerText =
        "Watch the sequence";

    acceptingInput = false;


    // Generate random color

    let randomIndex =
        Math.floor(Math.random() * colors.length);

    let randomColor =
        colors[randomIndex];


    gameSequence.push(randomColor);


    // Show sequence

    setTimeout(function () {

        showSequence();

    }, 500);

}


// ------------------------------------
// SHOW SEQUENCE
// ------------------------------------

function showSequence() {

    let index = 0;


    let speed = Math.max(
        350,
        650 - level * 15
    );


    let interval = setInterval(function () {

        let color = gameSequence[index];

        flashButton(color);

        playSound(color);

        index++;


        if (index >= gameSequence.length) {

            clearInterval(interval);

            setTimeout(function () {

                acceptingInput = true;

                statusText.innerText =
                    "Your Turn";

                instructionText.innerText =
                    "Repeat the sequence";

            }, 400);

        }

    }, speed);

}


// ------------------------------------
// FLASH BUTTON
// ------------------------------------

function flashButton(color) {

    let button =
        document.getElementById(color);


    button.classList.add("active");


    setTimeout(function () {

        button.classList.remove("active");

    }, 300);

}


// ------------------------------------
// CHECK ANSWER
// ------------------------------------

function checkAnswer(index) {

    // Wrong answer

    if (
        userSequence[index] !==
        gameSequence[index]
    ) {

        gameOver();

        return;

    }


    // Complete sequence

    if (
        userSequence.length ===
        gameSequence.length
    ) {

        acceptingInput = false;


        // Increase score

        score += level * 10;

        scoreDisplay.innerText = score;


        statusText.innerText =
            "Excellent!";

        instructionText.innerText =
            "Get ready for the next level";


        // Next level

        setTimeout(function () {

            nextLevel();

        }, 1000);

    }

}


// ------------------------------------
// GAME OVER
// ------------------------------------

function gameOver() {

    gameStarted = false;

    acceptingInput = false;


    document.body.classList.add("game-over");


    statusText.innerText =
        "Game Over!";

    instructionText.innerText =
        "You reached Level " + level;


    // Update best score

    if (score > bestScore) {

        bestScore = score;

        localStorage.setItem(
            "simonBestScore",
            bestScore
        );

        bestScoreDisplay.innerText =
            bestScore;

        instructionText.innerText =
            "New Best Score! 🎉";

    }


    startText.innerText =
        "Play Again";


    // Flash the buttons

    buttons.forEach(function (button) {

        button.classList.add("active");

        setTimeout(function () {

            button.classList.remove("active");

        }, 400);

    });

}


// ------------------------------------
// SOUND EFFECT
// ------------------------------------

function playSound(color) {

    const audioContext =
        new (window.AudioContext ||
            window.webkitAudioContext)();


    let frequencies = {

        red: 261.63,

        blue: 329.63,

        green: 392.00,

        yellow: 523.25

    };


    let oscillator =
        audioContext.createOscillator();

    let gain =
        audioContext.createGain();


    oscillator.type = "sine";

    oscillator.frequency.value =
        frequencies[color];


    gain.gain.setValueAtTime(
        0.15,
        audioContext.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.3
    );


    oscillator.connect(gain);

    gain.connect(audioContext.destination);


    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.3
    );

}