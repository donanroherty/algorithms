import {
  rectContainsRect,
  rectContainsPoint,
  rectIntersectsRect,
  sphericalRegionQuery,
  distanceTo,
} from "./sphericalRegionQuery"
import { pointQuadTree } from "./pointQuadTree"

test("sphericalRegionQuery() returns quadtree points overlapped by circle", () => {
  const w = 400
  const h = 400
  // Explicit check
  {
    const p0 = { x: 100, y: 100 }
    const p1 = { x: 100, y: 300 }
    const p2 = { x: 300, y: 300 } // exceed capacity of root cell
    const p3 = { x: 55, y: 30 }
    const pts = [p0, p1, p2, p3]

    const qt = pointQuadTree({ x: 0, y: 0, w, h }, 2, pts)
    const containedPts = sphericalRegionQuery(qt, { x: 70, y: 80 }, 60)

    expect(containedPts).toContain(p0)
    expect(containedPts).toContain(p3)
  }

  // Test with random inputs
  for (let i = 0; i < 1000; i++) {
    let points = new Array(10).fill(undefined).map((_) => {
      return { x: Math.random() * w, y: Math.random() * h }
    })

    let pos = {
      x: Number((Math.random() * w).toPrecision(1)),
      y: Number((Math.random() * h).toPrecision(1)),
    }

    let rad = Number((Math.random() * 100).toPrecision(1))

    const qt = pointQuadTree({ x: 0, y: 0, w, h }, 2, points)

    const containedPts = sphericalRegionQuery(qt, pos, rad)

    const ptsInRange = points.filter((pt, i) => {
      const inRng = distanceTo(pt, pos) < rad
      return inRng
    })

    expect(ptsInRange.length).toBe(containedPts.length)
  }
})

test("rectIntersectsRect() returns true if bounding boxes overlap", () => {
  const bbTest = { x: 0, y: 0, w: 50, h: 50 }
  const bbA = { x: 25, y: 25, w: 70, h: 70 }
  const bbB = { x: 50, y: 50, w: 50, h: 50 }
  const bbC = { x: 51, y: 51, w: 50, h: 50 }
  expect(rectIntersectsRect(bbTest, bbA)).toBeTruthy()
  expect(rectIntersectsRect(bbTest, bbB)).toBeTruthy()
  expect(rectIntersectsRect(bbTest, bbC)).toBeFalsy()
})

test("rectContainsRect() returns true if rect is contained withing circle", () => {
  const bbA = { x: 5, y: 10, w: 100, h: 100 }
  const bbB = { x: 25, y: 25, w: 50, h: 50 }
  const bbC = { x: 60, y: 70, w: 50, h: 50 }
  expect(rectContainsRect(bbA, bbB)).toBeTruthy()
  expect(rectContainsRect(bbA, bbC)).toBeFalsy()
})

test("rectContainsPoint() returns true if point is withing rect bounds", () => {
  const bb = { x: 5, y: 10, w: 100, h: 100 }
  const p0 = { x: 45, y: 90 }
  const p1 = { x: 2, y: 90 }
  const p2 = { x: 45, y: 111 }
  expect(rectContainsPoint(p0, bb)).toBeTruthy()
  expect(rectContainsPoint(p1, bb)).toBeFalsy()
  expect(rectContainsPoint(p2, bb)).toBeFalsy()
})
