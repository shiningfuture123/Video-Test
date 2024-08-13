class audioController {
    constructor() {
        this.flipSound = new Audio('Assets/Audio/Flip.mp3');
        this.matchedSound = new Audio('Assets/Audio/matched.mp3')
    }
    flip() {
        this.flipSound.play();
    }
    matched() {
        this.matchedSound.play();
    }
}

class gameController {
    constructor(totalTime, cards) { //basically just parameters
        this.cardArray = cards;
        this.totalTime = totalTime; //setting a this to have a constant time
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining'); //so we can change it in startCountdown()
        this.numFlips = document.getElementById('flips');
        this.audio = new audioController();

    }

    startGame() {
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime; // resetting the timeRemaining with the constant this.totalTime representing the total time
        this.timer.innerText = this.totalTime;
        this.numFlips.innerText = this.totalClicks;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.shuffleCards();
        this.hideCards(); //to revert the cards back to invisible
        this.countDown = this.startCountdown();
    }

    gameOver() {
        clearInterval(this.countDown);
        document.querySelector('.gameover').classList.add('visible');
    }

    victory() {
        clearInterval(this.countDown);
        document.querySelector('.victory').classList.add('visible');
    }

    startCountdown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if (this.timeRemaining === 0) {
                this.gameOver();
            }
        }, 1000);
    }

    hideCards() {
        this.cardArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched'); //remove all the matched classes since we wanted to place the video when they matched
        })
    }

    flipCard(card) {
        if (this.canFlipCard(card)) {
            this.audio.flip();
            this.totalClicks++;
            this.numFlips.innerHTML = this.totalClicks;
            card.classList.add('visible'); // needs to be in here to be able to have a conditional statement on whether or no the card is allowed to be flipped
        }

        if(this.cardToCheck) { //if its null it will go to else, if its true it will go to checkForCardMatch()
            this.checkForCardMatch(card); //if there is a card selected, it will check to see if matched
        } else {
            this.cardToCheck = card; // else the card selected will be considered the selected card
        }

    }

    checkForCardMatch(card) {
        if (this.getCardType(card) === this.getCardType(this.getCardType(this.cardToCheck))) {
            this.cardMatch(card, this.cardToCheck);
        } else {
            this.cardMismatch(card, this.cardToCheck);
        }
    }

    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audio.matchedSound();
        if (this.matchedCards.length === this.cardArray.length) {
            this.victory();
        }
    }

    cardMismatch(card) {

    }

    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;//since its not an array but just an individual image with a class of "card-value"
    }

    canFlipCard(card) {
        return true; //temporary for now
    }

    shuffleCards() {
        for (let i = this.cardArray.length - 1; i > 0; i--) { // example if i = 4, math.random * 5 = [0, 5), truncate anything in 4.0 gets us 4
            let randIndex = Math.floor(Math.random() * (i + 1)); // basically stretching the range from [0, 5) then truncating anything within 4 point something to only get 4
            this.cardArray[randIndex].style.order = i;
            this.cardArray[i].style.order 
        }
    }

}

let overlays = Array.from(document.getElementsByClassName('overlay-text'));
let cards = Array.from(document.getElementsByClassName('card'));
let game = new gameController(5, cards);



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

