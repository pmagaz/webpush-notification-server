import path from 'path';
import express from 'express';

const statics = [{ route: '/', dir: path.join(__dirname, '../../public') }];

const setStatics = app => {
  for (const staticPath of statics) {
    app.use(staticPath.route, express.static(staticPath.dir, staticPath.cache));
  }
};

export default setStatics;
