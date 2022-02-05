import { Response, Request } from 'express';
import { Session, SessionData } from 'express-session';
import { User } from '../entity/User';

export interface requestContext {
  req: Request & { session: Session & Partial<SessionData> & { user?: User } }
  res: Response,
  payload?: User
};
