import unionFind from "../unionFind"

describe("root()", () => {
  const { getRoot } = unionFind(10)

  test("root(x) returns the root element for a given node in the tree", () => {
    const nodeTree = [0, 7, 7, 2, 7, 2, 8, 7, 8, 8]
    expect(getRoot(7, nodeTree)).toBe(7) // tree root is its own parent
    expect(getRoot(5, nodeTree)).toBe(7)
    expect(getRoot(0, nodeTree)).toBe(0)
  })
})

describe("union(child, par)", () => {
  test("union() appends a smaller tree to a larger tree", () => {
    const {
      union,
      getPoints, //[0, 1, 2, 3, 4, 5]
    } = unionFind(6)

    union(2, 3) // [0, 1, 3, 3, 4, 5]
    union(3, 4) // [0, 1, 3, 3, 3, 5] should append tree 4 to tree 3
    expect(getPoints()[4]).toBe(3)

    union(5, 1) // [0, 1, 3, 3, 3, 1]
    union(5, 2) // [0, 1, 3, 3, 3, 3]
    expect(getPoints()[5]).toBe(3)
  })

  test("union() does nothing if inputs share the same root", () => {
    const { union, getPoints } = unionFind(6)
    union(2, 3)
    union(4, 3)
    const pts = getPoints()
    union(4, 2)
    const newPts = getPoints()
    expect(newPts).toEqual(pts)
  })
})

describe("connected(x,y)", () => {
  const { isConnected, union } = unionFind(10)

  test("It exports isConnected(x,y)", () => {
    expect(isConnected).toBeDefined()
    expect(typeof isConnected).toBe("function")
  })

  test("connected(x,y) returns true if points[x] and points[y] are connected, else false", () => {
    expect(isConnected(9, 3)).toBe(false)
    expect(isConnected(9, 9)).toBe(true)
    union(9, 3)
    expect(isConnected(3, 9)).toBe(true)
  })
})
