/* Point Quad Tree
 * A point quad tree is data structure which recursivly subdivides to accomodate
 * a set of points based on the capacity of a node.
 * A quad tree consists of cells, 2D rectangles with a position, a width and a height.
 * When a cell is subdivided it is split into 4 cells along it's vertical and horizontal
 * midpoints. The parent cell maintains a reference to child nodes and all cells maintain
 * a list of points contained in the cell.
 * A quad tree is useful in a variety of cases where approximation of point positions can
 * reduce the number of operations required to make queries between points.
 * Use cases include image compression, measuring distance between related points and
 * image compression.
 */

/** @typedef {{x:number, y:number}} Point */
/** @typedef {{x:number, y:number, w:number, h:number}} Bounds */
/** @typedef {{bottomLeft:QuadTree, topLeft:QuadTree,topRight:QuadTree,bottomRight:QuadTree}} Subdivisions */
/** @typedef {{bounds:Bounds, capacity:number, points:Point[], subdivisions:Subdivisions}} QuadTree */

/**
 * @param {Bounds} bounds Bounding 2D rect of the node
 * @param {number} capacity Max points in a node before it is subdivided
 * @param {Point[]} points // Points to add to a node
 * @returns {QuadTree}
 */
function pointQuadTree(bounds, capacity, points) {
  const subdivisions = points.length > capacity ? subdivide(bounds, capacity, points) : null

  return {
    bounds,
    capacity,
    points,
    subdivisions,
  }
}

/** Recursivley search a quad tree from the root to find the cell containing a given point
 * @param {Point} pt
 * @param {QuadTree} qt
 */
function search(pt, qt) {
  if (!isInBounds(pt, qt.bounds)) return undefined

  if (!qt.subdivisions) return qt

  return (
    search(pt, qt.subdivisions.bottomLeft) ||
    search(pt, qt.subdivisions.topLeft) ||
    search(pt, qt.subdivisions.topRight) ||
    search(pt, qt.subdivisions.bottomRight)
  )
}

/**
 * Returns true if a point is contained or exactly on the edge of a bounding rectangle
 * @param {Point} pt
 * @param {Bounds} bounds
 */
function isInBounds(pt, bounds) {
  const { x, y, w, h } = bounds
  return pt.x >= x && pt.x <= x + w && pt.y >= y && pt.y <= y + h
}

/**
 * Recursivly subdivides a cell based on point count and capacity.
 * Returns references to child cells
 * @param {Bounds} bounds
 * @param {number} cap
 * @param {Point[]} pts
 */
function subdivide(bounds, cap, pts) {
  const { x, y, w, h } = bounds
  const bl = { x: x, y: y, w: w * 0.5, h: h * 0.5 }
  const tl = { x: x, y: y + h * 0.5, w: w * 0.5, h: h * 0.5 }
  const tr = { x: x + w * 0.5, y: y + h * 0.5, w: w * 0.5, h: h * 0.5 }
  const br = { x: x + w * 0.5, y: y, w: w * 0.5, h: h * 0.5 }

  // Perform includes
  const divPts = pts.reduce(
    (acc, pt) => {
      if (isInBounds(pt, bl)) acc.bl.push(pt)
      else if (isInBounds(pt, tl)) acc.tl.push(pt)
      else if (isInBounds(pt, tr)) acc.tr.push(pt)
      else if (isInBounds(pt, br)) acc.br.push(pt)
      return acc
    },
    { bl: [], tl: [], tr: [], br: [] }
  )

  const subdivs = {
    bottomLeft: pointQuadTree(bl, cap, divPts.bl),
    topLeft: pointQuadTree(tl, cap, divPts.tl),
    topRight: pointQuadTree(tr, cap, divPts.tr),
    bottomRight: pointQuadTree(br, cap, divPts.br),
  }

  return subdivs
}

export { pointQuadTree, search }
