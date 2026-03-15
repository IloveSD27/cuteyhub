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

// Handle background messages
messaging.onBackgroundMessage(payload => {
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || 'CuteyHub ♡', {
    body: body || '',
    icon: icon || '/icon.png',
    badge: '/icon.png',
    vibrate: [200, 100, 200],
    data: payload.data || {}
  });
});

// Handle notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      if (list.length > 0) return list[0].focus();
      return clients.openWindow('/');
    })
  );
});
