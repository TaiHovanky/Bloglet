// import jwt from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';

/**
 * Middleware function that checks if user is authenticated. Get access token from auth headers, then verify token
 * @param param0 context containing the req and the payload
 * @param next 
 */
export const isAuthenticated: MiddlewareFn = async ({ context }: any, next: any) => {
  const { user } = context.req.session;

  if (!user) {
    console.log('Auth validation error: no user found');
  } else {
    context.req.user = user;
  }

  return next();
}