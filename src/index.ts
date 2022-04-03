import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import { RESOURCE_ROUTES } from './constants';
import { Config, ResourceController } from './interfaces/interface';
import initDB from './util/initDb';

initDB();

const app = express();

const DefaultControllers: ResourceController = {
  get: (req: Request, res: Response, next: NextFunction) => {
    res.json({
      success: true,
    });
  },
  post: (req: Request, res: Response, next: NextFunction) => {
    res.json({
      success: true,
    });
  },
  put: (req: Request, res: Response, next: NextFunction) => {
    res.json({
      success: true,
    });
  },
  delete: (req: Request, res: Response, next: NextFunction) => {
    res.json({
      success: true,
    });
  },
};

// transform each resource into controller
function transformResourceToResourceControllers(resource: Config['resource']) {
  const resourceKeys = Object.keys(resource);
  const resourceControllers: Record<string, ResourceController> =
    resourceKeys.reduce((prev, resourceKey) => {
      const resourceController: ResourceController = RESOURCE_ROUTES.reduce(
        (prevController, currentRoute) => {
          prevController[currentRoute] = DefaultControllers[currentRoute];
          return prevController;
        },
        {} as ResourceController
      );
      prev[resourceKey] = resourceController;
      return prev;
    }, {} as Record<string, ResourceController>);
  return resourceControllers;
}

export function createRoutesFromResourceController(
  resource: Config['resource']
) {
  const resourceControllers = transformResourceToResourceControllers(resource);
  const resourceKeys = Object.keys(resource);

  const router = express.Router();

  resourceKeys.forEach((key) => {
    RESOURCE_ROUTES.forEach((routeKey) => {
      router[routeKey](`/${key}`, resourceControllers[key][routeKey]);
    });
  });

  return router;
}
