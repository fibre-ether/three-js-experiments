import { Bounds } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useContext, useMemo, useRef } from "react";
import { IcosahedronGeometry, ShaderMaterial } from "three";
import { button, folder, useControls } from "leva";
import { DemoFoldersContext } from "../../App";
import { max } from "lodash-es";
import vertexShader from "./shaders/audio-viz/vertex.glsl";
import fragmentShader from "./shaders/audio-viz/fragment.glsl";
import gsap from "gsap";

function AudioViz() {
  const ref = useRef();
  const AudioContext = useRef(null);
  const audioContent = useRef(null);

  const demoFolders = useContext(DemoFoldersContext);

  var permission = false;
  var frequencyArray;
  var analyser;
  var audioStream;

  let currentMax;
  let sphereResolution = 64;

  let micMin = 50;
  let micMax = 200;

  var soundAllowed = (stream) => {
    permission = true;
    audioStream = audioContent.current.createMediaStreamSource(stream);
    analyser = audioContent.current.createAnalyser();
    var fftSize = 32;

    analyser.fftSize = fftSize;
    audioStream.connect(analyser);

    var bufferLength = analyser.frequencyBinCount;
    frequencyArray = new Uint8Array(bufferLength).fill(0);
  };

  var soundNotAllowed = (error) => {
    console.log(error);
  };

  const updateGeometry = (ref, size) => {
    const icosahedron = new IcosahedronGeometry(1, size, size);
    ref.current.geometry = icosahedron;
  };

  //eslint-disable-next-line
  const [_, set] = useControls(() => ({
    ...demoFolders,
    config: folder({
      micMin: {
        value: 50,
        min: 0,
        max: 100,
        label: "Min limit",
        onChange: (e) => {
          micMin = e;
        },
      },
      micMax: {
        value: 200,
        min: 101,
        max: 300,
        label: "Max limit",
        onChange: (e) => {
          micMax = e;
        },
      },
      sphereResolution: {
        value: 64,
        min: 0,
        max: 128,
        label: "Resolution",
        onChange: (e) => {
          updateGeometry(ref, e);
        },
      },
      ["Allow/Revoke Mic"]: button(() => {
        if (!permission) {
          navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(soundAllowed)
            .catch(soundNotAllowed);
          AudioContext.current =
            window.AudioContext || window.webkitAudioContext;
          audioContent.current = new AudioContext.current();
        } else {
          audioStream.context.close();
          permission = false;
        }
      }),
      "reset settings": button(() => {
        micMin = 50;
        micMax = 200;
        updateGeometry(ref, 64);
        set({ micMin: 50, micMax: 200, sphereResolution: 64 });
      }),
    }),
  }));

  const material = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSoundIntensity: { value: 0 },
      },
      vertexShader,
      fragmentShader,
    });
  }, []);

  const soundIntensityUniform = material.uniforms.uSoundIntensity;

  const remap = (value) => {
    const remappedValue = (value - micMin) / (micMax - micMin);
    const result = Math.min(Math.max(remappedValue, 0), 1);
    return result;
  };

  useFrame(({ clock }) => {
    ref.current.rotation.z = clock.elapsedTime * 0.5;
    ref.current.rotation.x = clock.elapsedTime * 0.35;
    if (permission) {
      material.uniforms.uTime.value = clock.elapsedTime;

      analyser?.getByteFrequencyData(frequencyArray);
      currentMax = remap(max(frequencyArray) || 0);
    } else {
      currentMax = 0;
    }
    gsap.to(soundIntensityUniform, {
      duration: 0.9,
      ease: "Slow.easeOut",
      value: currentMax,
    });
  });
  return (
    <>
      <Bounds fit clip observe margin={1.1}>
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
    </>
  );
}

export default AudioViz;
