// export interface LoginResponse {
//   token: string
// }
import { Request, Response } from 'express';

export interface RequestContext {
  req: Request,
  res: Response,
  payload?: { userId: string }
}