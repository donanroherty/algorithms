/**
 * Creates a simple weighted union find implementation.
 * @param {number} N size to initialize the tree to
 * @returns object containing union find operators
 */
function unionFind(N) {
  let tree = Array(N)
    .fill()
    .map((v, i) => i)

  let sizes = Array(N).fill(1)

  /**
   * getPoints returns a copy of the points array
   * @returns number[]
   */
  function getPoints() {
    return tree.map(p => p)
  }

  /**
   * getRoot traverses up a tree to find the root node.
   * A root nodes parent is itself, it index and value will be identical.
   * @param {number} idx
   * @param {number[]} arr
   * @returns
   */
  function getRoot(idx, arr) {
    while (idx !== arr[idx]) {
      idx = arr[idx]
    }
    return idx
  }

  /**
   * union sets a tree at one index to be a child of another.
   * Will always set the smaller tree to be a child of the larger tree.
   * If both trees have the same size, x will be a child of y.
   * @param {number} x
   * @param {number} y
   */
  function union(x, y) {
    const xRoot = getRoot(x, tree)
    const yRoot = getRoot(y, tree)

    if (xRoot === yRoot) return

    if (sizes[x] > sizes[y]) {
      tree[y] = xRoot
      sizes[x] += sizes[y]
    } else {
      tree[x] = yRoot
      sizes[y] += sizes[x]
    }
  }

  /**
   * Returns true if x and y are connected, ie. the share the same root node.
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  function isConnected(x, y) {
    return tree[x] === tree[y]
  }

  return { getPoints, getRoot, union, isConnected }
}

export default unionFind
