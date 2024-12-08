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
  const defaultCameraPosition = new Vector3(0, 0.5, 1);
  const newCameraPosition = new Vector3(0, 0.5, 1);
  const hittables = [
    {center: new Vector3(-1, 0, -0.5), radius: 0.5, material: 1, color: new Vector3(1, 1, 0)},
    {center: new Vector3(0, 0, -1), radius: 0.5, material: 0, color: new Vector3(0, 1, 0)},
    {center: new Vector3(1, 0, -0.5), radius: 0.5, material: 1, color: new Vector3(0, 0, 1)},
    {center: new Vector3(0, -0.5, -0.5), radius: 0.1, material: 2, color: new Vector3(1, 1, 1)},
    {center: new Vector3(0, 0, -7), radius: 5, material: 2, color: new Vector3(0.25, 1, 0.5)},
    {center: new Vector4(0, -100.5, -1), radius: 100, material: 0, color: new Vector3(1, 1, 1)}
  ]

  /* Shader material */
  const material = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uRenderSize: { value: glSize },
        uCameraPosition: { value: defaultCameraPosition },
        uHittables: { value: hittables },
        uSkyBrightness: {value: 1.0}
      },
      vertexShader,
      fragmentShader: shaderConcat(
        `#define NUM_HITTABLES ${hittables.length}`,
        defines,
        rayClass,
        utils,
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
        value: { x: newCameraPosition.x, y: newCameraPosition.y, z: newCameraPosition.z },
        onChange: (e) => {
          newCameraPosition.set(e.x, e.y, e.z);
          material.uniforms.uCameraPosition.value = newCameraPosition;
        },
      },
      'Sky Brightness': {
        value: 1.0,
        onChange: (e) => {
          material.uniforms.uSkyBrightness.value = e;
        },
        max: 1.0,
        min: 0.0,
      },
      reset: button(() => {
        console.log(defaultCameraPosition.x, defaultCameraPosition.y, defaultCameraPosition.z);
        defaultCameraPosition.set(defaultCameraPosition.x, defaultCameraPosition.y, defaultCameraPosition.z);
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

    newCameraPosition.setX(newCameraPosition.x + (right - left) * 0.01);

    newCameraPosition.setY(newCameraPosition.y + (down - up) * 0.01);

    newCameraPosition.setZ(newCameraPosition.z + (back - forward) * 0.01);

    material.uniforms.uCameraPosition.value = newCameraPosition;
    set({
      cameraPosition: {
        x: newCameraPosition.x,
        y: newCameraPosition.y,
        z: newCameraPosition.z,
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
