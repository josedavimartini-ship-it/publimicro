/**
 * Type definitions for React Three Fiber (R3F)
 * Extends React's JSX namespace to include Three.js elements
 * This allows TypeScript to recognize <mesh>, <boxGeometry>, etc.
 */

/// <reference types="@react-three/fiber" />

import type { ThreeElements } from '@react-three/fiber';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}