'use strict'

let player
let board
const lineColor = '#ddd'
const canvas = document.getElementById('tic-tac-toe-board')
const context = canvas.getContext('2d')
const canvasSize = 500
const sectionSize = canvasSize / 3
canvas.width = canvasSize
canvas.height = canvasSize
context.translate(0.5, 0.5)

function checkLine (a, b, c) {
  if (a === '') return false

  return a === b && a === c && b === c
}

function checkForEndGame () {
  for (let i = 0; i < 3; i++) {
    if (checkLine(...board[i]) || checkLine(board[0][i], board[1][i], board[2][i])) return true
  }

  return checkLine(board[0][0], board[1][1], board[2][2]) || checkLine(board[2][0], board[1][1], board[0][2])
}

function createBoard () {
  const out = []

  for (let i = 0; i < 3; i++) {
    out.push([])

    for (let j = 0; j < 3; j++) {
      out[i].push('')
    }
  }

  return out
}

function getBoardCoordinates (mouse) {
  let x
  let y

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      x = i * sectionSize
      y = j * sectionSize

      if (mouse.x >= x && mouse.x <= x + sectionSize && mouse.y >= y && mouse.y <= y + sectionSize) {
        return {x: i, y: j}
      }
    }
  }
}

function isCellAvailable (i, j) {
  return board[i][j] === ''
}

function addPlayingPiece (i, j) {
  let x = i * sectionSize
  let y = j * sectionSize

  clearPlayingArea(x, y)

  board[i][j] = player

  if (player) drawO(x, y)
  else drawX(x, y)
}

function clearPlayingArea (x, y) {
  context.fillStyle = '#fff'

  context.fillRect(x, y, sectionSize, sectionSize)
}

function drawO (x, y) {
  const centerX = x + sectionSize / 2
  const centerY = y + sectionSize / 2
  const radius = (sectionSize - 100) / 2

  context.lineWidth = 10
  context.strokeStyle = '#01bBC2'
  context.beginPath()
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI)
  context.stroke()
}

function drawX (x, y) {
  context.strokeStyle = '#f1be32'

  context.beginPath()

  const offset = 50

  context.moveTo(x + offset, y + offset)
  context.lineTo(x + sectionSize - offset, y + sectionSize - offset)
  context.moveTo(x + offset, y + sectionSize - offset)
  context.lineTo(x + sectionSize - offset, y + offset)
  context.stroke()
}

function drawLines (lineWidth, strokeStyle) {
  const lineStart = 4
  const lineLength = canvasSize - 5

  context.lineWidth = lineWidth
  context.lineCap = 'round'
  context.strokeStyle = strokeStyle
  context.beginPath()

  for (let j = 1; j <= 2; j++) {
    context.moveTo(lineStart, j * sectionSize)
    context.lineTo(lineLength, j * sectionSize)
  }

  for (let i = 1; i <= 2; i++) {
    context.moveTo(i * sectionSize, lineStart)
    context.lineTo(i * sectionSize, lineLength)
  }

  context.stroke()
}

function getCanvasMousePosition (event) {
  const rect = canvas.getBoundingClientRect()

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
}

function updateTurn () {
  player = !player

  document.getElementById('message').innerText = `It's Player ${player ? 'O' : 'X'} Turn`
}

window.addEventListener('load', () => {
  updateTurn()
  board = createBoard()

  drawLines(10, lineColor)
})

canvas.addEventListener('mouseup', event => {
  const canvasMousePosition = getCanvasMousePosition(event)
  const boardCoordinates = getBoardCoordinates(canvasMousePosition)

  if (!isCellAvailable(boardCoordinates.x, boardCoordinates.y)) return

  addPlayingPiece(boardCoordinates.x, boardCoordinates.y)
  drawLines(10, lineColor)

  if (checkForEndGame()) document.getElementById('message').innerText = `Player ${player ? 'O' : 'X'} WINS!`
  else updateTurn()
})
