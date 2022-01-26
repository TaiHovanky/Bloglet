import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { verify } from 'jsonwebtoken';
import { User } from './src/entity/User';
import { UserResolver } from './src/graphql/user.resolver';
import { PostResolver } from './src/graphql/post.resolver';
import { FollowerResolver } from './src/graphql/follow.resolver';
import { CommentResolver } from './src/graphql/comment.resolver';
import { sendRefreshToken } from './src/utils/send-refresh-token.util';
import { createAccessToken, createRefreshToken } from './src/utils/create-tokens.util';

(async () => {
  const app = express();
  app.use(cors({
    origin: 'http://159.223.122.194',
    credentials: true
  }));
  app.use(cookieParser());

  let retries = 5;
  while (retries) {
    try {
      await createConnection();
      console.log('connected to db');
      break;
    } catch (err) {
      console.log(err);
      retries -= 1;
      await new Promise(res => setTimeout(res, 5000));
    }
  }

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver, FollowerResolver, CommentResolver]
    }),
    context: ({ req, res }) => ({ req, res })
    // needed or else Ctx doesn't pass into mutations/queries
  });

  app.get('/', (_req, res) => res.send('hello'));

  /* Need a refresh token route to handle refresh token request */
  app.post('/refresh_token', async (req, res) => {
    const token = req.cookies.jid;

    if (!token) {
      return res.send({ ok: false, accessToken: '' });
    }

    let payload: any = null;

    try {
      // Verify refresh token from the cookie
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET as string);
    } catch(err) {
      console.log(err);
      return res.send({ ok: false, accessToken: '' });
    }

    // If the refresh token is valid, send back an access token
    const user = await User.findOne({ id: payload.id });

    if (!user) {
      return res.send({ ok: false, accessToken: '' });
    }

    // if (user.tokenVersion !== payload.tokenVersion) {
    //   return res.send({ ok: false, accessToken: '' });
    // }

    // If refresh token and access token are expired, send both back
    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  apolloServer.applyMiddleware({ app, cors: false }); // need "cors: false" to avoid cors error

  app.listen(3001, () => {
    console.log('app listening at 3001');
  });
})()