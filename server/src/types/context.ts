import { Request, Response } from 'express';
import { User } from '../entity/User';

export interface requestContext {
  req: Request,
  res: Response,
  payload?: User
};
