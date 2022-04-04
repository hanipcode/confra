import { RequestHandler } from 'express';
import { ACCEPTED_TYPES } from '../constants';

export interface ResourceController {
  get: RequestHandler;
  post: RequestHandler;
  put: RequestHandler;
  delete: RequestHandler;
}
type AcceptedTypesType = typeof ACCEPTED_TYPES[number];

export interface TemplateObject<AcceptedTypeGeneric = any> {
  type?: AcceptedTypeGeneric;
  isRequired?: boolean;
  isUnique?: boolean;
  isSelected?: boolean;
  [key: string]: any;
}

export type Template = TemplateObject | AcceptedTypesType;

export interface Config {
  resource: {
    [key: string]: {
      model: Record<string, Template>;
    };
  };
}
