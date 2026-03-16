importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:"AIzaSyBDYR4vrVu97IJIJrDom_6mEZiFibn6eys",
  authDomain:"cuteyhub.firebaseapp.com",
  databaseURL:"https://cuteyhub-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:"cuteyhub",
  storageBucket:"cuteyhub.firebasestorage.app",
  messagingSenderId:"631463559935",
  appId:"1:631463559935:web:37091bc36906f66d55c2ca"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || 'CuteyHub 💜', {
    body: body || 'Your partner sent you something sweet',
    icon: '/icon.png',
    badge: '/icon.png',
    tag: 'cuteyhub-connect',
    renotify: true,
    vibrate: [200, 100, 200],
    data: { url: '/' }
  });
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes(self.location.origin)) { client.focus(); return; }
      }
      clients.openWindow('/');
    })
  );
});

const CACHE = 'cuteyhub-v2';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/', '/index.html', '/icon.png', '/manifest.json'])));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request)));
});
