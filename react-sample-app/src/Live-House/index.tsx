import React, { useRef, useEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  KeyboardControls,
  useKeyboardControls,
  PointerLockControls,
  Environment,
  Box,
  Plane,
  SpotLight,
  Cylinder,
} from "@react-three/drei"
import * as THREE from "three"

export default function ConcertVenue() {
  
  return (
    <div className="w-full h-screen">
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
        ]}
      >
        <Canvas shadows camera={{ fov: 75, near: 0.1, far: 1000 }}>
          <Environment preset="night" />
          <Scene />
          <PointerLockControls />
        </Canvas>
      </KeyboardControls>
      <div className="absolute top-0 left-0 text-white p-4 pointer-events-none">移動: WASD キー / 視点操作: マウス</div>
    </div>
  )
}

function Scene() {
  const audioRef = useRef<THREE.PositionalAudio>()
  const { camera } = useThree()
  
    // シーンを作成
  const scene = new THREE.Scene();
  // 背景色を設定（例: 黒）
  scene.background = new THREE.Color(0x000000);

  useEffect(() => {
    // オーディオリスナーの作成
    const listener = new THREE.AudioListener()
    camera.add(listener)

    // ポジショナルオーディオの作成
    const sound = new THREE.PositionalAudio(listener)
    audioRef.current = sound

    // オーディオの読み込みと設定
    const audioLoader = new THREE.AudioLoader()
    audioLoader.load("/music.mp3", (buffer) => {
      sound.setBuffer(buffer)
      sound.setRefDistance(20)
      sound.setLoop(true)
      sound.play()

    })
    

    return () => {
      sound.stop()
      camera.remove(listener)
    }
  }, [camera])

  return (
    <>
      <Player />
      <Venue />
      {/* ステージ上の音源 */}
      <mesh position={[0, 2, -15]}>
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial color="red" />
        {audioRef.current && <primitive object={audioRef.current} />}
      </mesh>
    </>
  )
}

function Player() {
  const [, getKeys] = useKeyboardControls()
  const { camera } = useThree()
  const [position, setPosition] = useState(new THREE.Vector3(0, 2, 5))

  useFrame((state, delta) => {
    const { forward, backward, left, right } = getKeys()
    const speed = 5

    const direction = new THREE.Vector3()
    const frontVector = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
    const sideVector = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)

    if (forward) direction.add(frontVector)
    if (backward) direction.sub(frontVector)
    if (left) direction.sub(sideVector)
    if (right) direction.add(sideVector)

    direction.y = 0
    direction.normalize().multiplyScalar(speed * delta)

    const newPosition = position.clone().add(direction)

    // プレイヤーの半径（衝突判定用）
    const playerRadius = 0.5

    // ステージとの衝突判定
    const stageCollision = checkStageCollision(newPosition, playerRadius)
    // 柵との衝突判定
    const barrierCollision = checkBarrierCollision(newPosition, playerRadius)

    // 側壁との衝突判定も含めた移動制限
    if (
      !stageCollision &&
      !barrierCollision &&
      newPosition.x > -14.5 + playerRadius &&
      newPosition.x < 14.5 - playerRadius &&
      newPosition.z > -20 + playerRadius &&
      newPosition.z < 20 - playerRadius
    ) {
      setPosition(newPosition)
      camera.position.copy(newPosition)
    }
  })

  // ステージとの衝突判定関数
  const checkStageCollision = (pos: THREE.Vector3, radius: number) => {
    const stageMinX = -15
    const stageMaxX = 15
    const stageMinZ = -20
    const stageMaxZ = -9
    const stageHeight = 1.5

    // ステージ内の衝突判定
    if (
      pos.x + radius > stageMinX &&
      pos.x - radius < stageMaxX &&
      pos.z + radius > stageMinZ &&
      pos.z - radius < stageMaxZ
    ) {
      if (pos.y - radius < stageHeight) {
        return true
      }
    }
    return false
  }

  // 柵との衝突判定関数
  const checkBarrierCollision = (pos: THREE.Vector3, radius: number) => {
    const barrierMinX = -15
    const barrierMaxX = 15
    const barrierZ = -9
    const barrierThickness = 0.3
    const barrierHeight = 1.2

    // 柵の近くにいる場合の衝突判定
    if (
      pos.x + radius > barrierMinX &&
      pos.x - radius < barrierMaxX &&
      pos.z + radius > barrierZ - barrierThickness &&
      pos.z - radius < barrierZ + barrierThickness
    ) {
      if (pos.y - radius < barrierHeight) {
        return true
      }
    }
    return false
  }

  return null
}

