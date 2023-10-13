import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import AudioViz from "./AudioViz";

function AudioVizScene() {
  return (
    <Canvas
      style={{
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 10,
      }}>
      <AudioViz />
      <Stats />
      <OrbitControls />
    </Canvas>
  );
}

export default AudioVizScene;
