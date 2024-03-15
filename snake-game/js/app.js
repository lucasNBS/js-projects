import { didHitItself, didHitWall, drawSnake, updateSnake } from "./snake.js"
import { drawFood, updateFood } from "./food.js"

let gameBoard = document.querySelector(".grid-container")

let gameOver = false
let lastRenderTime = 0

function main(time) {
  if (gameOver) {
    if (confirm("Game Over. Press 'ok' to restart")) {
      window.location.reload()
    }
    return
  }

  window.requestAnimationFrame(main)

  if ((time - lastRenderTime) / 1000 > 0.2) {
    lastRenderTime = time

    update()
    draw()
    verifyDeath()
  }
}

function update() {
  updateSnake()
  updateFood()
}

function draw() {
  gameBoard.innerHTML = ""
  drawSnake(gameBoard)
  drawFood(gameBoard)
}

function verifyDeath() {
  gameOver = didHitWall() || didHitItself()
}

window.requestAnimationFrame(main)
