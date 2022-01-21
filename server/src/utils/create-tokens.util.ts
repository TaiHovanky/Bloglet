import jwt from 'jsonwebtoken';
import { User } from '../entity/User';

export const createAccessToken = (user: User) => {
  console.log('createAccessToken', process.env.ACCESS_TOKEN_SECRET);
  return jwt.sign(
    { email: user.email },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: '30m' }
  )
};

export const createRefreshToken = (user: User) => {
  const { email, tokenVersion, id } = user;
  console.log('createRefreshToken', process.env.REFRESH_TOKEN_SECRET);
  return jwt.sign(
    { email, tokenVersion, id },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: '7d' }
  );
};