import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Waves from "./Waves";

function ShaderScene() {
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
      <Waves />
      <Stats />
      <OrbitControls />
    </Canvas>
  );
}

export default ShaderScene;
