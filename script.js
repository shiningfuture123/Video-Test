class audioController {
    constructor() {
        this.flipSound = new Audio('Assets/Audio/Flip.mp3');
        this.matchedSoundPLACEHOLDER = new Audio('Assets/Audio/placeholderMatched.mp3'); //change
    }
    matchedPLACEHOLDER() {
        this.matchedSoundPLACEHOLDER.play(); //change
    }
    playFlipSound() {
        this.flipSound.play(); //adjust audio volume?
    }
}

class gameController {
    constructor(totalTime, cards) {
        this.constantTime = totalTime;
        this.getTime = document.getElementById('time-remaining')
        this.getFlips = document.getElementById('flips');
        this.cardsArray = cards;
        this.music = new audioController();
    }

    startGame() {
        this.getTime.innerText = this.constantTime;
        this.timeRemaining = this.constantTime;
        this.cardToCheck = null;
        this.busy = true;
        this.pauseTimer = false;
        this.cardsMatchedArray = [];
        this.numFlips = 0; //resets
        setTimeout(() => {
            this.busy = null;
            this.shuffleTheCards();
            this.startCountdown();
        }, 500);
    }

    flipCard(card) {
        if (this.canFlipCard(card)) {
            this.music.playFlipSound();
            card.classList.add('visible');
            this.numFlips++; 
            this.getFlips.innerText = this.numFlips;
    
            if (this.cardToCheck) {
                this.checkForCardMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }
    }

    canFlipCard(card) {
        return (!this.busy && !this.cardsMatchedArray.includes(card) && card !== this.cardToCheck);
    }

    shuffleTheCards() {
        for (let i = this.cardsArray.length - 1; i > 0; i--) { //scope and not globally declaring i
            let randomNumber = Math.floor(Math.random() * (i + 1));
            this.cardsArray[i].style.order = randomNumber;
            this.cardsArray[randomNumber].style.order = i;
        }
    }

    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
        });
    }

    //---------------------------------------------------------------------------------------------------------

    gameVictory(card1) {
        let duration = card1.getElementsByClassName('video')[0].duration;
        setTimeout( () => {
            document.getElementById('victory').classList.add('visible');
            this.hideCards();
        }, duration * 1000);
    }

    gameOver() {
        document.getElementById('gameover').classList.add('visible');
        this.hideCards();
    }

    //---------------------------------------------------------------------------------------------------------

    startCountdown() {
        this.countDown = setInterval(() => { //setInterval returns an ID but without anything to return it cant work with clearInterval
            this.timeRemaining--;
            this.getTime.innerText = this.timeRemaining;
            if (this.timeRemaining === 0) {
                this.stopCountdown();
                this.gameOver();
            } else if (this.pauseTimer) { //stops time when video is playing
                this.stopCountdown();
            }
        }, 1000);
    }

    stopCountdown() {
        clearInterval(this.countDown);
    }

    //---------------------------------------------------------------------------------------------------------
    playMatchedVideo(card1, card2) {
        this.busy = true;
        this.pauseTimer = true;
        card1.getElementsByClassName('video')[0].play();
        card2.getElementsByClassName('video')[0].muted = true; //just to make it sound smoother
        card2.getElementsByClassName('video')[0].play();
        let duration = card1.getElementsByClassName('video')[0].duration;
        setTimeout( () => { //allows cards to be clicked when video finished and begins countdown again
            this.busy = false;
            this.pauseTimer = false;
            this.startCountdown();
            card2.getElementsByClassName('video')[0].muted = false; //do I need this? for when it resets during victory/gameOver?
            card1.getElementsByClassName('card-value')[0].classList.add('visible');
            card2.getElementsByClassName('card-value')[0].classList.add('visible');
        }, duration * 1000);
    }

    cardsMatched(card1, card2) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.cardsMatchedArray.push(card1);
        this.cardsMatchedArray.push(card2);
        this.playMatchedVideo(card1, card2);
        if (this.cardsMatchedArray.length === this.cardsArray.length) {
            this.gameVictory(card1);
        }
    }

    cardsNotMatched(card1, card2) {
        this.busy = true; //you wont be able to click until the cards are flipped over again
        setTimeout( () => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000)
    }

    checkForCardMatch(card) {
        if (this.getType(card) == this.getType(this.cardToCheck)) {
            this.music.matchedPLACEHOLDER(); //CHANGE AND ALSO HOW TO ADD A DELAY SO THAT IT PLAYS WHEN CARD IS FULLY FLIPPED
            this.cardsMatched(card, this.cardToCheck);
        } else {
            this.cardsNotMatched(card, this.cardToCheck);
        }
        this.cardToCheck = null;
    }

    getType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }
}

let overlays = Array.from(document.getElementsByClassName('overlay-text'));
let cards = Array.from(document.getElementsByClassName('card'));
let videos = Array.from(document.getElementsByClassName('video'));
let game = new gameController(100, cards);

document.addEventListener("DOMContentLoaded", () => { //ensure that the content is loaded before executing the click functions
    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        })
    })
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        })
    });
});