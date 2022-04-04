import {
  createRoutesFromResourceController,
  transformResourceToResourceControllers,
  transformModel,
} from '..';
import { RESOURCE_ROUTES, sampleConfig, sampleData } from '../constants';
import createAppAndRequest from './testHelper/createAppAndRequest';
import dropMongoDatabase from './testHelper/dropMongoDatabse';

describe('createRoutesFromResourceController', () => {
  describe('successfully create default controller', () => {
    const { app, agent } = createAppAndRequest();
    const models = transformModel(sampleConfig.resource);
    const resourceControllers = transformResourceToResourceControllers(
      sampleConfig.resource,
      models
    );
    const router = createRoutesFromResourceController(
      sampleConfig.resource,
      resourceControllers
    );
    app.use(router);
    describe.each(Object.keys(sampleConfig.resource))(
      'successfully create resource %s',
      (resourceName) => {
        beforeEach(async () => {
          await dropMongoDatabase();
        });
        it('get route is working', async () => {
          const response = await agent.get(`/${resourceName}`);
          const json = JSON.parse(response.text);
          expect(response.status).toEqual(200);
          expect(json.data).toEqual([]);
        });

        it('post route is working', async () => {
          const data = sampleData[resourceName];
          const jestSpy = jest.spyOn(models[resourceName], 'create');
          const response = await agent.post(`/${resourceName}`).send(data);
          const json = JSON.parse(response.text);
          expect(response.status).toEqual(200);
          expect(jestSpy).toBeCalledWith(data);
          expect(json).toEqual(
            expect.objectContaining({
              data: expect.objectContaining(data),
            })
          );
        });

        it('put route is working', async () => {
          // saving data
          const currentModel = await models[resourceName].create(
            sampleData[resourceName]
          );
          const firstDataKey = Object.keys(sampleData[resourceName])[0];
          const changedData = {
            [firstDataKey]: 'This Property is changed',
          };
          const jestSpy = jest.spyOn(models[resourceName], 'findByIdAndUpdate');
          const response = await agent
            .put(`/${resourceName}/${currentModel._id}`)
            .send(changedData);
          const json = JSON.parse(response.text);
          expect(response.status).toEqual(200);
          expect(jestSpy).toBeCalledWith(
            currentModel.id,
            changedData,
            expect.anything()
          );
          expect(json).toEqual(
            expect.objectContaining({
              data: expect.objectContaining(changedData),
            })
          );
        });

        it('delete route is working', async () => {
          // saving data
          const currentModel = await models[resourceName].create(
            sampleData[resourceName]
          );
          const jestSpy = jest.spyOn(models[resourceName], 'findByIdAndDelete');
          const response = await agent.delete(
            `/${resourceName}/${currentModel.id}`
          );

          expect(response.status).toEqual(200);
          expect(jestSpy).toBeCalledWith(currentModel.id);

          const newData = await models[resourceName].find({});

          expect(newData).toEqual([]);
        });
      }
    );
  });
});
