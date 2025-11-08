// Local JSX augmentation to ensure tsc recognizes JSX Element
import { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    type Element = import('react').ReactElement;
    interface IntrinsicElements extends ThreeElements {}
  }
}

export {};