function Venue() {
  return (
    <>
      {/* フロア */}
      <Plane rotation-x={-Math.PI / 2} position={[0, 0, 0]} args={[40, 40]} receiveShadow>
        <meshStandardMaterial color="#111" roughness={0.8} />
      </Plane>

      {/* ステージ（横幅を側壁まで拡張） */}
      <group position={[0, 0, -15]}>
        <Box args={[30, 1.5, 10]} position={[0, 0.75, 0]}>
          <meshStandardMaterial color="#222" />
        </Box>
        {/* ステージ背景 */}
        <Box args={[30, 10, 0.5]} position={[0, 5, -5]}>
          <meshStandardMaterial color="#111" />
        </Box>

        {/* バンドメンバーと機材 */}
        {/* ドラム（後方中央） */}
        <group position={[0, 1.5, -3]}>
          {/* ドラムセット */}
          <Cylinder args={[0.3, 0.3, 0.5]} position={[0, 0.25, 0]}>
            <meshStandardMaterial color="#444" />
          </Cylinder>
          <Cylinder args={[0.2, 0.2, 0.8]} position={[-0.5, 0.4, 0]}>
            <meshStandardMaterial color="#444" />
          </Cylinder>
          <Cylinder args={[0.2, 0.2, 0.6]} position={[0.5, 0.3, 0]}>
            <meshStandardMaterial color="#444" />
          </Cylinder>
          {/* ドラマー */}
          <Box args={[0.3, 0.8, 0.3]} position={[0, 0.8, 0.5]}>
            <meshStandardMaterial color="#000" />
          </Box>
        </group>

        {/* ベース（左） */}
        <group position={[-4, 1.5, -2]}>
          {/* アンプ */}
          <Box args={[1, 1.2, 0.6]} position={[0, 0.6, 0]}>
            <meshStandardMaterial color="#111" />
          </Box>
          {/* ベーシスト */}
          <Box args={[0.3, 1, 0.3]} position={[0.5, 1, 0.5]}>
            <meshStandardMaterial color="#000" />
          </Box>
        </group>

        {/* ギター（右） */}
        <group position={[4, 1.5, -2]}>
          {/* アンプ */}
          <Box args={[1, 1.2, 0.6]} position={[0, 0.6, 0]}>
            <meshStandardMaterial color="#111" />
          </Box>
          {/* ギタリスト */}
          <Box args={[0.3, 1, 0.3]} position={[-0.5, 1, 0.5]}>
            <meshStandardMaterial color="#000" />
          </Box>
        </group>

        {/* ボーカル（前方中央） */}
        <group position={[0, 1.5, 0]}>
          {/* マイクスタンド */}
          <Cylinder args={[0.05, 0.05, 1.5]} position={[0, 0.75, 0]}>
            <meshStandardMaterial color="#333" />
          </Cylinder>
          {/* ボーカリスト */}
          <Box args={[0.3, 1, 0.3]} position={[0, 1, 0.3]}>
            <meshStandardMaterial color="#000" />
          </Box>
        </group>
      </group>

      {/* ステージ前の柵（横幅を側壁まで拡張） */}
      <group position={[0, 0, -9]}>
        {/* 横バー */}
        <Box args={[30, 0.1, 0.1]} position={[0, 1.2, 0]}>
          <meshStandardMaterial color="#444" metalness={0.8} />
        </Box>
        {/* 縦バー（数を増やして隙間をなくす） */}
        {Array.from({ length: 16 }, (_, i) => (
          <Box key={`barrier-${i}`} args={[0.1, 1.2, 0.1]} position={[(i - 7.5) * 2, 0.6, 0]}>
            <meshStandardMaterial color="#444" metalness={0.8} />
          </Box>
        ))}
        {/* 柵の衝突判定用の見えない壁 */}
        <Box args={[30, 1.2, 0.1]} position={[0, 0.6, 0]} visible={false}>
          <meshStandardMaterial transparent opacity={0} />
        </Box>
      </group>

      {/* 客席エリア */}
      {Array.from({ length: 10 }, (_, row) =>
        Array.from({ length: 15 }, (_, col) => (
          <Box key={`seat-${row}-${col}`} args={[0.8, 0.8, 0.8]} position={[(col - 7) * 1.2, 0.4, row * 1.5]}>
            <meshStandardMaterial color="#333" />
          </Box>
        )),
      )}

      {/* 側壁 */}
      <Box args={[0.5, 10, 40]} position={[-15, 5, 0]}>
        <meshStandardMaterial color="#222" />
      </Box>
      <Box args={[0.5, 10, 40]} position={[15, 5, 0]}>
        <meshStandardMaterial color="#222" />
      </Box>

      {/* 照明（紫とピンクを基調とした色に変更） */}
      <SpotLight position={[0, 10, -10]} angle={0.5} penumbra={0.5} intensity={2} color="#ff00ff" castShadow />
      <SpotLight position={[-5, 10, -10]} angle={0.5} penumbra={0.5} intensity={2} color="#ff1493" castShadow />
      <SpotLight position={[5, 10, -10]} angle={0.5} penumbra={0.5} intensity={2} color="#9400d3" castShadow />

      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 10]} intensity={1.5} color="#fff" castShadow />
    </>
  )
}