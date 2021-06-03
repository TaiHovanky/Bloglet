import jwt from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';

/**
 * Middleware function that checks if user is authenticated. Get access token from auth headers, then verify token
 * @param param0 context containing the req and the payload
 * @param next 
 */
export const isAuthenticated: MiddlewareFn = async ({ context }: any, next: any) => {
  const authorization: string | undefined = context.req.headers['authorization'];

  if (!authorization) {
    throw new Error('Not authenticated');
  }

  try {
    const accessToken: string = authorization.split(' ')[1];
    const payload: any = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string);
    // need to cast process.env.ACCESS_TOKEN_SECRET as a string or else string | undefined type error
    context.payload = payload;
  } catch(err) {
    console.log(err);
  }

  return next();
}