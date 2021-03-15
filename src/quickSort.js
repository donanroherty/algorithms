/**
 * Quick Sort
 * Recursivley splits an list at a pivot, dividing it into
 * new lists smaller than and greater than the pivot.
 * After reducing the input array to it's smallest possible
 * comparison, the results are returned and concatenated into
 * a sorted array.
 * A random pivot will be used in most cases.  This will ensure
 * that runtime averages at O(n * logn). If pivot was 0 and list
 * was already sorted, runtime with a pivot of 0 would be O(n squared).
 */

import * as qs from "./quickSort"

/**
 * Sorts an array of numbers in ascending order
 * @param {number[]} list // A list of numbers to sort
 * @param {number|undefined} constPivot Optional: A constant index to use as the pivot, primarily useful for testing recursions. If ommitted a random pivot will be chosen.
 */
function quickSort(list, constPivot) {
  if (Array.isArray(list) === false) {
    throw new TypeError()
  }

  // base case
  if (list.length < 2) {
    return [...list]
  }

  // recursive case
  const pivotIdx = constPivot ?? Math.floor(Math.random() * (list.length + 1))
  const pivot = list[pivotIdx] //mid point, floored

  let same = list.filter((val, i) => val === pivot && i !== pivotIdx)
  let smaller = list.filter((val) => val < pivot)
  let greater = list.filter((val) => val > pivot)

  const smallerSorted = qs.quickSort(smaller, constPivot)
  const greaterSorted = qs.quickSort(greater, constPivot)

  // result
  return [...smallerSorted, ...same, pivot, ...greaterSorted]
}

function getRandIdx(min, max) {
  return Math.floor(Math.random() * (max + 1))
}

export { quickSort }
