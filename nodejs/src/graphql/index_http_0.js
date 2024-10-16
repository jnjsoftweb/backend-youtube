import { ApolloServer, gql } from 'apollo-server-express';
import { typeDefs } from './typeDefs.js';
import { resolvers } from './resolvers.js';

const GRAPHQL_PORT = 3007;
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: GRAPHQL_PORT, ip: '0.0.0.0' },
});

console.log(`🚀  Server ready at: ${url}`);

// import { ApolloServer } from '@apollo/server';
// import { expressMiddleware } from '@apollo/server/express4';
// import express from 'express';
// import cors from 'cors';
// import { typeDefs } from './typeDefs.js';
// import { resolvers } from './resolvers.js';
// import path from 'path';
// import dotenv from 'dotenv';

// // .env 파일 로드
// dotenv.config({
//   path: path.resolve(new URL('.', import.meta.url).pathname, '../../../.env'),
// });

// const app = express();

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// await server.start();

// app.use(
//   '/graphql',
//   cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
//   }),
//   express.json(),
//   expressMiddleware(server, {
//     context: async ({ req }) => ({ token: req.headers.token }),
//   })
// );

// const PORT = process.env.NEXT_PUBLIC_GRAPHQL_PORT || 3007;

// app.listen(PORT, () => {
//   console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
// });
