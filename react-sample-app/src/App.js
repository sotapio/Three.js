import './App.css';
import { Canvas,useFrame } from "@react-three/fiber"
import { useRef, useState } from "react"
import { config , useSpring , animated } from "@react-spring/three"

function Box(props) {
  const ref = useRef();
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  // 回転させる
  useFrame(() => (ref.current.rotation.x += 0.01));

  const { scale } = useSpring({
    scale: clicked ? 2 : 1,
    config: config.wobbly,
  });
  
  return (
    // クリックしたら大きさが変わる
    <animated.mesh
      {...props}
      ref={ref}
      onClick={() => setClicked(!clicked)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={ scale }> 

      {/* ボックスの大きさを指定している */}
      <boxGeometry args={[1, 1, 1]} />
      {/* ボックスの色を指定している */}
      <meshStandardMaterial 
        color={hovered ? "yellow" : "pink"} 
        emissive={hovered ? "yellow" : "pink"} 
        emissiveIntensity={0.5} 
      />
    </animated.mesh>
  )
}

function App() {
  return (
    <>
      <div id='canvas-container'>
        <Canvas>
            {/* ２つのボックスの位置をずらす */}
            <Box position={[-1.6,0,0]} />
            <Box position={[1.6, 0, 0]} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
        </Canvas>
      </div>
      <h1>Three.js Fiber</h1>
      <a href="">もっとみる</a>
    </>
  );
}

export default App;
