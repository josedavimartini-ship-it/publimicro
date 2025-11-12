declare global {
  interface Window {
    // Older Safari/WebKit prefix for AudioContext
    webkitAudioContext?: typeof AudioContext;

    // Google Maps / Earth global (used in some map components)
    google?: any;

    // App-specific audio controller used by Carcara3D or other components
    __publimicroCarcaraAudio?: {
      play?: () => void;
      stop?: () => void;
    };
  }
}

export {};
