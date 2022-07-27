import webpush from 'web-push';
import { saveSubscription, getSubscriptions, removeSubscription } from '../db';

webpush.setVapidDetails(process.env.MAILTO, process.env.PUBLIC_KEY, process.env.PRIVATE_KEY);

const routes = [
  {
    method: 'post',
    url: '/register',
    handler: async (req, res) => {
      console.log("req", req);
      const subscription = req.body;
      const saved = await saveSubscription(subscription);
      console.log("register", subscription);
      if (saved) res.status(200).json({ msg: 'Subscription saved!' });
      else res.status(500).json({ err: 'Could not save subscription!' });
    }
  },
  {
    method: 'post',
    url: '/send',
    handler: async (req, res) => {
      const { title, url, body, targets } = req.body;
      const subscriptions = await getSubscriptions();
      const data = JSON.stringify({
        title,
        payload: { title, body, url, icon: process.env.NOTIFICATION_ICON },
        body: true
      });
      const sentSubscriptions = subscriptions.map(subscription =>{
        console.log(subscription);
        console.log("targets", targets);
        if(typeof targets != "undefined" && Array.isArray(targets)&& targets.length > 0 && !targets.includes(subscription._id)){
          console.log("AÑLSJHFLÑASDJKFL"); 
          return false;
        }
        webpush
          .sendNotification(subscription, data)
          .then()
          .catch(err => {
            if (err.statusCode === 410) removeSubscription(subscription);
          })});
     
      await Promise.all(sentSubscriptions).then(() => {
        res.status(200).json({ msg: 'Notifications sent!' });
      });
    }
  }
];

export default routes;
