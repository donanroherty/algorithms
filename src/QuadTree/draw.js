import { pointQuadTree } from "./pointQuadTree.js"
import { distanceTo } from "./sphericalRegionQuery.js"

draw()

function draw() {
  const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("cvs"))
  const ctx = canvas.getContext("2d")

  setupCanvas(400, 400)

  function setupCanvas(w, h) {
    canvas.style.transform = "scaleY(-1)" // flip y axis

    // scale canvas to device pixel ratio to give sharp 1px lines
    canvas.setAttribute("width", `${w * 2}px`)
    canvas.setAttribute("height", `${h * 2}px`)

    const scaling = window.devicePixelRatio || 1
    ctx.scale(scaling, scaling)

    const { clientWidth, clientHeight } = canvas
    canvas.style.width = `${String(clientWidth * 0.5)}px`
    canvas.style.height = `${String(clientHeight * 0.5)}px`

    ctx.beginPath()
    ctx.rect(0, 0, w, h)
    ctx.strokeStyle = "black"
    ctx.fillStyle = "lightgray"
    ctx.fill()
    ctx.stroke()
  }

  const { clientWidth, clientHeight } = canvas

  const p0 = { x: 100, y: 100 }
  const p1 = { x: 100, y: 300 }
  const p2 = { x: 300, y: 300 }
  const p3 = { x: 55, y: 30 }
  let pts = [p0, p1, p2, p3]

  let circle = { x: 70, y: 80, radius: 60 }

  const qt = pointQuadTree({ x: 0, y: 0, w: clientWidth, h: clientHeight }, 1, pts)

  renderQuadTree(qt)

  pts.forEach((pt, i) => {
    const inRange = distanceTo(pt, { x: circle.x, y: circle.y }) < circle.radius
    const col = inRange ? "red" : "blue"
    renderPoint(pt, 2, col, true)
  })

  renderPoint({ x: circle.x, y: circle.y }, 3, "green")
  renderPoint({ x: circle.x, y: circle.y }, circle.radius, "green")

  function renderPoint(pt, radius, color, fill = false) {
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, radius, 0, 2 * Math.PI, true)
    ctx.strokeStyle = color
    ctx.stroke()
    if (fill) {
      ctx.fillStyle = color
      ctx.fill()
    }
  }

  // render cells recursivley
  function renderQuadTree(cell) {
    ctx.beginPath()
    ctx.rect(cell.bounds.x, cell.bounds.y, cell.bounds.w, cell.bounds.h)
    ctx.strokeStyle = "blue"
    ctx.stroke()

    const subdivs = cell.subdivisions
    if (subdivs) {
      const { bottomLeft, topLeft, topRight, bottomRight } = subdivs

      renderQuadTree(bottomLeft)
      renderQuadTree(topLeft)
      renderQuadTree(topRight)
      renderQuadTree(bottomRight)
    }
  }
}
