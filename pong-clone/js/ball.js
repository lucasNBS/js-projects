const INITIAL_VELOCITY = 0.025
const VELOCITY_INCREASE = 0.00001

export default class Ball {
  constructor(ball) {
    this.ball = ball
    this.reset()
  }

  get x() {
    return parseFloat(getComputedStyle(this.ball).getPropertyValue("--x"))
  }

  set x(value) {
    this.ball.style.setProperty("--x", value)
  }

  get y() {
    return parseFloat(getComputedStyle(this.ball).getPropertyValue("--y"))
  }
  
  set y(value) {
    this.ball.style.setProperty("--y", value)
  }

  rect() {
    return this.ball.getBoundingClientRect()
  }

  reset() {
    this.x = 50
    this.y = 50

    this.direction = { x: 0 }

    while (Math.abs(this.direction.x) <= 0.2 || Math.abs(this.direction.x) >= 0.9) {
      const heading = randomNumberBetween(0, 2 * Math.PI)
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) }
    }
    this.velocity = INITIAL_VELOCITY
  }

  update(delta, paddleRects) {
    this.x += this.direction.x * this.velocity * delta
    this.y += this.direction.y * this.velocity * delta
    this.velocity += VELOCITY_INCREASE * delta
    const rect = this.rect()

    if (rect.bottom >= window.innerHeight || rect.top <= 0) {
      this.direction.y = this.direction.y * -1
    }
    if (paddleRects.some(paddle => isCollision(paddle, rect))) {
      this.direction.x = this.direction.x * -1
    }
  }
}

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min
}

function isCollision(paddle, ball) {
  return paddle.left <= ball.right &&
  paddle.right >= ball.left &&
  paddle.top <= ball.bottom &&
  paddle.bottom >= ball.top
}