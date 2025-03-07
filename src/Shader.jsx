import { OrbitControls, useTexture } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useRef, useMemo, useState, useEffect } from "react"
import * as THREE from "three"

import vertexShader from "./shader/vertexShader.js"
import fragmentShader from "./shader/fragmentShader.js"
import { DoubleSide, Vector2 } from "three"

export default function Shader() {
  const brush = useTexture("/textures/brush.png")
  const meshRefs = useRef([])
  const prevMousePosRef = useRef(new Vector2(0, 0))
  const max = 50

  const meshes = useMemo(
    () =>
      Array.from({ length: max }, () => ({
        rotation: 2 * Math.PI * Math.random(),
      })),
    [max]
  )

  const { viewport } = useThree()
  const [mousePos, setMousePos] = useState(new Vector2(0, 0))

  const [currentWave, setCurrentWave] = useState(0)

  useEffect(() => {
    const prevMousePos = prevMousePosRef.current
    const deltaX = Math.abs(mousePos.x - prevMousePos.x)
    const deltaY = Math.abs(mousePos.y - prevMousePos.y)

    if (deltaX > 40 || deltaY > 40) {
      setCurrentWave((prev) => {
        meshRefs.current[prev].material.visible = true
        meshRefs.current[prev].position.set(mousePos.x, mousePos.y, 0)
        console.log("Incrementing wave from:", prev)
        return (prev + 1) % max
      })
      prevMousePosRef.current.set(mousePos.x, mousePos.y)
    }
  }, [mousePos])

  useFrame((state) => {
    const x = (state.pointer.x * viewport.width) / 2
    const y = (state.pointer.y * viewport.height) / 2

    setMousePos(new Vector2(x, y))
  })

  return (
    <>
      <OrbitControls />
      {meshes.map((mesh, index) => (
        <mesh
          key={index}
          ref={(el) => (meshRefs.current[index] = el)}
          rotation-z={mesh.rotation}
        >
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial
            map={brush}
            transparent={true}
            blending={THREE.AdditiveBlending}
            depthTest={false}
            depthWrite={false}
            visible={false}
          />
        </mesh>
      ))}
    </>
  )
}
