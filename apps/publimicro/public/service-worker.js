const CACHE_NAME = 'publimicro-v1';
const STATIC_CACHE = 'publimicro-static-v1';
const DYNAMIC_CACHE = 'publimicro-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip cross-origin requests
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  // API requests - network only
  if (request.url.includes('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // Images - cache first
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          return caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }

  // Other requests - network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        return caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, response.clone());
          return response;
        });
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          return cached || caches.match('/offline');
        });
      })
  );
});

// Background sync for offline bids
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync', event.tag);
  
  if (event.tag === 'sync-bids') {
    event.waitUntil(syncBids());
  }
});

async function syncBids() {
  try {
    const pendingBids = await getpendingBids();
    
    for (const bid of pendingBids) {
      try {
        await fetch('/api/bids', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bid)
        });
        await removePendingBid(bid.id);
      } catch (error) {
        console.error('[Service Worker] Failed to sync bid:', error);
      }
    }
  } catch (error) {
    console.error('[Service Worker] Background sync failed:', error);
  }
}

async function getPendingBids() {
  // Get pending bids from IndexedDB
  return [];
}

async function removePendingBid(id) {
  // Remove from IndexedDB
}

// Push notifications for new bids
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'PubliMicro';
  const options = {
    body: data.body || 'Nova notificação',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'default',
    data: data.url || '/',
    actions: [
      {
        action: 'view',
        title: 'Ver',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Fechar'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click');
  
  event.notification.close();

  if (event.action === 'view' || !event.action) {
    const url = event.notification.data || '/';
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});
