import {
  Bounds,
  Environment,
  PerspectiveCamera,
  Stats,
} from "@react-three/drei";
import "./App.css";
import CustomPoints from "./components/CustomPoints";
import { Canvas } from "@react-three/fiber";
import { loremText, scrollText } from "./assets/text";

function App() {
  return (
    <>
      <div className="cover-text">
        <div className="lorem-text">{loremText}</div>
        <div className="scroll-text">
          {scrollText} {scrollText}
        </div>
        <div className="lorem-text">{loremText}</div>
      </div>

      <Canvas
        style={{
          height: "100vh",
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 10,
        }}>
        <PerspectiveCamera makeDefault position={[0, 0, 30]} />
        <Environment preset="apartment" />
        <Scene />
        {/* <OrbitControls /> */}
        <Stats />
      </Canvas>
    </>
  );
}

function Scene() {
  return (
    <Bounds fit clip observe margin={1.5}>
      <CustomPoints />
    </Bounds>
  );
}
export default App;
