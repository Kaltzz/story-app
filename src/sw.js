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

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  if (
    !event.request.url.startsWith('http') || // hanya tangani HTTP/HTTPS
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
          if (
            !response ||
            response.status !== 200 ||
            response.type !== 'basic' ||
            !response.url.startsWith('http')
          ) {
            return response;
          }

          const responseToCache = response.clone();
          if (event.request.url.startsWith('http')) {
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseToCache))
              .catch((err) => console.error('Cache put error:', err));
          }

          return response;
        })
        .catch((error) => {
          console.error('Fetch error:', error);
          return caches.match(event.request);
        });
    })
  );
});

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
