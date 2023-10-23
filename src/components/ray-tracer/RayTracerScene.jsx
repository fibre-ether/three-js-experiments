import { KeyboardControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import RayTracer from "./RayTracer";

function RayTracerScene() {
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
      <KeyboardControls
        map={[
          { name: "forward", keys: ["w", "W"] },
          { name: "back", keys: ["s", "S"] },
          { name: "left", keys: ["a", "A"] },
          { name: "right", keys: ["d", "D"] },
          { name: "up", keys: ["q", "Q"] },
          { name: "down", keys: ["e", "E"] },
        ]}>
        <RayTracer />
      </KeyboardControls>
      <Stats />
    </Canvas>
  );
}

export default RayTracerScene;
