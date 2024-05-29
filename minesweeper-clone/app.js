
const mineCountElement = document.querySelector("[data-mine-count]")
mineCountElement.innerText = 10

const boardElement = document.querySelector(".board")
boardElement.style.setProperty("--size", 10)

const messageText = document.querySelector(".subtext")

const TILE_STATUSES = {
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MARKED: "marked"
}

function createBoard(boardSize, numberOfMines) {
  const board = []
  const minePositions = getMinePositions(boardSize, numberOfMines)

  for (let x = 0; x < boardSize; x++) {
    const row = []
    for (let y = 0; y < boardSize; y++) {
      const element = document.createElement('div')
      element.dataset.status = TILE_STATUSES.HIDDEN
      const tile = {
        element,
        x,
        y,
        mine: minePositions.some(position => positionMatch(position, { x, y })),
        get status() {
          return element.dataset.status
        },
        set status(value) {
          this.element.dataset.status = value
        },
      }

      row.push(tile)
    }
    board.push(row)
  }

  return board
}

function getMinePositions(boardSize, numberOfMines) {
  const positions = []

  while (positions.length < numberOfMines) {
    const newPosition = {
      x: getRandomNumber(boardSize),
      y: getRandomNumber(boardSize)
    }

    if (!positions.some(position => positionMatch(position, newPosition))) {
      positions.push(newPosition)
    }
  }

  return positions
}

function positionMatch(positionA, positionB) {
  return positionA.x === positionB.x && positionA.y === positionB.y
}

function getRandomNumber(number) {
  return Math.floor(Math.random() * number)
}

const board = createBoard(10, 10)

board.forEach(row => {
  row.forEach(tile => {
    boardElement.append(tile.element)
    tile.element.addEventListener("click", () => {
      revealTile(tile)
      checkGameEnd()
    })
    tile.element.addEventListener("contextmenu", (e) => {
      e.preventDefault()
      markTile(tile)
      listMinesLeft()
    })
  })
})

function listMinesLeft() {
  const markedTilesCount = board.reduce((count, row) => {
    return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
  }, 0)

  mineCountElement.textContent = 10 - markedTilesCount
}

function revealTile(tile) {
  if (tile.status !== TILE_STATUSES.HIDDEN) {
    return
  }

  if (tile.mine) {
    tile.status = TILE_STATUSES.MINE
    return
  }

  tile.status = TILE_STATUSES.NUMBER

  const adjacentTiles = getNearbyTiles(tile)
  const mines = adjacentTiles.filter(t => t.mine)

  if (mines.length === 0) {
    adjacentTiles.forEach(t => revealTile(t))
  } else {
    tile.element.textContent = mines.length
  }
}

function markTile(tile) {
  if (tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.MARKED) {
    return
  }

  if (tile.status === TILE_STATUSES.MARKED) {
    tile.status = TILE_STATUSES.HIDDEN
  } else {
    tile.status = TILE_STATUSES.MARKED
  }
}

function getNearbyTiles({ x, y }) {
  const tiles = []

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[x + xOffset]?.[y + yOffset]

      if (tile) {
        tiles.push(tile)
      }
    }
  }

  return tiles
}

function checkGameEnd() {
  const win = checkWin()
  const lost = checkLost()

  if (win || lost) {
    boardElement.addEventListener('click', (e) => {
      e.stopImmediatePropagation()
    }, { capture: true })
    boardElement.addEventListener('contextmenu', (e) => {
      e.stopImmediatePropagation()
    }, { capture: true })
  }

  if (win) {
    messageText.innerText = "You Win"
  }

  if (lost) {
    messageText.innerText = "You Lost"
    board.forEach(row => {
      row.forEach(tile => {
        if (tile.status === TILE_STATUSES) markTile(tile)
        if (tile.mine) revealTile(tile)
      })
    })
  }
}

function checkWin() {
  return board.every(row => {
    return row.every(tile => {
      return (
        tile.status === TILE_STATUSES.NUMBER ||
        (tile.mine &&
          (tile.status === TILE_STATUSES.HIDDEN || tile.status === TILE_STATUSES.MARKED))
      )
    })
  })
}

function checkLost() {
  return board.some(row => {
    return row.some(tile => {
      return tile.status === TILE_STATUSES.MINE
    })
  })
}