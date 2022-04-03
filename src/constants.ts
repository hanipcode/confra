import { Config } from './interfaces/interface';

export const RESOURCE_ROUTES = ['get', 'post', 'put', 'delete'] as const;
export const ACCEPTED_TYPES = [String, Number, Boolean] as const;

export const sampleConfig: Config = {
  resource: {
    user: {
      model: {
        name: {
          type: String,
          required: true,
        },
        // object based typing
        email: {
          type: String,
          required: true,
        },
        // allow direct typing
        password: String,
      },
    },
  },
};
