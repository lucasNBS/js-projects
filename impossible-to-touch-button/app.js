const button = document.querySelector("button")

button.addEventListener("click", () => {
  alert("That's cheating!")
  window.close()
})

const container = document.querySelector("main")
const offset = 100

container.addEventListener("mousemove", (e) => {
  const mouseX = e.pageX
  const mouseY = e.pageY
  
  const buttonBox = button.getBoundingClientRect()

  const horizontalDistanceFromCenter = distanceFromCenter(buttonBox.x, mouseX, buttonBox.width)
  const verticalDistanceFromCenter = distanceFromCenter(buttonBox.y, mouseY, buttonBox.height)

  const horizontalOffset = buttonBox.width / 2 + offset
  const verticalOffset = buttonBox.height / 2 + offset

  if (
    Math.abs(horizontalDistanceFromCenter) <= horizontalOffset &&
    Math.abs(verticalDistanceFromCenter) <= verticalOffset
  ) {
    setButtonPosition(
      buttonBox.x + horizontalOffset / horizontalDistanceFromCenter * 10,
      buttonBox.y + verticalOffset / verticalDistanceFromCenter * 10
    )
  }
})

function distanceFromCenter(boxPosition, mousePosition, boxSize) {
  return boxPosition - mousePosition + boxSize / 2
}

function setButtonPosition(left, top) {
  const buttonBox = button.getBoundingClientRect()

  const width = container.getBoundingClientRect().width
  const height = container.getBoundingClientRect().height

  if (left <= 0) {
    button.style.top = `${top}px`
    button.style.left = `${width - buttonBox.width}px`
  } else if (left + buttonBox.width >= width) {
    button.style.top = `${top}px`
    button.style.left = `${0}px`
  } else if (top <= 0) {
    button.style.top = `${height - buttonBox.height}px`
    button.style.left = `${left}px`
  } else if (top + buttonBox.height >= height) {
    button.style.top = `${0}px`
    button.style.left = `${left}px`
  } else {
    button.style.top = `${top}px`
    button.style.left = `${left}px`
  }
}