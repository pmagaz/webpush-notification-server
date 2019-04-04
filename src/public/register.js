/* eslint-disable no-restricted-syntax */
const registerUrl = 'http://localhost:9000/register';
const serviceWorkerUrl = 'http://localhost:9000/public/serviceWorker.js';
const publicVapidKey = 'BPD0vCl_PEpq8guPVpVsVouP-DMvA1iWbPgTuy6zRY1V915u0RMKA_XtxlQTdZUKtlqyMXBhVl7en4W3gWpROoQ';
const applicationServerKey = urlBase64ToUint8Array(publicVapidKey);

const register = async () => {
  if ('serviceWorker' in navigator) {
    const swRegistration = await registerServiceWorker();
    await registerSubscription(swRegistration);
  } else throw new Error('ServiceWorkers are not supported by your browser!');
};

const registerServiceWorker = async () => {
  return await navigator.serviceWorker.register(serviceWorkerUrl);
};

const registerSubscription = async swRegistration => {
  await window.Notification.requestPermission();
  const subscribed = await swRegistration.pushManager.getSubscription();
  if (!subscribed) {
    const subscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey
    });
    const saved = await saveSubscription(subscription);
    if (saved) return saved;
    throw Error('Subscription not saved!');
  }
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

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

register();
