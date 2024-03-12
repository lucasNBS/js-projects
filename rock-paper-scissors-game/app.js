const buttons = document.querySelectorAll(".select-button")

const playerScoreContainer = document.querySelector("#player-score")
const computerScoreContainer = document.querySelector("#computer-score")

let playerGames = document.querySelector("#player-games")
let computerGames = document.querySelector("#computer-games")

let playerScore = 0
let computerScore = 0

const gameOptions = [
  {
    type: "rock",
    emoji: "✊",
    beats: "scissors"
  },
  {
    type: "paper",
    emoji: "✋",
    beats: "rock"
  },
  {
    type: "scissors",
    emoji: "✌️",
    beats: "paper"
  },
]

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const selected = e.target.dataset.type

    const computerSelectedObject = generateComputer()

    computeResult(selected, computerSelectedObject)
  })
})

function generateComputer() {
  const randomIndex = Math.floor(Math.random() * gameOptions.length)
  return gameOptions[randomIndex]
}

function computeResult(selected, computerSelectedObject) {
  const selectedObject = gameOptions.find((item) => item.type === selected)

  let winner

  if (selectedObject.beats === computerSelectedObject.type) {
    winner = "player"
    playerScore++
    playerScoreContainer.innerText = playerScore
  } else if (computerSelectedObject.beats === selectedObject.type) {
    winner = "computer"
    computerScore++
    computerScoreContainer.innerText = computerScore
  } else {
    winner = "none"
  }
  saveGame(selectedObject, playerGames, winner === "player")
  saveGame(computerSelectedObject, computerGames, winner === "computer")
}

function saveGame(selected, container, isWinner) {
  const div = document.createElement("div")

  div.innerText = selected.emoji
  div.classList.add("past-game")

  if (isWinner) {
    div.classList.add("winner")
  }
  
  container.appendChild(div)
}