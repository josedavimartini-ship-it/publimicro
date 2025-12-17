"use client";

import { useRef, Suspense, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useFBX, useTexture, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { Group } from "three";

type Phase = 
  | 'background'   // Bird flies in background
  | 'diving'       // Bird swoops toward camera
  | 'attacking'    // Bird attacks/strikes screen
  | 'retreating';  // Bird flies back to background

interface HarpyEagleModelProps {
  onPhaseChange?: (phase: Phase) => void;
  attackInterval?: number; // ms between attacks
}

function HarpyEagleModel({ onPhaseChange, attackInterval = 15000 }: HarpyEagleModelProps) {
  const modelRef = useRef<Group | null>(null);
  const { viewport } = useThree();
  
  // Animation state
  const [phase, setPhase] = useState<Phase>('background');
  const timeRef = useRef(0);
  const phaseTimeRef = useRef(0);
  const lastAttackRef = useRef(0);
  
  // Load FBX model
  const model = useFBX('/models/eagle/harpy_eagle.fbx');
  
  // Load textures
  const [diffuse, metallic, normal] = useTexture([
    '/models/eagle/texture_diffus1e.png',
    '/models/eagle/texture_metallic.png',
    '/models/eagle/texture_normal.png'
  ]);

  // Apply textures to model
  useEffect(() => {
    if (model) {
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const material = new THREE.MeshStandardMaterial({
            map: diffuse,
            metalnessMap: metallic,
            normalMap: normal,
            metalness: 0.3,
            roughness: 0.7,
          });
          child.material = material;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [model, diffuse, metallic, normal]);

  // Phase change handler
  const changePhase = useCallback((newPhase: Phase) => {
    setPhase(newPhase);
    phaseTimeRef.current = 0;
    onPhaseChange?.(newPhase);
  }, [onPhaseChange]);

  useFrame((_, delta) => {
    const obj = modelRef.current;
    if (!obj) return;

    timeRef.current += delta;
    phaseTimeRef.current += delta;

    const w = viewport.width;
    const h = viewport.height;

    switch (phase) {
      case 'background': {
        // Fly in circular pattern in background
        const t = timeRef.current * 0.5;
        const radius = Math.min(w, h) * 0.4;
        obj.position.x = Math.sin(t) * radius;
        obj.position.y = Math.cos(t * 0.7) * 1.5 + 2;
        obj.position.z = -8 + Math.sin(t * 0.3) * 2;
        
        // Face direction of movement
        obj.rotation.y = Math.atan2(Math.cos(t), -Math.sin(t * 0.7)) + Math.PI;
        obj.rotation.z = Math.sin(t) * 0.15;
        obj.rotation.x = Math.cos(t * 0.7) * 0.1;
        
        // Check if time for attack
        if (timeRef.current - lastAttackRef.current > attackInterval / 1000) {
          lastAttackRef.current = timeRef.current;
          changePhase('diving');
        }
        break;
      }
      
      case 'diving': {
        // Swoop toward camera - 1.5 seconds
        const progress = Math.min(phaseTimeRef.current / 1.5, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        
        // Start position (wherever it was in background)
        const startX = obj.position.x;
        const startZ = -8;
        
        // Dive toward center-ish of screen
        obj.position.x = THREE.MathUtils.lerp(startX, (Math.random() - 0.5) * 2, eased);
        obj.position.y = THREE.MathUtils.lerp(3, 0, eased);
        obj.position.z = THREE.MathUtils.lerp(startZ, 3, eased);
        
        // Rotate to face camera aggressively
        obj.rotation.y = THREE.MathUtils.lerp(obj.rotation.y, 0, eased * 2);
        obj.rotation.x = THREE.MathUtils.lerp(0, -0.5, eased); // Dive angle
        obj.rotation.z = Math.sin(phaseTimeRef.current * 15) * 0.1 * (1 - progress); // Wing flap
        
        if (progress >= 1) {
          changePhase('attacking');
        }
        break;
      }
      
      case 'attacking': {
        // Attack/strike screen - 0.8 seconds
        const progress = Math.min(phaseTimeRef.current / 0.8, 1);
        
        if (progress < 0.4) {
          // Lunge forward
          const lungeProgress = progress / 0.4;
          const eased = 1 - Math.pow(1 - lungeProgress, 2);
          obj.position.z = THREE.MathUtils.lerp(3, 5, eased);
          obj.rotation.x = THREE.MathUtils.lerp(-0.5, -0.8, eased);
          // Scale up slightly for impact
          const scale = 1 + eased * 0.3;
          obj.scale.setScalar(0.015 * scale);
        } else {
          // Recoil
          const recoilProgress = (progress - 0.4) / 0.6;
          obj.position.z = THREE.MathUtils.lerp(5, 2, recoilProgress);
          obj.rotation.x = THREE.MathUtils.lerp(-0.8, 0, recoilProgress);
          obj.scale.setScalar(0.015);
        }
        
        // Shake/vibrate during attack
        obj.position.x += (Math.random() - 0.5) * 0.1;
        obj.position.y += (Math.random() - 0.5) * 0.1;
        
        if (progress >= 1) {
          changePhase('retreating');
        }
        break;
      }
      
      case 'retreating': {
        // Fly back to background - 2 seconds
        const progress = Math.min(phaseTimeRef.current / 2, 1);
        const eased = 1 - Math.pow(1 - progress, 2);
        
        // Return to background position
        const targetX = Math.sin(timeRef.current * 0.5) * viewport.width * 0.3;
        obj.position.x = THREE.MathUtils.lerp(obj.position.x, targetX, eased);
        obj.position.y = THREE.MathUtils.lerp(0, 3, eased);
        obj.position.z = THREE.MathUtils.lerp(2, -8, eased);
        
        // Turn around
        obj.rotation.y = THREE.MathUtils.lerp(0, Math.PI, eased);
        obj.rotation.x = THREE.MathUtils.lerp(0, 0, eased);
        obj.rotation.z = Math.sin(phaseTimeRef.current * 8) * 0.15 * (1 - progress);
        
        if (progress >= 1) {
          changePhase('background');
        }
        break;
      }
    }
  });

  if (!model) return null;

  return (
    <primitive 
      ref={modelRef} 
      object={model} 
      scale={0.015} 
      castShadow 
      receiveShadow 
    />
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 0.3, 1.5]} />
      <meshStandardMaterial color="#8B4513" wireframe />
    </mesh>
  );
}

// Screen flash effect when eagle attacks
function ScreenFlash({ active }: { active: boolean }) {
  if (!active) return null;
  
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[100] animate-flash"
      style={{
        background: 'radial-gradient(circle at center, rgba(255,200,100,0.4) 0%, transparent 70%)',
        animation: 'flash 0.3s ease-out'
      }}
    />
  );
}

export interface HarpyEagle3DProps {
  className?: string;
  attackInterval?: number; // ms between attacks (default 15000)
  onAttack?: () => void;
}

export function HarpyEagle3D({ 
  className = "", 
  attackInterval = 15000,
  onAttack 
}: HarpyEagle3DProps) {
  const [isAttacking, setIsAttacking] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  const handlePhaseChange = (phase: Phase) => {
    setIsAttacking(phase === 'attacking' || phase === 'diving');
    
    if (phase === 'attacking') {
      setShowFlash(true);
      onAttack?.();
      setTimeout(() => setShowFlash(false), 300);
    }
  };

  return (
    <>
      <ScreenFlash active={showFlash} />
      <div 
        className={`w-full h-full ${className} ${isAttacking ? 'z-50' : 'z-10'}`} 
        aria-label="Harpy Eagle 3D - Gavião Real" 
        role="img"
        style={{
          transition: 'z-index 0.3s'
        }}
      >
        <Canvas
          shadows
          camera={{ position: [0, 2, 8], fov: 60, near: 0.1, far: 100 }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={<LoadingFallback />}>
            {/* Ambient light for overall visibility */}
            <ambientLight intensity={1.2} />
            
            {/* Main directional light - sun */}
            <directionalLight 
              position={[10, 15, 10]} 
              intensity={2.5} 
              castShadow 
              color="#ffd700"
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            
            {/* Fill light */}
            <directionalLight 
              position={[-10, 5, -10]} 
              intensity={0.8} 
              color="#ff9944" 
            />
            
            {/* Rim light for drama */}
            <spotLight 
              position={[0, 20, -10]} 
              intensity={1.5} 
              angle={0.5} 
              penumbra={1} 
              color="#ffcc88" 
            />

            <HarpyEagleModel 
              onPhaseChange={handlePhaseChange}
              attackInterval={attackInterval}
            />

            <OrbitControls
              enabled={false}
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
            />
          </Suspense>
        </Canvas>
      </div>
      

    </>
  );
}

export default HarpyEagle3D;
