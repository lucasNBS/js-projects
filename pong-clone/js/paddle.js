const SPEED = 0.02

export default class Paddle {
  constructor(paddle) {
    this.paddle = paddle
    this.reset()
  }

  get position() {
    return parseFloat(getComputedStyle(this.paddle).getPropertyValue("--position"))
  }

  set position(position) {
    this.paddle.style.setProperty("--position", position)
  }

  rect() {
    return this.paddle.getBoundingClientRect()
  }

  reset() {
    this.position = 50
  }

  update(delta, ballY) {
    this.position += SPEED * delta * (ballY - this.position)
  }
}