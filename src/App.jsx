import { Canvas } from "@react-three/fiber"
import { OrthographicCamera } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import './index.css'
import Shader from './Shader.jsx'

const Scene = () => {
    const viewport = useThree((state) => state.viewport)
    const frustumSize = viewport.height
    const aspect = viewport.width / viewport.height

    return (
        <>
            <OrthographicCamera 
                makeDefault
                position={[0, 0, 2]}
                left={frustumSize * aspect / -2}
                right={frustumSize * aspect / 2}
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
        <Canvas
            gl={{ alpha: false }}
        >
            <color attach="background" args={['#000000']} />
            <Scene />
        </Canvas>
    )
}
