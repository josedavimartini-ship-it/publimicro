/// <reference path="../types.d.ts" />

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface CarcaraModelProps {
  scale?: number;
}

function CarcaraModel({ scale = 1 }: CarcaraModelProps) {
  const { scene } = useGLTF("/carcara.glb") as any;
  const ref = useRef<THREE.Object3D>(null!);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.5;
  });

  return <primitive object={scene} ref={ref} scale={[scale, scale, scale]} />;
}

export function Carcara3D() {
  return (
    <div className="w-full h-[300px]">
      <Canvas camera={{ position: [0, 1.5, 3] }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <CarcaraModel scale={1.5} />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
