// Tipagens globais para suportar elementos do @react-three/fiber no JSX
// ---------------------------------------------------------------

import { ThreeElements } from '@react-three/fiber';

// 🔹 Garante que o TypeScript reconheça elementos 3D como <primitive>, <mesh>, <ambientLight> etc.
declare global {
  namespace JSX {
    // Ensure standard JSX types are present (Element) so we don't override React's global JSX shape.
    // `Element` is required by many TSX/JSX type checks. We re-use React's ReactElement here.
    type Element = import('react').ReactElement;
    interface IntrinsicElements extends ThreeElements {}
  }
}

// 🔹 Evita o TypeScript apagar este arquivo (import usado apenas para manter o escopo global ativo)
export {};
