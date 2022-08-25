/**
 *Returns a copy of the input array, sorted smallest to largest by id
 * @param {{id:number, name:string}[]} arr The array to copy and sort
 * @returns a copy of the input array sorted by id
 */
function selectionSort(arr) {
  let sorted = []
  let unsorted = [...arr]

  while (unsorted.length > 0) {
    let smallest = 0

    for (let i = 0; i < unsorted.length; i++) {
      const el = unsorted[i]
      if (el.id < unsorted[smallest]) {
        smallest = i
      }
    }

    sorted.push(unsorted[smallest])
    unsorted.splice(smallest)
  }

  return sorted
}

export default selectionSort
