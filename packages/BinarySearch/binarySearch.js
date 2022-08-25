/**
 *
 * @param {number} target The number to search for
 * @param {number[]} arr The array to search
 * @returns object containing the result and the number of tries to find it
 */
function binarySearch(target, arr) {
  let low = 0
  let high = arr.length - 1
  let tries = 1

  while (low <= high) {
    const mid = parseInt((low + high) * 0.5)
    const guess = arr[mid]

    if (guess === target) {
      return { id: mid, tries }
    }

    if (guess > target) high = mid - 1
    if (guess < target) low = mid + 1
    tries++
  }

  return undefined
}

export default binarySearch
