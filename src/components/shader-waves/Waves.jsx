import { Bounds } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useContext, useMemo, useRef } from "react";
import { ShaderMaterial } from "three";
import { button, folder, useControls } from "leva";
import { DemoFoldersContext } from "../../App";

import vertexShader from "./shaders/waves/vertex.glsl";
import fragmentShader from "./shaders/waves/fragment.glsl";

function Waves() {
  const ref = useRef();
  const demoFolders = useContext(DemoFoldersContext);

  const [{ waveSpeed, randomness, waveDensity, sphereResolution }, set] =
    useControls(() => ({
      ...demoFolders,
      config: folder({
        waveSpeed: {
          value: 0.5,
          min: 0,
          max: 5.0,
          step: 0.1,
        },
        randomness: {
          value: 2.75,
          min: 0.0,
          max: 5.0,
          step: 0.1,
        },
        waveDensity: {
          value: 2.0,
          min: 0.0,
          max: 5.0,
          step: 0.1,
        },
        sphereResolution: {
          value: 64,
          min: 8,
          max: 128,
          step: 10,
        },
        reset: button(() =>
          set({
            waveSpeed: 0.5,
            randomness: 2.75,
            waveDensity: 2.0,
            sphereResolution: 64,
          })
        ),
      }),
    }));

  const material = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uWaveSpeed: { value: waveSpeed },
        uRandomness: { value: randomness },
        uWaveDensity: { value: waveDensity },
      },
      vertexShader,
      fragmentShader,
    });
  }, [waveSpeed, randomness, waveDensity]);

  useFrame(({ clock }) => {
    ref.current.rotation.z = clock.elapsedTime * 0.75;
    ref.current.rotation.x = clock.elapsedTime * 0.5;
    material.uniforms.uTime.value = clock.elapsedTime;
  });
  return (
    <Bounds fit clip observe margin={2.0}>
      {/* eslint-disable-next-line */}
      <mesh ref={ref} material={material}>
        <icosahedronGeometry
          // eslint-disable-next-line
          attach={"geometry"}
          // eslint-disable-next-line
          args={[1, sphereResolution, sphereResolution]}
        />
      </mesh>
      {/* <Sphere ref={ref} material={material} args={[1, 128, 128]} /> */}
    </Bounds>
  );
}

export default Waves;
