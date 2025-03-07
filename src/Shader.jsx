import { OrbitControls, useTexture } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useRef, useMemo } from "react"
import * as THREE from 'three'

import vertexShader from "./shader/vertexShader.js"
import fragmentShader from "./shader/fragmentShader.js"
import { DoubleSide, Vector2 } from "three"

export default function Shader() {
    const brush = useTexture('/textures/brush.png')
    const meshRef = useRef()
    const max = 5

    const meshes = useMemo(() => 
        Array.from({ length: max }, () => ({
            rotation: 2 * Math.PI * Math.random()
        }))
    , [max])

    return (
        <>
            <OrbitControls />
            {meshes.map((mesh, index) => (
                <mesh 
                    key={index}
                    rotation-z={mesh.rotation}
                >
                    <planeGeometry args={[1, 1]} />
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
