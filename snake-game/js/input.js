export let direction = { x: 0, y: 0 }

document.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "ArrowUp":
      if (direction.y === 1) return
      direction = { x: 0, y: -1 }
      break
    case "ArrowDown":
      if (direction.y === -1) return
      direction = { x: 0, y: 1 }
      break
    case "ArrowLeft":
      if (direction.x === 1) return
      direction = { x: -1, y: 0 }
      break
    case "ArrowRight":
      if (direction.x === -1) return
      direction = { x: 1, y: 0 }
      break
  }
})
