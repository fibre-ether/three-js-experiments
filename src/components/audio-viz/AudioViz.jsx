import { Bounds } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useContext, useEffect, useMemo, useRef } from "react";
import { ShaderMaterial } from "three";
import { useControls } from "leva";
import { DemoFoldersContext } from "../../App";
import { max } from "lodash-es";
import vertexShader from "./shaders/audio-viz/vertex.glsl";
import fragmentShader from "./shaders/audio-viz/fragment.glsl";
import gsap from "gsap";

function AudioViz() {
  const ref = useRef();
  const demoFolders = useContext(DemoFoldersContext);

  const sphereResolution = 64;

  const AudioContext = useRef(null);
  const audioContent = useRef(null);
  var permission = false;
  var frequencyArray;
  var analyser;

  var soundAllowed = (stream) => {
    permission = true;
    var audioStream = audioContent.current.createMediaStreamSource(stream);
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

  useEffect(() => {
    if (!permission) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(soundAllowed)
        .catch(soundNotAllowed);

      AudioContext.current = window.AudioContext || window.webkitAudioContext;
      audioContent.current = new AudioContext.current();
    }
  }, []);

  // const [{ waveSpeed, randomness, waveDensity, sphereResolution }, set] =
  useControls(() => ({
    ...demoFolders,
    // config: folder({
    //   waveSpeed: {
    //     value: 0.5,
    //     min: 0,
    //     max: 5.0,
    //     step: 0.1,
    //   },
    //   randomness: {
    //     value: 2.75,
    //     min: 0.0,
    //     max: 10.0,
    //     step: 0.1,
    //   },
    //   waveDensity: {
    //     value: 2.0,
    //     min: 0.0,
    //     max: 10.0,
    //     step: 0.1,
    //   },
    //   sphereResolution: {
    //     value: 64,
    //     min: 8,
    //     max: 128,
    //     step: 10,
    //   },
    //   reset: button(() =>
    //     set({
    //       waveSpeed: 0.5,
    //       randomness: 2.75,
    //       waveDensity: 2.0,
    //       sphereResolution: 64,
    //     })
    //   ),
    // }),
  }));

  const material = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        // uWaveSpeed: { value: waveSpeed },
        // uRandomness: { value: randomness },
        // uWaveDensity: { value: waveDensity },
        uSoundIntensity: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      // wireframe: true,
    });
  }, []);

  const micMin = 50;
  const micMax = 200;
  let currentMax;
  const remap = (value) => {
    const remappedValue = (value - micMin) / (micMax - micMin);
    const result = Math.min(Math.max(remappedValue, 0), 1);
    return result;
  };

  useFrame(({ clock }) => {
    ref.current.rotation.z = clock.elapsedTime * 0.5;
    ref.current.rotation.x = clock.elapsedTime * 0.35;

    analyser?.getByteFrequencyData(frequencyArray);
    currentMax = remap(max(frequencyArray));

    material.uniforms.uTime.value = clock.elapsedTime;
    const soundIntensityUniform = material.uniforms.uSoundIntensity;

    gsap.to(soundIntensityUniform, {
      duration: 0.9,
      ease: "Slow.easeOut",
      value: currentMax,
    });
  });
  return (
    <>
      <Bounds fit clip observe margin={1.8}>
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
