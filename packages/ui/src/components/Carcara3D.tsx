"use client";

import { useRef, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useFBX } from "@react-three/drei";
import type { Group } from "three";

interface CarcaraModelProps {
  scale?: number;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
  autoRotate?: boolean;
  rotationSpeed?: number;
  modelPath?: string;
}

function CarcaraModel({ scale = 2.5, onAnimationStart, onAnimationComplete, autoRotate = false, rotationSpeed: rotationSpeedProp = 0.3, modelPath = '/models/eagle/harpy_eagle.fbx' }: CarcaraModelProps) {
  const modelRef = useRef<Group | null>(null);
  const rotationSpeed = useRef(rotationSpeedProp);
  const isAnimating = useRef(false);
  const flightOffset = useRef(0);

  const [sceneObj, setSceneObj] = useState<Group | null>(null);

  useEffect(() => {
    let mounted = true;
    const ext = (modelPath || '').split('.').pop()?.toLowerCase();
    if (ext === 'fbx') {
      // dynamic import to avoid requiring example loader typings at build-time
      // @ts-ignore - dynamic import of example loader may not have typings in this environment
      import('three/examples/jsm/loaders/FBXLoader').then((mod) => {
        const FBXLoader = mod.FBXLoader as unknown as {
          new (): {
            load: (
              url: string,
              onLoad: (obj: Group) => void,
              onProgress?: (progress: ProgressEvent) => void,
              onError?: (err: unknown) => void
            ) => void;
          };
        };
        const loader = new FBXLoader();
        loader.load(
          modelPath,
          (obj: Group) => { if (mounted) setSceneObj(obj as Group); },
          undefined,
          (err: unknown) => { console.warn('FBX load error', modelPath, err); }
        );
      }).catch((err) => console.warn('FBX loader import failed', err));
    } else {
      // @ts-ignore - dynamic import of example loader may not have typings in this environment
      import('three/examples/jsm/loaders/GLTFLoader').then((mod) => {
        const GLTFLoader = mod.GLTFLoader as unknown as {
          new (): {
            load: (
              url: string,
              onLoad: (gltf: { scene: Group }) => void,
              onProgress?: (progress: ProgressEvent) => void,
              onError?: (err: unknown) => void
            ) => void;
          };
        };
        const loader = new GLTFLoader();
        loader.load(
          modelPath,
          (gltf: { scene: Group }) => { if (mounted) setSceneObj(gltf.scene as Group); },
          undefined,
          (err: unknown) => { console.warn('GLTF load error', modelPath, err); }
        );
      }).catch((err) => console.warn('GLTF loader import failed', err));
    }
    return () => { mounted = false; };
  }, [modelPath]);

  const scene = sceneObj;

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

  if (!scene) return null;

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

export function Carcara3D({ className = "", onSoundTrigger, scale = 2.5, autoRotate = false, rotationSpeed = 0.3, modelPath = '/models/eagle/harpy_eagle.fbx', ariaLabel = 'Carcará 3D model' }: Carcara3DProps) {
  const [hasWebGL, setHasWebGL] = useState(true);

  // Check for WebGL availability in the current environment; in headless or GPU-limited environments this will be false
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch (err) {
      setHasWebGL(false);
    }
  }, []);

  // preload the model path to reduce visual load when first shown
  useEffect(() => {
    try {
      const ext = (modelPath || '').split('.').pop()?.toLowerCase();
      if (ext === 'glb' || ext === 'gltf') {
        // @ts-ignore - drei exposes preload for GLTF when available
        useGLTF.preload?.(modelPath);
      } else if (ext === 'fbx') {
        // Some drei versions don't expose preload for FBX; try if present
        // Try a safe cast for optional preload API
        (useFBX as unknown as { preload?: (p: string) => void }).preload?.(modelPath);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('carcara model preload failed', modelPath, err);
    }
  }, [modelPath]);

  // If WebGL is unavailable, render a static fallback to avoid repeated WebGL errors in logs
  if (!hasWebGL) {
    return (
      <div className={`w-full h-full ${className} flex items-center justify-center bg-[#0a0a0a]`} aria-label={ariaLabel} role="img">
        {/* Small illustrative fallback */}
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect width="120" height="120" rx="16" fill="#1a1a1a" stroke="#2a2a2a" />
          <path d="M30 80 C50 60, 70 60, 90 80" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" fill="none" />
          <circle cx="60" cy="44" r="18" fill="#C9A87C" />
        </svg>
      </div>
    );
  }

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

