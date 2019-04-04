import routes from './routes';

const setRouting = app => {
  for (const route of routes) {
    app[route.method](route.url, route.handler);
  }
};

export default setRouting;
