import { Box } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import { useNavigate } from "react-router";

export default function MainApp() {
  const navigate = useNavigate();
  return (
      <>
        {/* <div id="canvas-container">
        <Canvas>
          <SunsetBackground />
          <Box position={[-1.6, 0, 0]} />
          <Box position={[1.6, 0, 0]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
        </Canvas>
        </div> */}
        <h1>Three.js Fiber</h1>
        <button onClick={() => navigate("/home")}>Navigate</button>
      </>
    );
    }
