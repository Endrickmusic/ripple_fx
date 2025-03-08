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

    if (deltaX > 4 || deltaY > 4) {
      setCurrentWave((prev) => {
        meshRefs.current[prev].visible = true
        meshRefs.current[prev].material.visible = true
        meshRefs.current[prev].position.set(mousePos.x, mousePos.y, 0)
        meshRefs.current[prev].material.opacity = 1.0
        meshRefs.current[prev].scale.x = meshRefs.current[prev].scale.y = 1.0
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

    meshRefs.current.forEach((mesh) => {
      if (mesh && mesh.visible) {
        mesh.rotation.z += 0.02
        mesh.material.opacity *= 0.96
        mesh.scale.x = 0.98 * mesh.scale.x + 0.1
        mesh.scale.y = mesh.scale.x
        if (mesh.material.opacity < 0.02) {
          mesh.visible = false
        }
      }
    })
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
