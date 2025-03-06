import { Canvas } from '@react-three/fiber'
import brush from '/textures/brush.png'

import './index.css'
import Shader from './Shader.jsx'

function App() {
  
  console.log(brush)
  return (
  <>

    <Canvas
    camera={{ 
      position: [0, 0, 2],
      fov: 40 }}  
    >
      <color attach="background" args={[0x000]} />
      <Shader />
    </Canvas>
  </>
  )
}

export default App
