const HOLE_HEIGHT = 180
const PIPE_INTERVAL = 1500
const PIPE_SPEED = 0.5
const PIPE_WIDTH = 75

let pipes = []
let passedPipesCount

const AUDIO_POINT = new Audio("./media/sfx_point.mp3")

let timeSinceLastPipe
export function setupPipes() {
  pipes.forEach(pipe => pipe.remove())
  document.documentElement.style.setProperty('--pipe-width', PIPE_WIDTH)
  document.documentElement.style.setProperty('--hole-height', HOLE_HEIGHT)
  timeSinceLastPipe = PIPE_INTERVAL
  passedPipesCount = 0
}

export function updatePipes(delta) {
  timeSinceLastPipe += delta

  if (timeSinceLastPipe > PIPE_INTERVAL) {
    timeSinceLastPipe -=  PIPE_INTERVAL
    createPipe()
  }

  pipes.forEach(pipe => {
    if (pipe.left + PIPE_WIDTH < 0) {
      passedPipesCount++
      AUDIO_POINT.play()
      return pipe.remove()
    }
    pipe.left = pipe.left - delta * PIPE_SPEED
  })
}

export function getPassedPipesCount() {
  return passedPipesCount
}

export function getPipeRects() {
  return pipes.flatMap(pipe => pipe.rects())
}

function createPipe() {
  const pipeElement = document.createElement("div")
  const top = createPipeSegment("top")
  const bottom = createPipeSegment("bottom")

  pipeElement.append(top)
  pipeElement.append(bottom)

  pipeElement.classList.add("pipe")
  pipeElement.style.setProperty(
    "--hole-top", randomNumberBetween(HOLE_HEIGHT * 1.5, window.innerHeight - HOLE_HEIGHT * 0.5)
  )

  const currentPipe = {
    get left() {
      return parseFloat(getComputedStyle(pipeElement).getPropertyValue("--pipe-left"))
    },
    set left(value) {
      pipeElement.style.setProperty("--pipe-left", value)
    },
    remove() {
      pipes = pipes.filter(pipe => pipe !== currentPipe)
      pipeElement.remove()
    },
    rects() {
      return [
        top.getBoundingClientRect(),
        bottom.getBoundingClientRect(),
      ]
    }
  }
  currentPipe.left = window.innerWidth
  document.body.append(pipeElement)
  pipes.push(currentPipe)
}

function createPipeSegment(position) {
  const segment = document.createElement("div")
  segment.classList.add("segment", position)
  return segment
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}