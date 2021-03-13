import selectionSort from "../selectionSort"

const mockData = [
  { id: 2, name: "Contact" },
  { id: 4, name: "Terminator 2" },
  { id: 0, name: "Aliens" },
  { id: 1, name: "Victoria" },
  { id: 3, name: "Lord of the Rings" },
]

describe("selectionSort()", () => {
  test("it is defined", () => {
    expect(selectionSort).toBeDefined()
    expect(typeof selectionSort).toBe("function")
  })

  test("It returns a copy of the input array", () => {
    const result = selectionSort(mockData)
    expect(Array.isArray(result)).toBe(true)
    expect(result).not.toBe(mockData)
  })

  test("The returned array contains all items from the input array", () => {
    const result = selectionSort(mockData)

    result.forEach((item) => {
      const search = mockData.find(
        (mock) => mock.id === item.id && mock.name === item.name
      )

      expect(search).toBeDefined()
    })
  })

  test("The returned items are sorted by id", () => {
    const result = selectionSort(mockData)
    let prevID = result[0].id
    result.forEach((item, i) => {
      if (i !== 0) {
        expect(item.id).toBeGreaterThan(prevID)
        prevID = item.id
      }
    })
  })
})
