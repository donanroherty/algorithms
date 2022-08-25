/**
 * @param {number} width
 * @param {number} height
 * @param {number} cellSize
 */
export default function createSpatialHashSystem(width, height, cellSize) {
  const hashtable = new Map()

  return {
    hashtable,
    width,
    height,
    cellSize,
    insert,
    boxQuery,
    circleQuery,
  }

  /**
   * Insert an item into the grid
   * @param { { x: number, y: number } } item
   */
  function insert(item) {
    const { x, y } = item
    const col = Math.floor(x / cellSize)
    const row = Math.floor(y / cellSize)

    const key = `${col},${row}`

    if (hashtable.has(key)) {
      hashtable.get(key).push(item)
    } else {
      hashtable.set(key, [item])
    }
  }

  /**
   * boxQuery returns all items that are in the box defined by the given parameters
   * @param {number} x - x position of the box's center
   * @param {number} y - y position of the box's center
   * @param {number} width - width of the box
   * @param {number} height - height of the box
   * @param {boolean} [precise] if true, return items that are actually in the box
   */
  function boxQuery(x, y, width, height, precise = false) {
    // get the range of cell indices that the box intersects
    const xMin = Math.floor((x - width * 0.5) / cellSize)
    const yMin = Math.floor((y - height * 0.5) / cellSize)
    const xMax = Math.ceil((x + width * 0.5) / cellSize)
    const yMax = Math.ceil((y + height * 0.5) / cellSize)

    const s = new Set()

    // for each cell, get the items in the cell and add them to the set
    for (let x = xMin; x < xMax; x++) {
      for (let y = yMin; y < yMax; y++) {
        const hash = `${x},${y}`
        if (hashtable.has(hash)) {
          hashtable.get(hash).forEach((item) => {
            if (precise) {
              if (item.x >= x && item.y >= y && item.x < x + width && item.y < y + height) {
                s.add(item)
              }
            } else {
              s.add(item)
            }
          })
        }
      }
    }

    return s
  }

  /**
   * circleQuery returns an array of items that are in the given circle
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   */
  function circleQuery(x, y, radius) {
    const boxQryRes = boxQuery(x, y, radius, radius)
    const s = new Set()
    boxQryRes.forEach((item) => {
      const { itemX, itemY } = item

      if ((itemX - x) * (itemX - x) + (itemY - y) * (itemY - y) < radius * radius) {
        s.add(item)
      }
    })

    return s
  }
}
