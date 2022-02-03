import { Response } from 'express';
import { User } from '../entity/User';

export interface requestContext {
  req: any, // was originally
  res: Response,
  payload?: User
};
