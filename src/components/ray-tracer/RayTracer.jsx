import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useContext, useMemo, useRef } from "react";
import { ShaderMaterial, Vector2, Vector3, Vector4 } from "three";
import { button, folder, useControls } from "leva";
import { DemoFoldersContext } from "../../App";

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

import rayClass from "./shaders/utils/ray.glsl";
import hittableClass from "./shaders/utils/hittable.glsl";
import defines from "./shaders/utils/defines.glsl";
import utils from "./shaders/utils/utils.glsl";

import shaderConcat from "../../utils/shaderConcat";

function RayTracer() {
  const ref = useRef();
  const demoFolders = useContext(DemoFoldersContext);
  const [, get] = useKeyboardControls();

  /* shader defaults */
  const glSize = new Vector2(0);
  const defaultCameraPosition = new Vector3(0);
  const hittables = [
    new Vector4(0, 0, -1, 0.5),
    new Vector4(0, -100.5, -1, 100),
  ];

  /* Shader material */
  const material = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uRenderSize: { value: glSize },
        uCameraPosition: { value: defaultCameraPosition },
        uHittables: { value: hittables },
      },
      vertexShader,
      fragmentShader: shaderConcat(
        `#define NUM_HITTABLES ${hittables.length}`,
        defines,
        utils,
        rayClass,
        hittableClass,
        fragmentShader
      ),
    });
  }, []);

  /* Controls */
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

    defaultCameraPosition.setX(defaultCameraPosition.x + (right - left) * 0.01);

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
