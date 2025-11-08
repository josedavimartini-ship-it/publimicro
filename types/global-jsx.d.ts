// Repo-level JSX augmentation so all packages have a JSX.Element type available
import { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    // Use React's ReactElement for Element so TSX checks work across the monorepo
    type Element = import('react').ReactElement;
    interface IntrinsicElements extends ThreeElements {}
  }
}

export {};
