import bcrypt from 'bcrypt';
import { Config, ConfigParam } from './interfaces/interface';
export const RESOURCE_ROUTES = ['get', 'post', 'put', 'delete'] as const;
export const ACCEPTED_TYPES = [String, Number, Boolean] as const;

const SALT = 10;

function hashPassword(value: any) {
  return bcrypt.hashSync(value, SALT);
}

export const sampleConfig: ConfigParam = {
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
          unique: true,
          isRequired: true,
        },
        // allow direct typing
        password: {
          type: String,
          isSelected: true,
          set: hashPassword,
          isRequired: true,
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
