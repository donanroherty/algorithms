import * as bs from "./binarySearchRecursive"

/**
 * Performs a binary search for the given search criteria on the input array
 * @param {{id:number, name:string}} arr input array
 * @param {number} search searchTerm
 * @returns found item in array or undefined if nothing is found for search term
 */
function binarySearchRecursive(arr, search) {
  if (arr === undefined || Array.isArray(arr) === false) {
    throw new TypeError()
  }
  if (search === undefined || typeof search !== "number") {
    throw new TypeError()
  }

  if (arr.length === 0) {
    return undefined // provided empty array or search not found
  }

  if (arr.length === 1) {
    if (arr[0].id === search) return arr[0]
    else return undefined
  }

  const mid = Math.floor(arr.length / 2) - 1

  if (arr[mid].id === search) {
    return arr[mid]
  }

  if (search < arr[mid].id) {
    arr = arr.slice(0, mid)
  } else if (search > arr[mid].id) {
    arr = arr.slice(mid + 1)
  }

  return bs.binarySearchRecursive(arr, search)
}

export { binarySearchRecursive }
