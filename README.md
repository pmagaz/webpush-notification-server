# Web Push Notification Server

This repository is a NodeJs Express server for sending [Web Push Notifications](https://developers.google.com/web/fundamentals/codelabs/push-notifications/) using [web-push](https://www.npmjs.com/package/web-push) and storing subscriptions using [NeDb](https://github.com/louischatriot/nedb) database. It also contains a client [Service Worker](https://developers.google.com/web/fundamentals/primers/service-workers/) to receive Web Push notifications in the browser.

## Table of contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Launching Server](#launching)
4. [Sending Notifications](#sending)
5. [Architecture](#architecture)

## Installation

Clone this repo and run

```
$ npm install OR yarn install
```

## Configuration

This server uses [web-push](https://www.npmjs.com/package/web-push) that uses VAPID keys, so first of all you need to generate public and private VAPID keys. There is an npm task created for this purpose:

```
$ yarn generate-keys
```

After executing this command web-push will generate the keys and you will see an output like this:

```
Public Key:
BCM53UTKD0nS25mP-acJ5uLOU062ULE4sIKDbNWQxyFYOhAyHuIG6UWaFazsxHfUuHr6I9X1bZEk5kZRi_DzZv9

Private Key:
AkHoWx6QCoqEXFONg8xMpH1EKCLLpkBngEmUX9qzcn1
```

Then you have to add both generated keys to the server. This project uses [DotEnv](https://github.com/motdotla/dotenv).configuration files. Open the `.env` file you will find in the root directory and add your generated keys and a valid email as following:

```
...
PUBLIC_KEY="YOUR_GENERATED_PUBLIC_KEY"
PRIVATE_KEY="YOUR_GENERATED_PRIVATE_KEY"
MAILTO='mailto:me@mysite.com'
...
```

Also you have to add the public key to the client source code. Open `src/public/register.js`

```js
const publicVapidKey = "YOUR_GENERATED_PUBLIC_KEY";
```

## Launching

First of all you have to launch the server with the following command:

```
$ yarn start
```

This will launch the Web Push notification server in the port defined in `.env` file and also will serve the client side code located in `public/` folder using express static path. This client code will register the service worker and prompt the user to allow Web Push notifications from that host.

If the user accepts to receive notifications, a new subscription will be generated using [subscribe](https://developer.mozilla.org/en-US/docs/Web/API/PushManager/subscribe) method of the [PushManager](https://developer.mozilla.org/en-US/docs/Web/API/PushManager) and the subscription will be sent to
`http://localhost:8000/register` POST route that will store the subscription in the database if it doesn't exists yet.

## Sending

To send notifications you have to make a POST request to the `http://localhost:8000/send` route that will get all the subscriptions stored in the database and send a notification for all of them using the following data:

```json
{
  "title": "Notification title",
  "body": "Notification body",
  "url": "https://mysite.com"
}
```

The browser will receive the notification and when the user will click on the notification a new browser window will load the url value. You can configure the notification icon in `.env` file.

Notice that the subscription will be removed from the database in case to get a 410 error, meaning that the subscription stored in our database is no longer valid and it should be generated again.

In `public/index/html` you will find a form to easily test the sending process but you can also use Postman, Curl or similar.

## Architecture

### Server ( `src/server` )

- `index.js` Root file that imports ESM to use ECMAScript modules in NodeJs.

- `server.js` Basic Express server that configure the routes and statics paths.

- `/statics` Statics paths to serve public content located in "src/public".

- `/routing` Express routes and its handlers for save subscriptions and send Web Push notifications.

- `/db` NeDb database handlers for insert, remove and get all the subscriptions stored in the database.

### Client ( `src/public` )

- `index.html` Html file that allows you to send the notification with an specific data/payload using a form field.

- `register.js` File that registers the service worker and will send the Web Push subscription to the server.

- `serviceWorker.js` Service worker itself!

## License

MIT
