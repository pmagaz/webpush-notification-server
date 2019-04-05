/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

const notificationDelay = 500;

const showNotification = (title, options) =>
  new Promise(resolve => {
    setTimeout(() => {
      self.registration.showNotification(title, options).then(() => resolve());
    }, notificationDelay);
  });

self.addEventListener('push', async event => {
  const res = JSON.parse(event.data.text());
  const { title, body, url, icon } = res.payload;
  const options = {
    body,
    icon,
    vibrate: [100],
    data: { url }
  };
  event.waitUntil(showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const { url } = event.notification.data;
  if (url) event.waitUntil(clients.openWindow(url));
});
