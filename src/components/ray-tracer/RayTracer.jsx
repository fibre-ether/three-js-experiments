import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useContext, useMemo, useRef } from "react";
import { ShaderMaterial, Vector2, Vector3 } from "three";
import { button, folder, useControls } from "leva";
import { DemoFoldersContext } from "../../App";

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

function RayTracer() {
  const ref = useRef();
  const demoFolders = useContext(DemoFoldersContext);
  const [, get] = useKeyboardControls();

  const glSize = new Vector2(0);
  const defaultCameraPosition = new Vector3(0);

  const material = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uRenderSize: { value: glSize },
        uCameraPosition: { value: defaultCameraPosition },
      },
      vertexShader,
      fragmentShader,
    });
  }, []);
  const [, set] = useControls(() => ({
    ...demoFolders,
    config: folder({
      cameraPosition: {
        value: { x: 0, y: 0, z: 0 },
        onChange: (e) => {
          defaultCameraPosition.set(e.x, e.y, e.z);
          material.uniforms.uCameraPosition.value = defaultCameraPosition;
        },
      },
      reset: button(() => {
        defaultCameraPosition.set(0, 0, 0);
        material.uniforms.uCameraPosition.value = defaultCameraPosition;
        set({
          cameraPosition: {
            x: defaultCameraPosition.x,
            y: defaultCameraPosition.y,
            z: defaultCameraPosition.z,
          },
        });
      }),
    }),
  }));

  useFrame(({ clock, gl }) => {
    const { forward, back, left, right, up, down } = get();

    defaultCameraPosition.setX(defaultCameraPosition.x + (left - right) * 0.01);

    defaultCameraPosition.setY(defaultCameraPosition.y + (down - up) * 0.01);

    defaultCameraPosition.setZ(
      defaultCameraPosition.z + (back - forward) * 0.01
    );

    material.uniforms.uCameraPosition.value = defaultCameraPosition;
    set({
      cameraPosition: {
        x: defaultCameraPosition.x,
        y: defaultCameraPosition.y,
        z: defaultCameraPosition.z,
      },
    });
    // console.log(forward, back);

    material.uniforms.uRenderSize.value = gl.getSize(glSize);
    material.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    /* eslint-disable-next-line */
    <mesh ref={ref} material={material}>
      <planeGeometry
        // eslint-disable-next-line
        attach={"geometry"}
        // eslint-disable-next-line
        args={[1, 1]}
      />
    </mesh>
  );
}

export default RayTracer;
