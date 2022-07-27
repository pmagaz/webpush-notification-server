/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

const notificationDelay = 500;

const showNotification = (title, options) =>
  new Promise(resolve => {
    setTimeout(() => {
      swPostMessageToAllClients(title);
      //self.registration.showNotification(title, options).then(() => resolve());
    }, notificationDelay);
  });

self.addEventListener('push', async event => {
  
  const res = JSON.parse(event.data.text());
  console.log("He recibido algo", res);
  const { title, body, url, icon } = res.payload;
  const options = {
    body,
    icon,
    vibrate: [100],
    data: { url }
  };

  event.waitUntil(showNotification(title, options));
});

function swPostMessageToAllClients(msg) {
  console.log("swPostMessageToAllClients", msg);
  clients.matchAll().then(function(clients) {
    console.log("clients", clients);
    clients.forEach(function(client) {
      console.log("client", client)
      swPostMessageToClient(client, msg).then(function(response) {
        console.log('response from client', response);
      });
    });
  });
}

function swPostMessageToClient(client, msg) {
  return new Promise(function(resolve, reject) {
    var msg_chan = new MessageChannel();

    msg_chan.port1.onmessage = function(e) {
      if (e.data.error) {
        reject(e.data.error);
      } else {
        resolve(e.data);
      }
    };

    client.postMessage(msg, [ msg_chan.port2 ]);
  });
}

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const { url } = event.notification.data;
  if (url) event.waitUntil(clients.openWindow(url));
});
