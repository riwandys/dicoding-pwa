importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js'
);

if (workbox) console.log(`Workbox berhasil dimuat`);
else console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute(
  [
    { url: '/', revision: '2' },
    { url: '/manifest.json', revision: '2' },
    { url: '/index.html', revision: '2' },
    { url: '/nav.html', revision: '2' },
    { url: '/teams.html', revision: '2' },
    { url: '/css/materialize.min.css', revision: '2' },
    { url: '/js/materialize.min.js', revision: '2' },
    { url: '/js/nav.js', revision: '2' },
    { url: '/js/api.js', revision: '2' },
    { url: '/js/idb.js', revision: '2' },
    { url: '/js/db.js', revision: '2' },
    { url: '/js/favorite.js', revision: '2' },
    { url: '/js/register-sw.js', revision: '2' },
    { url: '/image/badge.png', revision: '2' },
    { url: '/image/icon.png', revision: '2' },
    { url: '/image/favicon.png', revision: '2' },
    { url: '/image/icon-64.png', revision: '2' },
    { url: '/image/icon-128.png', revision: '2' },
    { url: '/image/icon-192.png', revision: '2' },
    { url: '/image/icon-256.png', revision: '2' },
    { url: '/image/icon-384.png', revision: '2' },
  ],
  {
    ignoreUrlParametersMatching: [/.*/],
  }
);

workbox.routing.registerRoute(
  new RegExp('/pages/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'pages-cache',
  })
);

workbox.routing.registerRoute(
  /^https:\/\/(storage|fonts)\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'googleapis',
  })
);

workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  /^https:\/\/unpkg\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'snarkdown',
  })
);

workbox.routing.registerRoute(
  /^https:\/\/api\.football-data\.org\/v2/,
  workbox.strategies.networkFirst({
    cacheName: 'football-data',
    networkTimeoutSeconds: 5,
  })
);

workbox.routing.registerRoute(
  /^https:\/\/crests\.football-data\.org/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'football-data',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 20,
      }),
    ],
  })
);

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
      primaryKey: 2,
    },
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});
