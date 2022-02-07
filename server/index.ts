import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
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
  console.log('process variables', process.env.SESSION_SECRET, 'url:', process.env.REDIS_URL,
    'port:', process.env.REDIS_PORT);
  let RedisStore = require('connect-redis')(session)
  let redisClient = new Redis({
    host: 'redis',
    port: 6379
  });

  const app = express();
  app.use(cors({
    /* Use IP address of droplet with the exposed port that React app container runs on.
    Note that port isn't needed because Web container exposes port 80 */
    origin: 'http://159.223.122.194',
    credentials: true
  }));
  app.use(cookieParser());

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      saveUninitialized: false,
      secret: 'keyboardneko',
      resave: false,
      cookie: {
        secure: false,
        sameSite: 'lax',
        httpOnly: true,
        maxAge: 120000
      }
    })
  );

  console.log('process variables2', process.env.SESSION_SECRET, 'url:', process.env.REDIS_URL,
    'port:', process.env.REDIS_PORT);
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

  app.get('/', (_req, res) => res.send('hello'));

  apolloServer.applyMiddleware({ app, cors: false }); // need "cors: false" to avoid cors error

  app.listen(3001, () => {
    console.log('app listening at 3001');
  });
})()