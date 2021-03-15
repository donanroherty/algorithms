import * as bsr from "../binarySearchRecursive"
const { binarySearchRecursive } = bsr

const mockData = [
  { id: 0, name: "Aliens" },
  { id: 12, name: "Victoria" },
  { id: 24, name: "Contact" },
  { id: 31, name: "Lord of the Rings" },
  { id: 49, name: "Ratatouille" },
  { id: 53, name: "Her" },
  { id: 60, name: "The Life of Brian" },
]

afterEach(function () {
  jest.clearAllMocks()
})

test("it throws params are missing or incorrect", function () {
  expect(function sansParams() {
    binarySearchRecursive()
  }).toThrow(TypeError)

  expect(function invalidDataType() {
    binarySearchRecursive(false, 3)
  }).toThrow(TypeError)

  expect(function invalidSearchType() {
    binarySearchRecursive([], "")
  }).toThrow(TypeError)
})

test("it returns successfully if the center-most array element (rounded down) matches search term", function () {
  const spy = jest.spyOn(bsr, "binarySearchRecursive")
  expect(bsr.binarySearchRecursive(mockData, 24)).toBe(mockData[2])
  expect(spy).toBeCalledTimes(1)
})

test("it returns the correct index for a given search term", function () {
  expect(binarySearchRecursive(mockData, 53)).toBe(mockData[5])
  expect(binarySearchRecursive(mockData, 24)).toBe(mockData[2])
  expect(binarySearchRecursive(mockData, 60)).toBe(mockData[6])
  expect(binarySearchRecursive(mockData, 0)).toBe(mockData[0])
})

test("it returns undefined if it can't find the search term", function () {
  expect(binarySearchRecursive(mockData, 11)).toBe(undefined)
})

test("it recurses the correct number of times for binary search", function () {
  const spy = jest.spyOn(bsr, "binarySearchRecursive")

  bsr.binarySearchRecursive(mockData, 31)
  expect(spy).toBeCalledTimes(3)

  spy.mockClear()

  bsr.binarySearchRecursive(mockData, 24)
  expect(spy).toBeCalledTimes(1)

  spy.mockClear()

  bsr.binarySearchRecursive(mockData, 0)
  expect(spy).toBeCalledTimes(2)
})
