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
        this.cardsMatchedArray = [];
        this.numFlips = 0; //resets
        this.startCountdown();
        
    }

    flipCard(card) {
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

    //---------------------------------------------------------------------------------------------------------

    gameVictory() {
        //needs a wait time so when the video ends it will be visible
        document.getElementById('victory').classList.add('visible');
    }

    gameOver() {
        document.getElementById('gameover').classList.add('visible');
    }

    //---------------------------------------------------------------------------------------------------------

    startCountdown() {
        this.countDown = setInterval(() => { //setInterval returns an ID but without anything to return it cant work with clearInterval
            this.timeRemaining--;
            this.getTime.innerText = this.timeRemaining;
            if (this.timeRemaining === 0) {
                this.stopCountdown();
                this.gameOver();
            }
        }, 1000);
    }

    stopCountdown() {
        clearInterval(this.countDown);
    }

    //---------------------------------------------------------------------------------------------------------

    cardsMatched(card1, card2) {
        card1.classList.add('matched');
        card2.classList.add('matched');

        card1.getElementsByClassName('video')[0].play();
        card2.getElementsByClassName('video')[0].play();

        this.cardsMatchedArray.push(card1);
        this.cardsMatchedArray.push(card2);
        if (this.cardsMatchedArray.length === this.cardsArray.length) {
            this.gameVictory();
        }
    }

    cardsNotMatched() {
        //Work On This
    }

    checkForCardMatch(card) {
        if (this.getType(card) == this.getType(this.cardToCheck)) {
            this.music.matchedPLACEHOLDER(); //CHANGE AND ALSO HOW TO ADD A DELAY SO THAT IT PLAYS WHEN CARD IS FULLY FLIPPED
            this.cardsMatched(card, this.cardToCheck);
        } else {
            this.cardsNotMatched();
        }
        this.cardToCheck = null;
    }

    getType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }
}


let overlays = Array.from(document.getElementsByClassName('overlay-text'));
let cards = Array.from(document.getElementsByClassName('card'));
let game = new gameController(1000, cards);

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

