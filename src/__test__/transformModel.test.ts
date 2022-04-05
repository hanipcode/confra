import { transformModel } from '../index';
import { Schema, model, Model } from 'mongoose';

describe('transformModel', () => {
  it('transform model correctly', () => {
    const sampleResource = {
      user: {
        model: {
          name: {
            type: String,
            isRequired: true,
          },
          // object based typing
          email: {
            type: String,
            isRequired: true,
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
    };

    const transformed = transformModel(sampleResource);
    expect(transformed['user'].prototype).toBeInstanceOf(Model);
    expect(transformed['post'].prototype).toBeInstanceOf(Model);
    expect(
      new transformed['post']({
        title: 'test',
        description: 'test',
      }).toObject()
    ).toEqual({
      _id: expect.anything(),
      title: 'test',
      description: 'test',
    });
  });
});
