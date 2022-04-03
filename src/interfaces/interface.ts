import { RequestHandler } from 'express';
import { ACCEPTED_TYPES } from '../constants';

export interface ResourceController {
  get: RequestHandler;
  post: RequestHandler;
  put: RequestHandler;
  delete: RequestHandler;
}
type AcceptedTypesType = typeof ACCEPTED_TYPES[number];

interface TemplateObject {
  type: AcceptedTypesType;
  required?: boolean;
  unique?: boolean;
}

type Template = TemplateObject | AcceptedTypesType;

export interface Config {
  resource: {
    [key: string]: {
      model: {
        [key: string]: Template;
      };
    };
  };
}
