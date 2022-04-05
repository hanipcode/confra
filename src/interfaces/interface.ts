import { RequestHandler, ErrorRequestHandler } from 'express';
import { ACCEPTED_TYPES } from '../constants';
import { SchemaTypeOptions, Model } from 'mongoose';
import { WordingsParam } from '../defaults/defaultWording';

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
export type TransformerFn<Type = SchemaTypeOptions<TemplateObject>> = (
  template: TemplateObject
) => Type;
export type ModelTransformerFN = (
  resourceName: string,
  model: Config['resource'][string]['model'],
  transformer?: TransformerFn
) => Model<any, {}, {}, {}>;

export interface BaseConfig {
  errorHandlers: ErrorRequestHandler[];
  modelTransformer: ModelTransformerFN;
}

export interface ConfigResource {
  [key: string]: {
    model: Record<string, Template>;
  };
}

export interface ConfigParam {
  resource: ConfigResource;
  baseConfig?: BaseConfig;
  wordings?: WordingsParam;
}

export type Config = Required<ConfigParam>;
