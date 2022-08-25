import { useCallback } from "react"
import buildSpatialHashExampleScene from "./lib/example.js"

function App() {
  const cbRef = useCallback((canvas: HTMLCanvasElement) => {
    buildSpatialHashExampleScene(canvas)
  }, [])

  return (
    <div>
      <canvas ref={cbRef}></canvas>
    </div>
  )
}

export default App
