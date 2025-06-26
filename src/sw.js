const CACHE_NAME = 'story-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/src/styles/styles.css',
  '/src/main.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Simpan app shell saat install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Hapus cache lama saat activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

// Fetch dengan fallback
self.addEventListener('fetch', (event) => {
  // Skip permintaan chrome-extension, WebSocket, dan skema tidak didukung
  if (
    !event.request.url.startsWith('http') || // Hanya tangani skema HTTP/HTTPS
    event.request.url.startsWith('chrome-extension://') ||
    event.request.url.startsWith('ws://') ||
    event.request.url.startsWith('wss://')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request.clone())
        .then((response) => {
          // Validasi respons
          if (
            !response ||
            response.status !== 200 ||
            response.type !== 'basic' ||
            !response.url.startsWith('http')
          ) {
            return response;
          }

          // Cache respons yang valid
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            })
            .catch((err) => {
              console.error('Cache put error:', err);
            });

          return response;
        })
        .catch((error) => {
          console.error('Fetch error:', error);
          // Jika offline dan ada di cache, coba ambil dari cache
          return caches.match(event.request);
        });
    })
  );
});

// Handle push notification
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'No payload',
    icon: '/favicon.png',
    badge: '/favicon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Story App', options)
  );
});
