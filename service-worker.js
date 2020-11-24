const CACHE_NAME = 'premier-league';
var urlsToCache = [
  '/',
  '/manifest.json',
  '/image/badge.png',
  '/image/icon.png',
  '/image/favicon.png',
  '/image/icon-64.png',
  '/image/icon-128.png',
  '/image/icon-192.png',
  '/image/icon-256.png',
  '/image/icon-384.png',
  '/nav.html',
  '/index.html',
  '/teams.html',
  '/pages/home.html',
  '/pages/fixtures.html',
  '/pages/favorite.html',
  '/css/materialize.min.css',
  '/js/materialize.min.js',
  '/js/nav.js',
  '/js/api.js',
  '/js/idb.js',
  '/js/db.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const base_url = 'https://api.football-data.org/v2/';
  const base_url2 = 'https://crests.football-data.org/';
  const online = navigator.onLine;

  if (
    (event.request.url.indexOf(base_url) > -1 ||
      event.request.url.indexOf(base_url2) > -1) &&
    online
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return fetch(event.request).then((response) => {
          cache.put(event.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

self.addEventListener('activate', (event) => {
  clients.claim();
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName != CACHE_NAME) {
            console.log('ServiceWorker: cache ' + cacheName + ' dihapus');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('push', (event) => {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    badge: './badge.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});
