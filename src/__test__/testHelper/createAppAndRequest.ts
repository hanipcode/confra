import express from 'express';
import request from 'supertest';

function createAppAndRequest() {
  const app = express();
  const router = express.Router();

  app.use(router);
  const agent = request(app);

  return { agent, app, router };
}

export default createAppAndRequest;
