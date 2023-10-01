import { PerspectiveCamera, Stats } from "@react-three/drei";
import CustomPoints from "./CustomPoints";
import { Canvas } from "@react-three/fiber";
import { loremText, scrollText } from "../../assets/text";
import "./scroll-morph.css";

function ScrollScene() {
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
        <CustomPoints />
        <Stats />
      </Canvas>
    </>
  );
}

export default ScrollScene;
