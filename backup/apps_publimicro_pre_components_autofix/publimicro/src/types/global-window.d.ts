declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
    google?: any;
    __publimicroCarcaraAudio?: {
      play?: () => void;
      stop?: () => void;
    };
  }
}

export {};
