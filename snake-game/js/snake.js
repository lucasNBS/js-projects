import { direction } from "./input.js"

const snakeBody = [{ x: 11, y: 11 }]

export function updateSnake() {
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] }
  }

  snakeBody[0].x += direction.x
  snakeBody[0].y += direction.y
}

export function drawSnake(gameBoard) {
  snakeBody.forEach((segment) => {
    const snakeSegment = document.createElement("div")
    snakeSegment.style.gridRowStart = segment.y
    snakeSegment.style.gridColumnStart = segment.x
    snakeSegment.classList.add("snake")
    gameBoard.append(snakeSegment)
  })
}

export function onSnake(position, ignoreHead = false) {
  return snakeBody.some((segment, index) => {
    if (ignoreHead && (index === 0 || index === 1)) {
      return false
    }
    return segment.x === position.x && segment.y === position.y
  })
}

export function grow() {
  snakeBody.push(snakeBody[snakeBody.length -1])
}

export function didHitWall() {
  return snakeBody[0].x <= 0 || snakeBody[0].x > 21 || snakeBody[0].y <= 0 || snakeBody[0].y > 21
}

export function didHitItself() {
  return onSnake(snakeBody[0], true)
}