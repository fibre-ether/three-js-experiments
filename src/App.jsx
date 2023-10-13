import "./App.css";
import ShaderScene from "./components/shader-waves/WavesScene";
import ScrollScene from "./components/scroll-morph/ScrollScene";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { folder } from "leva";
import { createContext } from "react";
import AudioVizScene from "./components/audio-viz/AudioVizScene";

const routes = [
  {
    name: "Select ↓",
    path: "/",
    element: <Navigate to={"/scroll-morph"} />,
  },

  {
    name: "Scoll Morph",
    path: "/scroll-morph",
    element: <ScrollScene />,
  },

  {
    name: "Shader Waves",
    path: "/shader-waves",
    element: <ShaderScene />,
  },

  {
    name: "Audio Visualizer",
    path: "/audio-viz",
    element: <AudioVizScene />,
  },
];

export const DemoFoldersContext = createContext(null);

function App() {
  const navigate = useNavigate();

  const demoFolders = {
    "All Demos": folder({
      selectDemo: {
        options: Object.fromEntries(
          routes.map((item) => [item.name, item.path])
        ),
        onChange: (path, _, options) =>
          !options.initial &&
          path !== "/" &&
          path !== window.location.pathname &&
          navigate(path),
        onEditEnd: (e) => console.log(e),
        order: 1,
      },
    }),
  };

  return (
    <>
      <div className="attributions">
        <a
          href="https://github.com/fibre-ether"
          target="_blank"
          rel={"noreferrer noopener"}>
          @fibre-ether
        </a>
        <a
          href="https://github.com/fibre-ether/three-js-experiments"
          target="_blank"
          rel={"noreferrer noopener"}>
          Code
        </a>
      </div>

      <DemoFoldersContext.Provider value={demoFolders}>
        <Routes>
          <Route path="*" element={<Navigate to={routes[0].path} />} />
          {routes.map((item, index) => {
            return <Route {...item} key={index} />;
          })}
        </Routes>
      </DemoFoldersContext.Provider>
    </>
  );
}

export default App;
