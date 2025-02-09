import "./App.css";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRef, useState } from "react";
import { config, useSpring, animated } from "@react-spring/three";
import { TextureLoader } from "three";

function Box(props) {
  const ref = useRef();
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  // useLoader を使用してテクスチャをロード
  const texture = useLoader(TextureLoader, "https://threejsfundamentals.org/threejs/resources/images/wall.jpg");

  // 回転させる
  useFrame(() => {
    if (ref.current) ref.current.rotation.x += 0.01;
  });

  const { scale } = useSpring({
    scale: clicked ? 2 : 1,
    config: config.wobbly,
  });

  return (
    <animated.mesh
      {...props}
      ref={ref}
      onClick={() => setClicked(!clicked)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={scale.to((s) => [s, s, s])}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        map={texture} 
      />
    </animated.mesh>
  );
}

function App() {
  return (
    <>
      <div id="canvas-container">
        <Canvas>
          {/* ２つのボックスの位置をずらす */}
          <Box position={[-1.6, 0, 0]} />
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
