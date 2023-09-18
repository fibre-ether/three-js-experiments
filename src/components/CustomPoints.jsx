import { Points, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { buffer } from "maath";
import { useState } from "react";
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

  const scroll = useScroll();

  const [positionA] = useState(() => makeBuffer(cubePosition));
  const [positionB] = useState(() => makeBuffer(spherePosition));
  const [positionFinal] = useState(() => positionA.slice(0));
  const [color] = useState(() => colorA.slice(0));
  const [size] = useState(() =>
    makeBuffer({ length: n }, () => Math.random() * 0.2)
  );

  useFrame((_, delta) => {
    const r1 = scroll.range(0, 1);
    // const et = clock.getElapsedTime();
    // const t = misc.remap(Math.sin(et), [-1, 1], [0, 1]);
    buffer.lerp(colorA, colorB, color, r1);
    buffer.lerp(positionA, positionB, positionFinal, r1);
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
        {/* eslint-disable-net */}
        <pointsMaterial vertexColors size={0.75} />
      </Points>
    </>
  );
}

export default CustomPoints;
