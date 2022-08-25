export type GridItem = {
  x: number
  y: number
}

export type SpatialHashSystem = {
  hashtable: Map<string, { x: number; y: number }[]>
  width: number
  height: number
  cellSize: number
  insert: (item: GridItem) => void
  boxQuery: (x: number, y: number, width: number, height: number) => Set<GridItem>
  circleQuery: (x: number, y: number, radius: number) => Set<GridItem>
}

export function createSpatialHashSystem(
  width: number,
  height: number,
  cellSize: number
): SpatialHashSystem

export default {}
