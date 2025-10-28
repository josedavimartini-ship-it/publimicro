"use client";

import { useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import type { Group } from "three";

interface CarcaraModelProps {
  scale?: number;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
}

function CarcaraModel({ scale = 1, onAnimationStart, onAnimationComplete }: CarcaraModelProps) {
  const modelRef = useRef<Group | null>(null);
  const rotationSpeed = useRef(0.5);
  const isAnimating = useRef(false);

  const { scene } = useGLTF("/models/carcara.glb");

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y = 0;
      modelRef.current.position.y = 0;
    }
  }, [scene]);

  useFrame((_, delta) => {
    const obj = modelRef.current;
    if (!obj) return;

    obj.rotation.y += delta * rotationSpeed.current;
    obj.position.y = Math.sin(Date.now() * 0.001) * 0.08;

    const full = Math.PI * 2;
    const cur = ((obj.rotation.y % full) + full) % full;
    if (cur < delta * rotationSpeed.current && !isAnimating.current) {
      isAnimating.current = true;
      onAnimationStart?.();
      setTimeout(() => {
        isAnimating.current = false;
        onAnimationComplete?.();
      }, 1200);
    }
  });

  return <primitive ref={modelRef} object={scene} scale={scale} castShadow receiveShadow />;
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#cfa847" wireframe />
    </mesh>
  );
}

export interface Carcara3DProps {
  className?: string;
  onSoundTrigger?: () => void;
  scale?: number;
}

export function Carcara3D({ className = "", onSoundTrigger, scale = 2 }: Carcara3DProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        shadows
        camera={{ position: [0, 2, 5], fov: 60, near: 0.1, far: 1000 }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
          <directionalLight position={[-5, 5, -5]} intensity={0.8} />
          <spotLight position={[0, 10, 0]} intensity={0.6} angle={0.3} penumbra={1} />

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <shadowMaterial transparent opacity={0.2} />
          </mesh>

          <CarcaraModel scale={scale} onAnimationStart={onSoundTrigger} />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
            maxAzimuthAngle={Math.PI / 4}
            minAzimuthAngle={-Math.PI / 4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/carcara.glb");