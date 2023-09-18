import {
  Bounds,
  Environment,
  PerspectiveCamera,
  Scroll,
  ScrollControls,
  Stats,
} from "@react-three/drei";
import "./App.css";
import CustomPoints from "./components/CustomPoints";
import TextWall from "./components/TextWall";

function App() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 30]} />
      <Environment preset="apartment" />
      <Scene />
      {/* <OrbitControls /> */}
      <Stats />
    </>
  );
}

function Scene() {
  return (
    <ScrollControls pages={3} damping={-100}>
      <Scroll>
        <TextWall />
      </Scroll>
      <Bounds fit clip observe margin={1.5}>
        <CustomPoints />
      </Bounds>
    </ScrollControls>
  );
}
export default App;
