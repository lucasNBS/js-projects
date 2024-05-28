import { dictionary } from "./words/dictionary.js"
import { targetWords } from "./words/targetWords.js"

const guessGrid = document.querySelector("[data-guess-grid]")
const alertContainer = document.querySelector("[data-alert-container]")
const keyboard = document.querySelector("[data-keyboard]")

const offsetFromDate = new Date(2022, 0, 1)
const msOffset = Date.now() - offsetFromDate
const dayOffset = msOffset / (1000 * 60 * 60 * 24)

const targetWord = targetWords[Math.floor(dayOffset) - 1]

startInteraction()

function startInteraction() {
  document.addEventListener("click", handleMouseClick)
  document.addEventListener("keydown", handleKeyPress)
}

function stopInteraction() {
  document.removeEventListener("click", handleMouseClick)
  document.removeEventListener("keydown", handleKeyPress)
}

function handleMouseClick(e) {
  if (e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key)
    return
  }

  if (e.target.matches("[data-enter]")) {
    submitGuess()
    return
  }

  if (e.target.matches("[data-delete]")) {
    deleteKey()
    return
  }
}

function handleKeyPress(e) {
  if (e.key === "Enter") {
    submitGuess()
    return
  }

  if (e.key === "Backspace" || e.key === "Delete") {
    deleteKey()
    return
  }

  if (e.key.match(/^[a-z]$/)) {
    pressKey(e.key)
    return
  }
}

function pressKey(key) {
  const activeTiles = getActiveTiles()

  if (activeTiles.length >= 5) return

  const nextTile = guessGrid.querySelector(":not([data-letter])")

  nextTile.dataset.letter = key.toLowerCase()
  nextTile.textContent = key
  nextTile.dataset.state = "active"
}

function deleteKey() {
  const activeTiles = getActiveTiles()
  const lastTile = activeTiles[activeTiles.length - 1]

  if (!lastTile) return

  lastTile.textContent = ""
  delete lastTile.dataset.state
  delete lastTile.dataset.letter
}

function submitGuess() {
  const activeTiles = [...getActiveTiles()]

  if (activeTiles.length !== 5) {
    showAlert("Not enought letters")
    shakeTiles(activeTiles)
    return
  }

  const guess = activeTiles.reduce((word, tile) => {
    return word + tile.dataset.letter
  }, "")

  if (!dictionary.includes(guess)) {
    showAlert("Not in word list")
    shakeTiles(activeTiles)
    return
  }

  const processedLetters = processLetters(guess)

  stopInteraction()
  activeTiles.forEach((...params) => flipTile(...params, guess, processedLetters))
}

function flipTile(tile, index, array, guess, processedLetters) {
  const letter = tile.dataset.letter
  const key = keyboard.querySelector(`[data-key="${letter}"i]`)
  setTimeout(() => {
    tile.classList.add("flip")
  }, index * 250)

  tile.addEventListener("transitionend", () => {
    tile.classList.remove("flip")

    if (targetWord[index] === letter) {
      key.classList.add("correct")
    } else if (targetWord.includes(letter)) {
      key.classList.add("wrong-location")
    } else {
      key.classList.add("wrong")
    }

    tile.dataset.state = processedLetters[index]

    if (index === array.length - 1) {
      tile.addEventListener("transitionend", () => {
        startInteraction()
        checkWinLose(guess, array)
      }, { once: true })
    }
  }, { once: true })
}

function getActiveTiles() {
  return guessGrid.querySelectorAll("[data-state='active']")
}

function showAlert(message, duration = 1000) {
  const alert = document.createElement("div")
  alert.textContent = message
  alert.classList.add("alert")
  alertContainer.prepend(alert)
  if (!duration) return

  setTimeout(() => {
    alert.classList.add("hide")
    alert.addEventListener("transitionend", () => {
      alert.remove()
    })
  },  [duration])
}


function shakeTiles(tiles) {
  tiles.forEach(tile => {
    tile.classList.add("shake")
    tile.addEventListener("animationend", () => {
      tile.classList.remove("shake")
    }, { once: true })
  })
}

function checkWinLose(guess, tiles) {
  if (guess === targetWord) {
    showAlert("You win", 5000)
    danceTiles(tiles)
    stopInteraction()
    return
  }

  const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
  if (remainingTiles.length === 0) {
    showAlert(targetWord.toUpperCase(), null)
    stopInteraction()
  }
}

function danceTiles(tiles) {
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("dance")
      tile.addEventListener("animationend", () => {
        tile.classList.remove("dance")
      }, { once: true })
    }, index * 100)
  })
}

function processLetters(word) {
  let target = [...targetWord]
  let guess = [...word]

  let processedLetters = Array(5).fill(null)

  for (let index = 0; index < target.length; index++) {
    if (target[index] === guess[index]) {
      processedLetters[index] = "correct"
      target.splice(index, 1, null)
      guess.splice(index, 1, null)
    }
  }

  for (let index = 0; index < target.length; index++) {
    if (guess[index] == null) continue

    if (target.includes(guess[index])) {
      processedLetters[index] = "wrong-location"
      target.splice(target.indexOf(guess[index]), 1, null)
      guess.splice(index, 1, null)
    }
  }

  for (let index = 0; index < guess.length; index++) {
    if (guess[index] == null) continue
      processedLetters[index] = "wrong"
  }

  return processedLetters
}