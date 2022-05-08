import * as qs from "./quickSort"
const { quickSort } = qs

test("it throws for invalid params", function () {
  expect(function () {
    quickSort()
  }).toThrowError()

  expect(function () {
    quickSort(5)
  }).toThrowError()

  expect(function () {
    quickSort("abc")
  }).toThrowError()

  expect(function () {
    quickSort([])
  }).not.toThrowError()
})

test("empty or single element arrays return immediately", function () {
  expect(quickSort([])).toEqual([])
  expect(quickSort([3])).toEqual([3])
})

test("it returns a copy, not a reference of the input", function () {
  const input = [4]
  expect(quickSort(input)).not.toBe(input)
})

test("it sorts simple list of 2 elements", function () {
  expect(quickSort([5, 3], 0)).toEqual([3, 5])
})

test("it returns the list items sorted in ascending order", function () {
  expect(quickSort([2, 3, 0, 1], 0)).toEqual([0, 1, 2, 3])
  expect(quickSort([13, 5, 62, -33], 0)).toEqual([-33, 5, 13, 62])
})

test("it is called recursivley a correct number of times", function () {
  const spy = jest.spyOn(qs, "quickSort")

  qs.quickSort([3, 2, 5, 1, 4], 0)
  expect(spy).toHaveBeenCalledTimes(7)

  spy.mockClear()

  qs.quickSort([1, 0, 3, 8, 12, 5, 19, -2], 0)
  expect(spy).toHaveBeenCalledTimes(11)
})

test("it handles duplicates", function () {
  expect(quickSort([3, 19, 3, 7, 7, 8], 0)).toEqual([3, 3, 7, 7, 8, 19])
})
