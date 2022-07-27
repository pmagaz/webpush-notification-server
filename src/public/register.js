/* eslint-disable no-restricted-syntax */
const registerUrl = 'http://localhost:8000/register?ssid='+navigator.userAgent;
const serviceWorkerUrl = 'http://localhost:8000/serviceWorker.js';
const publicVapidKey = 'BPB3wdNSAqqKC7tfAQCM2QGPNKD8_MLwEDuq72NE1-V7Z6uQCKs5Bp02cjoiKE-f-wKGuEtmmOWV7NRId5k-igg';

const urlBase64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const saveSubscription = async subscription => {
  const res = await fetch(registerUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscription)
  });
  return res.status === 200 ? res.json() : false;
};

const generateSubscription = async swRegistration => {
  await window.Notification.requestPermission();
  const pushSubscription = await swRegistration.pushManager.getSubscription();
  if (!pushSubscription) {
    const subscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    console.log("pushSubscription first time", subscription);
    const saved = await saveSubscription(subscription);
    if (saved) return saved;
    throw Error('Subscription not saved!');
  } else {
    console.log("pushSubscription reused", pushSubscription);
    return pushSubscription;
  } 
};

const registerServiceWorker = async () => {
  return await navigator.serviceWorker.register(serviceWorkerUrl);
};

const register = async () => {
  if ('serviceWorker' in navigator) {
    const swRegistration = await registerServiceWorker();
    navigator.serviceWorker.addEventListener('message', function(e) {
      switch(e.data) {
        default:
          alert('client recv message from ws'+ e.data);
          e.ports[0].postMessage(e.data);
          break;
      }
     });
    await generateSubscription(swRegistration);
  } else throw new Error('ServiceWorkers are not supported by your browser!');
};

register();
