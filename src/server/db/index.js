/* eslint-disable no-underscore-dangle */
import Nedb from 'nedb';

export const db = new Nedb({ filename: process.env.DB_PATH, autoload: true });

export const saveSubscription = async subscription =>
  await new Promise((resolve, reject) => {
    db.find({ endpoint: subscription.endpoint }, (findErr, docs) => {
      if (docs.length === 0) {
        db.insert(subscription, insertErr => {
          if (insertErr) reject(insertErr);
          resolve(true);
        });
      } else resolve(true);
    });
  });

export const getSubscriptions = async () =>
  await new Promise((resolve, reject) => {
    db.find({}, (err, docs) => {
      if (err) reject(err);
      resolve(docs);
    });
  });

export const removeSubscription = async subscription =>
  await new Promise((resolve, reject) => {
    db.remove({ _id: subscription._id }, {}, (err, numRemoved) => {
      if (err) reject(err);
      resolve(numRemoved);
    });
  });
