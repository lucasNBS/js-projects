class AudioController {
  constructor() {
    this.backgroundMusic = new Audio("media/audios/creepy.mp3")
    this.flipSound = new Audio("media/audios/flip.wav")
    this.gameOverSound = new Audio("media/audios/gameOver.wav")
    this.matchSound = new Audio("media/audios/match.wav")
    this.victorySound = new Audio("media/audios/victory.wav")

    this.backgroundMusic.volume = 0.05
    this.backgroundMusic.loop = true

    this.flipSound.volume = 0.15
    this.matchSound.volume = 0.15
    this.gameOverSound.volume = 0.5
    this.victorySound.volume = 0.5
  }

  startMusic() {
    this.backgroundMusic.play()
  }

  stopMusic() {
    this.backgroundMusic.pause()
    this.backgroundMusic.currentTime = 0
  }

  flip() {
    this.flipSound.play()
  }

  gameOver() {
    this.gameOverSound.play()
  }

  match() {
    this.matchSound.play()
  }

  victory() {
    this.victorySound.play()
  }
}

class MixOrMatch {
  constructor(totalTime, cards) {
    this.cards = cards
    this.totalTime = totalTime
    this.timeRemaining = totalTime
    this.timer = document.querySelector("[data-game-info-time]")
    this.fliper = document.querySelector("[data-game-info-flips]")
    this.audioController = new AudioController()
  }

  gameStart() {
    this.audioController.startMusic()
    this.totalClicks = 0
    this.cardToMatch = null
    this.cardsMatched = []
    this.timeRemaining = this.totalTime
    this.timer.innerText = this.totalTime
    this.fliper.innerText = this.totalClicks
    this.busy = true
    this.hideCards()

    setTimeout(() => {
      this.shuffle()
      this.countDown = this.startCountDown()
      this.busy = false
    }, 500)
  }

  gameOver() {
    clearInterval(this.countDown)
    this.audioController.stopMusic()
    document.querySelector("[data-game-over-container]").classList.remove("hide")
    this.audioController.gameOver()
  }

  victory() {
    clearInterval(this.countDown)
    this.audioController.stopMusic()
    document.querySelector("[data-victory-container]").classList.remove("hide")
    this.audioController.victory()
  }

  shuffle() {
    for (let index = this.cards.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1))
      this.cards[randomIndex].style.order = index
      this.cards[index].style.order = randomIndex
    }
  }

  hideCards() {
    this.cards.forEach(card => {
      card.classList.remove("flipped")
      card.classList.remove("matched")
    })
  }

  startCountDown() {
    return setInterval(() => {
      this.timeRemaining--
      this.timer.innerText = this.timeRemaining
      
      if (this.timeRemaining === 0) {
        this.gameOver()
      }
    }, 1000)
  }

  checkForCardsMatch(card) {
    this.busy = true

    if (this.cardToMatch.dataset.value === card.dataset.value) {
      this.cardToMatch.classList.add("matched")
      card.classList.add("matched")
      
      this.cardsMatched.push(this.cardToMatch)
      this.cardsMatched.push(card)

      this.cardToMatch = null

      if (this.cardsMatched.length === this.cards.length) {
        setTimeout(() => {
          this.victory()
        }, 750)
      }
    } else {
      setTimeout(() => {
        this.cardToMatch.classList.remove("flipped")
        card.classList.remove("flipped")
        this.cardToMatch = null
      }, 750)
    }

    setTimeout(() => {
      this.busy = false
    }, 750)
  }

  async flip(card) {
    if (card.classList.contains("flipped") || this.busy) {
      return
    }

    if (this.cardToMatch) {
      this.checkForCardsMatch(card)
    } else {
      this.cardToMatch = card
    }

    this.audioController.flip()
    this.totalClicks++
    this.fliper.innerText = this.totalClicks
    card.classList.toggle("flipped")
  }
}

const cards = document.querySelectorAll(".card-container")

const game = new MixOrMatch(60, Array.from(cards))
const overlayContainers = document.querySelectorAll(".overlay-container")

cards.forEach(card => {
  card.addEventListener("click", () => game.flip(card))
})

overlayContainers.forEach(overlayContainer => {
  overlayContainer.addEventListener("click", () => {
    overlayContainer.classList.add("hide")
    game.gameStart()
  })
})
