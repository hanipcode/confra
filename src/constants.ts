import { Config, ResourceController } from './interfaces/interface';
import { NextFunction, Request, RequestHandler, Response } from 'express';
export const RESOURCE_ROUTES = ['get', 'post', 'put', 'delete'] as const;
export const ACCEPTED_TYPES = [String, Number, Boolean] as const;

export const sampleConfig: Config = {
  resource: {
    user: {
      model: {
        name: {
          type: String,
          isRequired: true,
        },
        // object based typing
        email: {
          type: String,
          isRequired: false,
        },
        // allow direct typing
        password: {
          type: String,
          isSelected: true,
        },
      },
    },
    post: {
      model: {
        title: {
          type: String,
          isRequired: true,
          isUnique: true,
        },
        description: {
          type: String,
        },
      },
    },
  },
};

export const sampleData: Record<string, any> = {
  user: {
    name: 'bambang',
    email: 'bambang@mail.com',
    password: '12o31231o',
  },
  post: {
    title: 'cara bagaimana untuk bagaimana',
    description: 'cara membuat description',
  },
};
