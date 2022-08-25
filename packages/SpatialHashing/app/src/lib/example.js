import createSpatialHashSystem from "../../../spatial-hash.js"

export default function buildSpatialHashExampleScene(canvas, cellSize = 80, numItems = 1000) {
  const ctx = canvas.getContext("2d")
  scaleCanvasToPixelRatioAndParent(canvas)

  // create a grid that fills the canvas
  const grid = createSpatialHashSystem(canvas.width, canvas.height, cellSize)

  for (let i = 0; i < numItems; i++) {
    const newItem = { x: Math.random() * grid.width, y: Math.random() * grid.height }
    grid.insert(newItem)
  }

  let queryX = 0
  let queryY = 0
  const queryWidth = 100
  const queryHeight = 75

  //////////////////////////////////////////////////////////////////////////////
  // animate
  //////////////////////////////////////////////////////////////////////////////
  {
    let theta = 0
    let radius = 200
    const speed = 0.3
    const center = { x: canvas.clientWidth * 0.5, y: canvas.clientHeight * 0.5 }

    let lastTickTime = 0
    ;(function tick(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const deltatime = t - lastTickTime
      if (deltatime > 0) {
        lastTickTime = t

        // update query position
        {
          theta += speed * (deltatime / 1000)
          queryX = center.x + Math.cos(theta) * radius
          queryY = center.y + Math.sin(theta) * radius
        }

        // query items
        const queryResult = grid.boxQuery(queryX, queryY, queryWidth, queryHeight)

        // draw
        {
          // draw grid and items
          drawGrid(grid)
          drawGridItems(grid)

          // draw query
          drawQuery(queryX, queryY, queryWidth, queryHeight, grid.cellSize)
          queryResult.forEach((item) => drawPoint(item.x, item.y, 6, "green"))
        }
      }

      requestAnimationFrame(tick)
    })(0)
  }

  function query(x, y, radius) {}

  /////////////////////////////////////
  // Drawing functions
  /////////////////////////////////////

  function drawQuery(x, y, w, h, cellSize) {
    drawPoint(x, y, 3, "green", true)
    drawBox(x - w * 0.5, y - h * 0.5, w, h, "green", 3)

    const xMin = Math.floor((x - w * 0.5) / cellSize) * cellSize
    const yMin = Math.floor((y - h * 0.5) / cellSize) * cellSize
    const xMax = Math.ceil((x + w * 0.5) / cellSize) * cellSize
    const yMax = Math.ceil((y + h * 0.5) / cellSize) * cellSize

    drawBox(xMin, yMin, xMax - xMin, yMax - yMin, "blue", 1)
  }

  function drawGrid(grid) {
    const numRows = grid.height / grid.cellSize
    const numCols = grid.width / grid.cellSize

    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const { cellSize } = grid
        drawBox(c * cellSize, r * cellSize, grid.cellSize, cellSize, "lightgray", 1)
      }
    }
  }

  function drawGridItems(grid) {
    const table = grid.hashtable

    table.forEach((cell) => {
      cell.forEach((v) => {
        drawPoint(v.x, v.y, 2, "red", true)
      })
    })
  }

  function drawPoint(x, y, rad, color, fill = false) {
    ctx.beginPath()
    ctx.arc(x, y, rad, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.strokeStyle = color
    ctx.stroke()
    if (fill) ctx.fill()
  }

  function drawBox(x, y, w, h, color, lineWidth) {
    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.stroke()
  }

  function scaleCanvasToPixelRatioAndParent(canvas) {
    canvas.width = canvas.parentElement.offsetWidth
    canvas.height = canvas.parentElement.offsetHeight

    const dpi = window.devicePixelRatio || 1
    const wid = canvas.width
    const hei = canvas.width

    canvas.width = wid * dpi
    canvas.height = hei * dpi

    canvas.style.width = `${wid}px`
    canvas.style.height = `${hei}px`

    canvas.getContext("2d").scale(dpi, dpi)
  }
}
