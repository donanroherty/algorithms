import { pointQuadTree, search } from "./pointQuadTree"

test("it initializes a root cell with correct properties", () => {
  const pts = [
    { x: 23, y: 90 },
    { x: 40, y: 99.9 },
    { x: 21, y: 75 },
  ]

  const qt = pointQuadTree({ x: 20, y: 54, w: 200, h: 100 }, 4, pts)

  expect(qt.bounds).toEqual({ x: 20, y: 54, w: 200, h: 100 })
  expect(qt.capacity).toBe(4)
  expect(qt.subdivisions).toBeNull()
  expect(qt.points).toContain(pts[0])
  expect(qt.points).toContain(pts[1])
  expect(qt.points).toContain(pts[2])
})

test("quadtree search returns leaf node containing point", () => {
  const p0 = { x: 100, y: 100 }
  const p1 = { x: 100, y: 300 }
  const p2 = { x: 300, y: 300 } // exceed capacity of root cell
  const p3 = { x: 55, y: 30 }
  const p4 = { x: 85, y: 28 } // exceed capacity of the bl
  const p5 = { x: 90, y: 34 }
  const p6 = { x: 95, y: 30 } // exceed capacity of bl->bl->tr cell
  const pts = [p0, p1, p2, p3, p4, p5, p6]

  const qt = pointQuadTree({ x: 0, y: 0, w: 400, h: 400 }, 2, pts)
  const leaf = search({ x: 95, y: 95 }, qt)

  expect(leaf).toBeDefined()

  let divs = qt.subdivisions
  const blDivs = divs.bottomLeft.subdivisions
  const bl_bl_tr = blDivs.bottomLeft.subdivisions.topRight
  expect(leaf).toBe(bl_bl_tr)
})

test("quadtree search returns null if containing leaf node is not found", () => {
  const p0 = { x: 100, y: 100 }
  const p1 = { x: 100, y: 300 }
  const p2 = { x: 300, y: 300 } // exceed capacity of root cell
  const p3 = { x: 55, y: 30 }
  const p4 = { x: 85, y: 28 } // exceed capacity of the bl
  const p5 = { x: 90, y: 34 }
  const p6 = { x: 95, y: 30 } // exceed capacity of bl->bl->tr cell
  const pts = [p0, p1, p2, p3, p4, p5, p6]

  const qt = pointQuadTree({ x: 0, y: 0, w: 400, h: 400 }, 2, pts)
  const leaf = search({ x: -2, y: 350 }, qt)

  expect(leaf).toBeUndefined()
})

test("cells are subdivided if capacity is exceeded", () => {
  const bounds = { x: 0, y: 0, w: 100, h: 100 }

  const pts = [
    { x: 25, y: 25 },
    { x: 25, y: 75 },
    { x: 75, y: 75 },
    { x: 75, y: 25 }, // exceed capacity
  ]

  const qt = pointQuadTree(bounds, 3, pts)

  expect(qt.subdivisions).toBeDefined()
  const { bottomLeft, topLeft, topRight, bottomRight } = qt.subdivisions

  const { x, y, w, h } = bounds
  expect(bottomLeft.bounds).toEqual({ x, y, w: w * 0.5, h: h * 0.5 })
  expect(topLeft.bounds).toEqual({ x, y: y + h * 0.5, w: w * 0.5, h: h * 0.5 })
  expect(topRight.bounds).toEqual({ x: x + w * 0.5, y: y + h * 0.5, w: w * 0.5, h: h * 0.5 })
  expect(bottomRight.bounds).toEqual({ x: x + w * 0.5, y: y, w: w * 0.5, h: h * 0.5 })
})

test("it correctly distributes points to subdivisions", () => {
  const pts = [
    { x: 25, y: 25 },
    { x: 25, y: 75 },
    { x: 75, y: 75 },
    { x: 75, y: 25 },
    { x: 80, y: 20 }, // exceed capacity
  ]

  const qt = pointQuadTree({ x: 0, y: 0, w: 100, h: 100 }, 4, pts)
  const { bottomLeft, topLeft, topRight, bottomRight } = qt.subdivisions

  expect(bottomLeft.points).toContain(pts[0])
  expect(topLeft.points).toContain(pts[1])
  expect(topRight.points).toContain(pts[2])
  expect(bottomRight.points).toContain(pts[3])
  expect(bottomRight.points).toContain(pts[4])
})

