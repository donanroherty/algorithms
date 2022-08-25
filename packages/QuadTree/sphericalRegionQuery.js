/** @typedef {{x: number;y: number;w: number;h: number;}} Rect */
/** @typedef {{x: number;y: number;}} Point */
/** @typedef { import("./pointQuadTree").QuadTree } QuadTree*/

/**
 * For a given quadtree and circle, return all points inside the circle
 * @param {QuadTree} quadtree
 * @param {Point} position
 * @param {number} radius
 * @returns
 */
function sphericalRegionQuery(quadtree, position, radius) {
  const rect = {
    x: position.x - radius,
    y: position.y - radius,
    w: radius * 2,
    h: radius * 2,
  }

  return recurse(quadtree)

  /**
   * @param {QuadTree} node
   */
  function recurse(node, inPoints = []) {
    const pts = inPoints

    // if rect is fully contained in circle, return all points
    if (circleContainsRect(rect, position, radius)) {
      return [...pts, ...node.points]
    }

    if (rectIntersectsRect(rect, node.bounds)) {
      if (node.subdivisions) {
        // recurse on subdivs, return concatenated points
        const blPts = recurse(node.subdivisions.bottomLeft, [])
        const tlPts = recurse(node.subdivisions.topLeft, [])
        const trPts = recurse(node.subdivisions.topRight, [])
        const brPts = recurse(node.subdivisions.bottomRight, [])

        return [...pts, ...blPts, ...tlPts, ...trPts, ...brPts]
      }

      // if node has no subdivs its a leaf node, test all points
      const out = node.points.filter((pt) => {
        return distanceTo(pt, position) < radius
      })

      return [...pts, ...out]
    }

    return pts
  }
}

/**
 * @param {Rect} rect
 * @param {Point} position
 * @param {number} radius
 */
function circleContainsRect(rect, position, radius) {
  const dx = Math.max(position.x - rect.x, position.x - rect.x + rect.w)
  const dy = Math.max(position.y - rect.y, position.y - rect.y + rect.h)
  return dx <= radius && dy <= radius
}

/**
 * Returns true given rects overlap
 * @param {Rect} a
 * @param {Rect} b
 */
function rectIntersectsRect(a, b) {
  return (
    rectContainsPoint({ x: b.x, y: b.y }, a) ||
    rectContainsPoint({ x: b.x, y: b.y + b.h }, a) ||
    rectContainsPoint({ x: b.x + b.w, y: b.y + b.h }, a) ||
    rectContainsPoint({ x: b.x + b.w, y: b.y }, a) ||
    rectContainsPoint({ x: a.x, y: a.y }, b) ||
    rectContainsPoint({ x: a.x, y: a.y + a.h }, b) ||
    rectContainsPoint({ x: a.x + a.w, y: a.y + a.h }, b) ||
    rectContainsPoint({ x: a.x + a.w, y: a.y }, b)
  )
}

/**
 * @param {Rect} a
 * @param {Rect} b
 */
function rectContainsRect(a, b) {
  return b.x >= a.x && b.y >= a.y && b.x + b.w <= a.x + a.w && b.y + b.h <= a.y + a.h
}

/**
 * @param {Point} pt
 * @param {Rect} rect
 */
function rectContainsPoint(pt, rect) {
  const res = pt.x >= rect.x && pt.y >= rect.y && pt.x <= rect.x + rect.w && pt.y <= rect.y + rect.h
  return res
}

/**
 * Returns the distance between two points
 * @param {Point} a
 * @param {Point} b
 */
function distanceTo(a, b) {
  const ab = { x: b.x - a.x, y: b.y - a.y }
  return Math.sqrt(ab.x * ab.x + ab.y * ab.y)
}

export { rectContainsRect, rectContainsPoint, rectIntersectsRect, sphericalRegionQuery, distanceTo }
