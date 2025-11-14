"use client";

import { useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import type { Group } from "three";

interface CarcaraModelProps {
  scale?: number;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
  autoRotate?: boolean;
  rotationSpeed?: number;
  modelPath?: string;
}

function CarcaraModel({ scale = 2.5, onAnimationStart, onAnimationComplete, autoRotate = false, rotationSpeed: rotationSpeedProp = 0.3, modelPath = '/models/carcara.glb' }: CarcaraModelProps) {
  const modelRef = useRef<Group | null>(null);
  const rotationSpeed = useRef(rotationSpeedProp);
  const isAnimating = useRef(false);
  const flightOffset = useRef(0);

  const { scene } = useGLTF(modelPath);

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y = 0;
      modelRef.current.position.set(0, 0, 0);
    }
  }, [scene]);

  useFrame((_, delta) => {
    const obj = modelRef.current;
    if (!obj) return;

    // gentle rotation (only when autoRotate enabled)
    if (autoRotate) obj.rotation.y += delta * rotationSpeed.current;

    // drift upward slightly and reduce bobbing over first 6 seconds
    flightOffset.current += delta * 1.2;
    const t = Math.min(1, flightOffset.current / 6); // 0 -> 1 over ~6s
    const amplitude = 0.30 * (1 - 0.6 * t); // damp amplitude to 40% of initial
    obj.position.y = Math.sin(flightOffset.current) * amplitude + 0.15; // bias upward
    obj.rotation.z = Math.sin(flightOffset.current * 0.7) * 0.04;
    obj.rotation.x = Math.sin(flightOffset.current * 0.5) * 0.02;

    const full = Math.PI * 2;
    const cur = ((obj.rotation.y % full) + full) % full;
    if (cur < delta * rotationSpeed.current && !isAnimating.current) {
      isAnimating.current = true;
      onAnimationStart?.();
      setTimeout(() => {
        isAnimating.current = false;
        onAnimationComplete?.();
      }, 1500);
    }
  });

  return <primitive ref={modelRef} object={scene} scale={scale} castShadow receiveShadow />;
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#cfa847" wireframe />
    </mesh>
  );
}

export interface Carcara3DProps {
  className?: string;
  onSoundTrigger?: () => void;
  scale?: number;
  autoRotate?: boolean;
  rotationSpeed?: number;
  modelPath?: string;
  ariaLabel?: string;
}

export function Carcara3D({ className = "", onSoundTrigger, scale = 2.5, autoRotate = false, rotationSpeed = 0.3, modelPath = '/models/carcara.glb', ariaLabel = 'Carcará 3D model' }: Carcara3DProps) {
  // preload the model path to reduce visual load when first shown
  useEffect(() => {
    try {
      // @ts-ignore - three/drei exposes preload in runtime
      useGLTF.preload?.(modelPath);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('carcara model preload failed', modelPath, err);
    }
  }, [modelPath]);

  return (
    <div className={`w-full h-full ${className}`} aria-label={ariaLabel} role="img">
      <Canvas
        shadows
        camera={{ position: [0, 1, 6], fov: 50, near: 0.1, far: 1000 }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={2} castShadow color="#ffd700" />
          <directionalLight position={[-10, 5, -5]} intensity={1} color="#ff8800" />
          <spotLight position={[0, 15, 0]} intensity={1} angle={0.4} penumbra={1} color="#ffaa00" />

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
            <planeGeometry args={[30, 30]} />
            <shadowMaterial transparent opacity={0.15} />
          </mesh>

          <CarcaraModel scale={scale} onAnimationStart={onSoundTrigger} autoRotate={autoRotate} rotationSpeed={rotationSpeed} modelPath={modelPath} />

          <OrbitControls
            enableZoom={true}
            minDistance={3}
            maxDistance={10}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
            autoRotate={false}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/carcara.glb");