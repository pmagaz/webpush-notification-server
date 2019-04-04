import express from 'express';
import bodyParser from 'body-parser';

import setRouting from './routing';
import setStatics from './statics';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

setRouting(app);
setStatics(app);

app.listen(process.env.EXPRESS_PORT, () => {
  console.log(`Webpush notification server up in ${ process.env.EXPRESS_PORT }`);
});
