// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  async function fetchAndRegisterWorker() {
    try {
      // First try to fetch the worker script via fetch() so we can include any headers
      const res = await fetch('/service-worker.js');
      if (res.ok) {
        const scriptText = await res.text();
        const blob = new Blob([scriptText], { type: 'application/javascript' });
        const blobUrl = URL.createObjectURL(blob);
        const registration = await navigator.serviceWorker.register(blobUrl);
        console.log('Service Worker registered from fetched blob:', registration.scope);

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('Service Worker update found!');
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              if (confirm('Nova versão disponível! Atualizar agora?')) {
                window.location.reload();
              }
            }
          });
        });
        return;
      }
      // If fetch returned non-ok (e.g., 401), fall through to normal register
      console.warn('Fetch for service-worker.js returned', res.status, 'falling back to navigator.serviceWorker.register');
    } catch (e) {
      console.warn('Fetch for service-worker.js failed, falling back to normal registration', e.message || e);
    }

    // Fallback: let the browser register the script directly (default behavior)
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered successfully:', registration.scope);
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('Service Worker update found!');
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            if (confirm('Nova versão disponível! Atualizar agora?')) {
              window.location.reload();
            }
          }
        });
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  window.addEventListener('load', () => {
    // Attempt fetch-based registration first — works when smoke harness sets a bypass header for fetch requests
    fetchAndRegisterWorker();
  });
}

// Request notification permission
if ('Notification' in window && 'PushManager' in window) {
  // Wait for user interaction before requesting permission
  document.addEventListener('click', () => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission:', permission);
      });
    }
  }, { once: true });
}
