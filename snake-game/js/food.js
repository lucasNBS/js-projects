import { onSnake, grow } from "./snake.js"

let foodPosition = generateRandomPosition()

function generateRandomPosition() {
  let newPosition
  while (!newPosition || onSnake(newPosition)) {
    newPosition = {
      x: Math.floor(Math.random() * 21) + 1,
      y: Math.floor(Math.random() * 21) + 1,
    }
  }
  return newPosition
}

export function updateFood() {
  if (onSnake(foodPosition)) {
    foodPosition = generateRandomPosition()
    grow()
  }
}

export function drawFood(gameBoard) {
  const food = document.createElement("div")
  food.classList.add("food")
  food.style.gridRowStart = foodPosition.y
  food.style.gridColumnStart = foodPosition.x
  gameBoard.append(food)
}
