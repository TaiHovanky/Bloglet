import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import {createConnection} from "typeorm";
import { UserResolver } from "./graphql/UserResolver";

(async () => {
  const app = express();
  app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
  }));

  await createConnection()
    .catch(error => console.log(error));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver]
    }),
    context: ({ req, res }) => ({ req, res })
    // needed or else Ctx doesn't pass into mutations/queries
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.get('/', (_req, res) => res.send('hello'));

  app.listen(3001, () => {
    console.log('app listening at 3001');
  });
})()