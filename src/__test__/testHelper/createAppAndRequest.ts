import express from 'express';
import request from 'supertest';

function createAppAndRequest() {
  const app = express();
  const router = express.Router();

  app.use(router);
  app.use(express.json());
  const agent = request.agent(app);

  return { agent, app, router };
}

export default createAppAndRequest;
