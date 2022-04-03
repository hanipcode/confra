import { createRoutesFromResourceController } from '..';
import { RESOURCE_ROUTES, sampleConfig } from '../constants';
import createAppAndRequest from './testHelper/createAppAndRequest';

describe('createRoutesFromResourceController', () => {
  describe('successfully create default controller', () => {
    const { app, agent } = createAppAndRequest();

    const router = createRoutesFromResourceController(sampleConfig.resource);

    app.use(router);
    describe.each(Object.keys(sampleConfig.resource))(
      'successfully create resource %s',
      (resourceName) => {
        it.each(RESOURCE_ROUTES)(
          'create route %s successfully',
          async (routeKey) => {
            const response = await agent[routeKey](`/${resourceName}`);
            expect(response.status).toEqual(200);
          }
        );
      }
    );
  });
});
