import { Schema } from 'mongoose';

export const withVirtualId = (schema: Schema) => {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
    // eslint-disable-next-line no-underscore-dangle
      ret.id = ret._id;
      // eslint-disable-next-line no-underscore-dangle
      delete ret._id;
    },
  });
  schema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
      // eslint-disable-next-line no-underscore-dangle
      ret.id = ret._id;
      // eslint-disable-next-line no-underscore-dangle
      delete ret._id;
    },
  });
};

