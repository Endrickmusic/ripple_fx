import { useLayoutEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrthographicCamera } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import "./index.css"
import Shader from "./Shader.jsx"

function ResizeHandler() {
  const { gl, camera } = useThree()

  const handleResize = useCallback(() => {
    const { innerWidth, innerHeight } = window
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    gl.setSize(innerWidth, innerHeight)
  }, [gl, camera])

  useEffect(() => {
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [handleResize])

  return null
}

const Scene = () => {
  const { viewport, size } = useThree()
  let frustumSize = viewport.height
  let aspect = viewport.width / viewport.height

  useLayoutEffect(() => {
    console.log(
      `Viewport updated: ${viewport.width.toFixed(2)}x${viewport.height.toFixed(
        2
      )}`
    )
    console.log(`Canvas size: ${size.width}x${size.height}`)
    frustumSize = viewport.height
    aspect = viewport.width / viewport.height
  }, [viewport, size])

  return (
    <>
      <OrthographicCamera
        makeDefault
        position={[0, 0, 2]}
        left={(frustumSize * aspect) / -2}
        right={(frustumSize * aspect) / 2}
        top={frustumSize / 2}
        bottom={frustumSize / -2}
        near={-1000}
        far={1000}
      />
      <Shader />
    </>
  )
}

export default function App() {
  return (
    <Canvas gl={{ alpha: false }}>
      <Scene />
    </Canvas>
  )
}
