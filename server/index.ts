import 'dotenv/config';
import 'reflect-metadata';
import path from 'path';
import express from 'express';
import cors from 'cors';
// @ts-ignore
import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { UserResolver } from './src/graphql/user.resolver';
import { PostResolver } from './src/graphql/post.resolver';
import { FollowerResolver } from './src/graphql/follow.resolver';
import { CommentResolver } from './src/graphql/comment.resolver';
const Redis = require("ioredis");
const session = require('express-session');

(async () => {
  console.log('process.env.REDIS_HOST', process.env.REDIS_HOST, process.env.REDIS_PORT, process.env.REDIS_PW)
  let RedisStore = require('connect-redis')(session)
  let redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PW
  });



  const app = express();
  app.use(cors({
    /* Use IP address of droplet with the exposed port that React app container runs on.
    Note that port isn't needed because Web container exposes port 80 */
    origin: process.env.APP_URL,
    credentials: true
  }));
  app.use(cookieParser() as any);

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
      cookie: {
        secure: false,
        sameSite: 'lax',
        httpOnly: true,
        maxAge: 600000
      }
    })
  );

  /* Retry connecting to postgres database because it might take a while
  for the database to spin up and be connectable */
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

  app.get('/', (_req, res) => {
    res.sendFile(
      path.join(__dirname, '../client/build/index.html'),
      function(err) {
        if (err) {
          res.status(500).send(err);
        }
      }
    );
  });

  apolloServer.applyMiddleware({ app, cors: false }); // need "cors: false" to avoid cors error

  app.listen(process.env.PORT || 3001, () => {
    console.log('app listening at', process.env.PORT);
  });
})()