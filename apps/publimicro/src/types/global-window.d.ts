declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
    __publimicroCarcaraAudio?: {
      play?: () => void;
      stop?: () => void;
    };
  }
}

export {};
