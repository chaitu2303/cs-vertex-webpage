const CACHE_NAME = 'cs-vertex-v1.0.0';
const OFFLINE_URL = '/offline.html';

const ASSETS_TO_CACHE = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/assets/logo-nav.png',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // We only want to handle GET requests for caching
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // Don't cache API responses or dynamic admin routes
        if (
          !event.request.url.includes('/api/') && 
          !event.request.url.includes('/admin/') &&
          networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic'
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(async (error) => {
        // Network failed (offline). Return the offline page if it's a navigation request.
        if (event.request.mode === 'navigate') {
          const cache = await caches.open(CACHE_NAME);
          return await cache.match(OFFLINE_URL);
        }
        throw error;
      });
    })
  );
});

// Notifications logic
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/portal/notifications';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Background Sync (Mock integration, true background sync requires IndexedDB queue)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(
      // Normally, this would pull queued forms from IndexedDB and POST them.
      console.log('Background Sync: Network restored. Syncing offline forms...')
    );
  }
});
