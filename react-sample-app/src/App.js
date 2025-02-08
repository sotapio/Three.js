import './App.css';
import { Canvas } from "@react-three/fiber"
import { useRef } from "react"

function Box({ props }) {
  return (
    <mesh ref={ref}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color='hotpink' />
    </mesh>
  )
}

function App() {
  return (
    <div id='canvas-container'>
      <Canvas>
        <mesh>
          <Box />
          <boxGeometry args={[2, 2, 2]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
        </mesh>
      </Canvas>
    </div>
  );
}

export default App;
