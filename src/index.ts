import express, { NextFunction, Request, Response } from 'express';
import { RESOURCE_ROUTES, sampleConfig } from './constants';
import {
  Config,
  ResourceController,
  TemplateObject,
} from './interfaces/interface';
import {
  Model,
  Schema as MongooseSchema,
  SchemaTypeOptions,
  model as createModel,
} from 'mongoose';
import initDB from './util/initDb';
import * as yup from 'yup';
import { ValidationError } from 'yup';

initDB();

/*
 * Phase 6: Request Validation
 */
const isTemplateObject = (
  template: Config['resource'][string]['model'][string]
): template is TemplateObject => {
  return (template as TemplateObject).type;
};
const defaultBodyValidation = {
  post: (body: any, modelData: Config['resource'][string]['model']) => {
    const shape = Object.keys(modelData).reduce((prev, key: string) => {
      const template = modelData[key];
      let keyShape = yup.mixed();
      if (isTemplateObject(template)) {
        const isHavingYupFunction =
          typeof template.type.name === 'string' &&
          (yup as any)[template.type.name.toLowerCase()];
        if (isHavingYupFunction) {
          keyShape = (yup as any)[template.type.name.toLowerCase()]();
        }
        if (template.isRequired) {
          keyShape = keyShape.concat(
            (yup as any)[template.type.name.toLowerCase()]().required()
          );
        }
      }
      prev[key] = keyShape;
      return prev;
    }, {} as Record<string, any>);
    console.log(shape);
    const bodyValidation = yup.object().shape(shape);
    bodyValidation.validateSync(body);
  },
};
/* phase 4 make data retrival and saving data to db */
const generateDefaultControllers = (
  model: Model<any>,
  modelData: Config['resource'][string]['model'],
  bodyValidation = defaultBodyValidation
) => {
  return {
    get: async (req: Request, res: Response, next: NextFunction) => {
      const data = await model.find({});
      res.json({
        data,
        success: true,
      });
    },
    post: async (req: Request, res: Response, next: NextFunction) => {
      const modelDataKeys = Object.keys(modelData);
      try {
        bodyValidation.post(req.body, modelData);
      } catch (err) {
        console.log(err);
        res.status(400).json({
          success: false,
          error: err,
        });
        return;
      }
      const data = modelDataKeys.reduce((prev, key) => {
        prev[key] = req.body[key];
        return prev;
      }, {} as Record<string, any>);

      // const newData = await model.create(data);
      res.json({
        success: true,
        // data: newData,
      });
    },
    put: async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const modelDataKeys = Object.keys(modelData);
      const data = modelDataKeys.reduce((prev, key) => {
        if (req.body[key]) {
          prev[key] = req.body[key];
        }
        return prev;
      }, {} as Record<string, any>);
      const newData = await model.findByIdAndUpdate(id, data, {
        returnDocument: 'after',
      });
      res.json({
        data: newData,
        success: true,
      });
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      await model.findByIdAndDelete(id);
      res.json({
        success: true,
      });
    },
  };
};
/* Phase 1: make sure route for each resource registered */

// transform each resource into controller
export function transformResourceToResourceControllers(
  resource: Config['resource'],
  modelMap: Record<string, Model<any>>
) {
  const resourceControllers: Record<string, ResourceController> =
    resourceReducer(resource, (prev, resourceKey) => {
      const resourceController: ResourceController = generateDefaultControllers(
        modelMap[resourceKey],
        resource[resourceKey].model
      );

      prev[resourceKey] = resourceController;
      return prev;
    });
  return resourceControllers;
}

export function createRoutesFromResourceController(
  resource: Config['resource'],
  resourceControllers: Record<string, ResourceController>
) {
  const resourceKeys = Object.keys(resource);

  const router = express.Router();

  resourceKeys.forEach((key) => {
    RESOURCE_ROUTES.forEach((routeKey) => {
      if (['put', 'delete'].includes(routeKey)) {
        router[routeKey](`/${key}/:id`, resourceControllers[key][routeKey]);
        return;
      }
      router[routeKey](`/${key}`, resourceControllers[key][routeKey]);
    });
  });

  return router;
}

/* transform resource into something else */
const resourceReducer = <T = Record<string, any>>(
  resource: Config['resource'],
  reducer: (currentResult: T, resourceKey: string) => T
) => {
  const resourceKeys = Object.keys(resource);

  return resourceKeys.reduce(reducer, {} as T);
};

/*
 * to make magicia expendable
 * create magicia schema to another db schema helper
 * try to imagine if having different structure
 */
/* transform to mongoose */
type TransformerFn<Type = SchemaTypeOptions<TemplateObject>> = (
  template: TemplateObject
) => Type;
const mongooseTransformer: TransformerFn<SchemaTypeOptions<TemplateObject>> = (
  template: TemplateObject
) => {
  type CurrentDictionary = [keyof TemplateObject, keyof SchemaTypeOptions<{}>];
  const keyDictionary: Array<CurrentDictionary> = [
    ['isRequired', 'required'],
    ['isUnique', 'unique'],
    ['isSelected', 'selected'],
  ];

  keyDictionary.forEach((currentDictionary: CurrentDictionary) => {
    const [toMap, mapped] = currentDictionary;
    if (template[toMap]) {
      template[mapped as string] = template[toMap];
    }
    return template;
  });

  return template;
};

const transformToMongooseModel = (
  resourceName: string,
  model: Config['resource'][string]['model'],
  transformer: TransformerFn = mongooseTransformer
) => {
  const schema = Object.keys(model).reduce((prev, modelKey: string) => {
    prev[modelKey] = transformer(model[modelKey] as TemplateObject);
    return prev;
  }, {} as Record<string, TemplateObject>);

  return createModel(resourceName, new MongooseSchema(schema));
};

export const transformModel = (
  resource: Config['resource'],
  modelTransformer = transformToMongooseModel
) => {
  return resourceReducer(resource, (curentResult, resourceKey) => {
    curentResult[resourceKey] = modelTransformer(
      resourceKey,
      resource[resourceKey].model
    );
    return curentResult;
  });
};

/*
 * Phase 3: connect controller with model
 */
export const createMagiciaApp = (config: Config) => {
  const app = express();
  app.use(express.json());
  const models = transformModel(config.resource);
  const resourceControllers = transformResourceToResourceControllers(
    config.resource,
    models
  );
  const router = createRoutesFromResourceController(
    config.resource,
    resourceControllers
  );

  app.use(router);

  return app;
};