test("points on an edge are added to a single subdiv, in CW order from bottom left", () => {
  const pts = [
    { x: 25, y: 50 },
    { x: 75, y: 50 },
    { x: 50, y: 50 },
  ]

  const qt = pointQuadTree({ x: 0, y: 0, w: 100, h: 100 }, 2, pts)
  const { bottomLeft, topLeft, topRight, bottomRight } = qt.subdivisions

  expect(bottomLeft.points).toContain(pts[0])
  expect(topLeft.points).not.toContain(pts[0])

  expect(topRight.points).toContain(pts[1])
  expect(bottomRight.points).not.toContain(pts[1])

  expect(bottomLeft.points).toContain(pts[2])
  expect(topLeft.points).not.toContain(pts[2])
  expect(topRight.points).not.toContain(pts[2])
  expect(bottomRight.points).not.toContain(pts[2])
})

test("deep quadtree subdivisions and point distribution", () => {
  const p0 = { x: 100, y: 100 }
  const p1 = { x: 100, y: 300 }
  const p2 = { x: 300, y: 300 } // exceed capacity of root cell
  const p3 = { x: 55, y: 30 }
  const p4 = { x: 85, y: 28 } // exceed capacity of the bl
  const p5 = { x: 90, y: 34 }
  const p6 = { x: 95, y: 30 } // exceed capacity of bl->bl->tr cell
  const pts = [p0, p1, p2, p3, p4, p5, p6]

  const qt = pointQuadTree({ x: 0, y: 0, w: 400, h: 400 }, 2, pts)

  // level 0
  let divs = qt.subdivisions
  expect(divs).not.toBeNull()
  expect(divs.bottomLeft.subdivisions).not.toBeNull()
  expect(divs.topLeft.subdivisions).toBeNull()
  expect(divs.topRight.subdivisions).toBeNull()
  expect(divs.bottomRight.subdivisions).toBeNull()

  expect(divs.bottomLeft.points).toEqual([p0, p3, p4, p5, p6])
  expect(divs.topLeft.points).toEqual([p1])
  expect(divs.topRight.points).toEqual([p2])
  expect(divs.bottomRight.points).toEqual([])

  //level 1
  const blDivs = divs.bottomLeft.subdivisions
  expect(blDivs.bottomLeft.subdivisions).not.toBeNull()
  expect(blDivs.topLeft.subdivisions).toBeNull()
  expect(blDivs.topRight.subdivisions).toBeNull()
  expect(blDivs.bottomRight.subdivisions).toBeNull()

  expect(blDivs.bottomLeft.points).toEqual([p0, p3, p4, p5, p6])
  expect(blDivs.topLeft.points).toEqual([])
  expect(blDivs.topRight.points).toEqual([])
  expect(blDivs.bottomRight.points).toEqual([])

  //level 2
  const bl_bl_Divs = blDivs.bottomLeft.subdivisions
  expect(bl_bl_Divs.bottomLeft.subdivisions).toBeNull()
  expect(bl_bl_Divs.topLeft.subdivisions).toBeNull()
  expect(bl_bl_Divs.topRight.subdivisions).toBeNull()
  expect(bl_bl_Divs.bottomRight.subdivisions).not.toBeNull()

  expect(bl_bl_Divs.bottomLeft.points).toEqual([])
  expect(bl_bl_Divs.topLeft.points).toEqual([])
  expect(bl_bl_Divs.topRight.points).toEqual([p0])
  expect(bl_bl_Divs.bottomRight.points).toEqual([p3, p4, p5, p6])

  // level 3
  const bl_bl_br_Divs = bl_bl_Divs.bottomRight.subdivisions
  expect(bl_bl_br_Divs.bottomLeft.subdivisions).toBeNull()
  expect(bl_bl_br_Divs.topLeft.subdivisions).toBeNull()
  expect(bl_bl_br_Divs.topRight.subdivisions).not.toBeNull()
  expect(bl_bl_br_Divs.bottomRight.subdivisions).toBeNull()

  expect(bl_bl_br_Divs.bottomLeft.points).toEqual([])
  expect(bl_bl_br_Divs.topLeft.points).toEqual([p3])
  expect(bl_bl_br_Divs.topRight.points).toEqual([p4, p5, p6])
  expect(bl_bl_br_Divs.bottomRight.points).toEqual([])

  // level 4
  const bl_bl_br_tr_Divs = bl_bl_br_Divs.topRight.subdivisions
  expect(bl_bl_br_tr_Divs.bottomLeft.subdivisions).toBeNull()
  expect(bl_bl_br_tr_Divs.topLeft.subdivisions).toBeNull()
  expect(bl_bl_br_tr_Divs.topRight.subdivisions).toBeNull()
  expect(bl_bl_br_tr_Divs.bottomRight.subdivisions).toBeNull()

  expect(bl_bl_br_tr_Divs.bottomLeft.points).toEqual([p4])
  expect(bl_bl_br_tr_Divs.topLeft.points).toEqual([])
  expect(bl_bl_br_tr_Divs.topRight.points).toEqual([])
  expect(bl_bl_br_tr_Divs.bottomRight.points).toEqual([p5, p6])
})
