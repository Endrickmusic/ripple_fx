import { useTexture } from "@react-three/drei"
import { useFrame, useThree, createPortal } from "@react-three/fiber"
import { useRef, useMemo, useState, useEffect, useLayoutEffect } from "react"
import * as THREE from "three"

import vertexShader from "./shader/vertexShader.js"
import fragmentShader from "./shader/fragmentShader.js"

export default function Shader() {
  const brush = useTexture("/textures/brush.png")
  const cloudTexture = useTexture("/image/cloud.jpg")
  const meshRefs = useRef([])
  const prevMousePosRef = useRef(new THREE.Vector2(0, 0))
  const max = 50

  // Create render target
  const { viewport, size, gl } = useThree()
  const renderTargetRef = useRef()
  const sceneRef = useRef(new THREE.Scene())
  const cameraRef = useRef()

  // Initialize render target
  useEffect(() => {
    // Create orthographic camera with proper aspect ratio
    const aspect = size.width / size.height
    const frustumSize = size.height

    cameraRef.current = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2, // left
      (frustumSize * aspect) / 2, // right
      frustumSize / 2, // top
      frustumSize / -2, // bottom
      -1000, // near
      1000 // far
    )
    // cameraRef.current.position.z = 1

    renderTargetRef.current = new THREE.WebGLRenderTarget(
      size.width,
      size.height,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        stencilBuffer: false,
      }
    )

    // Position camera
    cameraRef.current.position.z = 1

    return () => renderTargetRef.current.dispose()
  }, [size])

  const meshes = useMemo(
    () =>
      Array.from({ length: max }, () => ({
        rotation: 2 * Math.PI * Math.random(),
      })),
    [max]
  )

  const [mousePos, setMousePos] = useState(new THREE.Vector2(0, 0))
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
        meshRefs.current[prev].material.opacity = 0.5
        meshRefs.current[prev].scale.x = meshRefs.current[prev].scale.y = 0.2 // Smaller scale for the portal scene
        return (prev + 1) % max
      })
      prevMousePosRef.current.set(mousePos.x, mousePos.y)
    }
  }, [mousePos, viewport])

  useFrame((state) => {
    const x = (state.pointer.x * viewport.width) / 2
    const y = (state.pointer.y * viewport.height) / 2

    setMousePos(new THREE.Vector2(x, y))

    meshRefs.current.forEach((mesh) => {
      if (mesh && mesh.visible) {
        mesh.rotation.z += 0.02
        mesh.material.opacity *= 0.96
        mesh.scale.x = 0.982 * mesh.scale.x + 0.03
        mesh.scale.y = mesh.scale.x
        if (mesh.material.opacity < 0.00001) {
          mesh.visible = false
        }
      }
    })

    // Render the portal scene to the render target
    if (renderTargetRef.current) {
      gl.setRenderTarget(renderTargetRef.current)
      gl.render(sceneRef.current, cameraRef.current)
      gl.setRenderTarget(null)
    }
  })

  // Shader material that displays the render target with cloud texture
  const displayMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTexture: { value: cloudTexture },
        uDisplacement: { value: null },
      },
    })
  }, [cloudTexture])

  // Update the texture uniform when render target is created
  useEffect(() => {
    if (renderTargetRef.current && displayMaterial) {
      displayMaterial.uniforms.uDisplacement.value =
        renderTargetRef.current.texture
    }
  }, [displayMaterial])

  return (
    <>
      {/* Portal for brush meshes - these will only render to the render target */}
      {createPortal(
        <>
          {/* Brush meshes */}
          {meshes.map((mesh, index) => (
            <mesh
              key={index}
              ref={(el) => (meshRefs.current[index] = el)}
              rotation-z={mesh.rotation}
            >
              <planeGeometry args={[100, 100, 1, 1]} />
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
        </>,
        sceneRef.current
      )}

      {/* Shader plane that displays the render target with cloud texture */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <primitive object={displayMaterial} />
      </mesh>
    </>
  )
}
