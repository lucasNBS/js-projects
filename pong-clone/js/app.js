import Ball from "./ball.js"
import Paddle from "./paddle.js"

const ball = new Ball(document.querySelector("#ball"))
const playerPaddle = new Paddle(document.querySelector("#player-paddle"))
const computerPaddle = new Paddle(document.querySelector("#computer-paddle"))
const playerScore = document.querySelector("#player-score")
const computerScore = document.querySelector("#computer-score")

let lastTime
function update(time) {
  if (lastTime != null) {
    const delta = time - lastTime
    ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()])
    computerPaddle.update(delta, ball.y)
    const hue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hue"))
    document.documentElement.style.setProperty("--hue", hue + delta * 0.01)
  }

  if (gameOver()) {
    hanldeGameOver()
  }
  
  lastTime = time
  window.requestAnimationFrame(update)
}

window.requestAnimationFrame(update)

function gameOver() {
  const rect = ball.rect()
  return rect.right >= window.innerWidth || rect.left <= 0
}

function hanldeGameOver() {
  const rect = ball.rect()
  
  if (rect.right >= window.innerWidth) {
    playerScore.textContent = parseInt(playerScore.textContent) + 1
  } else {
    computerScore.textContent = parseInt(computerScore.textContent) + 1
  }

  computerPaddle.reset()
  playerPaddle.reset()
  ball.reset()

}

document.addEventListener("mousemove", (e) => {
  playerPaddle.position = (e.y / window.innerHeight) * 100
})