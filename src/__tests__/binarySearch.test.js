import binarySearch from "../binarySearch"

const n = 100
const arr = makeMock(n)

test("binarySearch() finds the correct array element", () => {
  expect(binarySearch(79, arr).id).toBe(79)
})

test("expect tries to be <= log N", () => {
  const target = Math.round(Math.log2(n))

  expect(binarySearch(33, arr).tries).toBeLessThanOrEqual(target)
  expect(binarySearch(99, arr).tries).toBeLessThanOrEqual(target)
  expect(binarySearch(22, arr).tries).toBeLessThanOrEqual(target)
  expect(binarySearch(5, arr).tries).toBeLessThanOrEqual(target)
  expect(binarySearch(51, arr).tries).toBeLessThanOrEqual(target)
})

test("it fails returns undefined if target is not found", () => {
  expect(binarySearch(n - (n + 5), arr)).toBeUndefined()
  expect(binarySearch(n + 3, arr)).toBeUndefined()
})

function makeMock(n) {
  return Array(100)
    .fill()
    .map((v, i) => i)
}
