import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { Server } from 'http';

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

let serverCleanup: ReturnType<typeof useServer>;

export async function createApolloServer(httpServer: Server, wsServer: WebSocketServer) {
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  serverCleanup = useServer(
    {
      schema,
      context: async (ctx) => {
        return ctx;
      },
    },
    wsServer
  );

  return server;
}

export function getApolloMiddleware(apolloServer: ApolloServer) {
  return expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      return { req };
    },
  });
}

