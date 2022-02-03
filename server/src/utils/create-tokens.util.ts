// import jwt from 'jsonwebtoken';
// import { User } from '../entity/User';

// export const createAccessToken = (user: User) => {
//   return jwt.sign(
//     { email: user.email },
//     process.env.ACCESS_TOKEN_SECRET as string,
//     { expiresIn: '30m' }
//   )
// };

// export const createRefreshToken = (user: User) => {
//   const { email, tokenVersion, id } = user;
//   return jwt.sign(
//     { email, tokenVersion, id },
//     process.env.REFRESH_TOKEN_SECRET as string,
//     { expiresIn: '7d' }
//   );
// };