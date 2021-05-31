import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import {createConnection} from 'typeorm';
// import cookieParser from 'cookie-parser';
import jwt, { verify } from 'jsonwebtoken';
import { UserResolver } from './src/graphql/UserResolver';
import { User } from './src/entity/User';
import cookieParser from 'cookie-parser';

(async () => {
  const app = express();
  app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
  }));
  app.use(cookieParser());

  await createConnection()
    .catch(error => console.log(error));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver]
    }),
    context: ({ req, res }) => ({ req, res })
    // needed or else Ctx doesn't pass into mutations/queries
  });

  apolloServer.applyMiddleware({ app, cors: false }); // need this to avoid cors error

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

    return res.send({ ok: true, accessToken: await jwt.sign(
      { email: user.email },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '30m' }
    )});
  });

  app.listen(3001, () => {
    console.log('app listening at 3001');
  });
})()