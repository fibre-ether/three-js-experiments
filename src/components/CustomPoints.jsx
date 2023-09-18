import { Points } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { buffer } from "maath";
import { useEffect, useRef, useState } from "react";
import { MathUtils, Quaternion, Vector3 } from "three";

const makeBuffer = (...args) => Float32Array.from(...args);

const rotationAxis = new Vector3(0, 1, 0).normalize();
const negativeRotationAxis = new Vector3(0, -1, 0).normalize();
const q = new Quaternion();

function CustomPoints() {
  const n = 2000;
  const sphereRadius = 10;
  const cubeSide = 8;

  const colorA = makeBuffer(
    makeBuffer({ length: n * 3 }, (_, v) =>
      v % 3 == 2 ? Math.random() * 0.25 : Math.random()
    )
  );

  const colorB = makeBuffer(
    makeBuffer({ length: n * 3 }, (_, v) =>
      v % 3 == 2
        ? Math.random()
        : v % 3 == 2
        ? Math.random() * 0.8
        : Math.random() * 0.5
    )
  );

  let cubePosition = [];
  for (let i = 0; i < n; i++) {
    const side = Math.floor(Math.random() * 6);
    const x = side === 0 ? -1 : side === 3 ? 1 : MathUtils.randFloatSpread(2);
    const y = side === 1 ? -1 : side === 4 ? 1 : MathUtils.randFloatSpread(2);
    const z = side === 2 ? -1 : side === 5 ? 1 : MathUtils.randFloatSpread(2);
    cubePosition = [...cubePosition, x * cubeSide, y * cubeSide, z * cubeSide];
  }

  let spherePosition = [];
  for (let i = 0; i < n; i++) {
    const x = Math.random() - 0.5;
    const y = Math.random() - 0.5;
    const z = Math.random() - 0.5;
    const normalizer = sphereRadius / Math.sqrt(x * x + y * y + z * z);
    spherePosition = [
      ...spherePosition,
      x * normalizer,
      y * normalizer,
      z * normalizer,
    ];
  }

  let scroll = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scroll.current = window.scrollY / window.innerHeight;
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [positionA] = useState(() => makeBuffer(cubePosition));
  const [positionB] = useState(() => makeBuffer(spherePosition));
  const [positionFinal] = useState(() => positionA.slice(0));
  const [color] = useState(() => colorA.slice(0));
  const [size] = useState(() =>
    makeBuffer({ length: n }, () => Math.random() * 0.2)
  );

  const { damping } = useControls({
    damping: {
      value: 0.05,
      min: 0.01,
      max: 0.1,
      step: 0.01,
    },
  });
  let currentScroll = 0;

  useFrame((_, delta) => {
    const r1 = scroll.current;

    currentScroll += Math.floor((r1 - currentScroll) * damping * 1000) / 1000;

    buffer.lerp(colorA, colorB, color, currentScroll);

    buffer.lerp(positionA, positionB, positionFinal, currentScroll);

    buffer.rotate(positionA, {
      q: q.setFromAxisAngle(rotationAxis, delta),
    });

    buffer.rotate(positionB, {
      q: q.setFromAxisAngle(negativeRotationAxis, delta),
    });
  });

  return (
    <>
      <Points positions={positionFinal} colors={color} sizes={size}>
        {/* eslint-disable-next-line */}
        <pointsMaterial vertexColors size={0.75} />
      </Points>
    </>
  );
}

export default CustomPoints;
