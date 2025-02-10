import "./App.css";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRef, useState } from "react";
import { config, useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import { TextureLoader, RepeatWrapping } from "three";
import React from "react";
import { useNavigate } from "react-router";


import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
// import MainAppComponent from "./MainApp";
import Home from "./Live-House/index";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // MUI のデフォルトの青色
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};


function Box(props) {
  const ref = useRef<THREE.Mesh>(null);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  // ボックスのテクスチャ
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
      <meshStandardMaterial map={texture} />
    </animated.mesh>
  );
}

// 夕焼けのスカイボックスを設定するコンポーネント
function SunsetBackground() {
  const sunsetTexture = useLoader(TextureLoader, "/sunset.jpg");

  // object-fit: cover を実現する設定
  sunsetTexture.wrapS = RepeatWrapping;
  sunsetTexture.wrapT = RepeatWrapping;
  sunsetTexture.repeat.set(1, 1); // 必要に応じて値を調整

  return (
    <mesh scale={[100, 100, 100]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial map={sunsetTexture} side={2} />
    </mesh>
  );
}

function MainApp() {
  const navigate = useNavigate();
  return (
    <>
      <div id="canvas-container">
        <Canvas>
          <SunsetBackground />
          <Box position={[-1.6, 0, 0]} />
          <Box position={[1.6, 0, 0]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
        </Canvas>
      </div>
      <h1>Three.js Fiber</h1>
      <a href="">もっとみる</a>
      <button onClick={() => navigate("/some-path")}>Navigate</button>
    </>
  );
}

export default App;
