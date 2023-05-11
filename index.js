import express from "express";
import { ApolloServer } from "apollo-server-express";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { createServer } from "http";
import { typeDefs } from "./typeDefs.js";
import resolvers from "./resolvers.js";
import db from "./models/index.js";
import { authenticateUser } from "./middleware/authentication.js";
import DataLoader from "dataloader";

const startServer = async () => {
  const app = express();

  app.use(authenticateUser(db));

  const batchSuggestions = (keys, { Suggestion }) => {};

  const server = new ApolloServer({
    introspection: true,
    typeDefs,
    resolvers,
    context({ req }) {
      return {
        models: db,
        user: req.user,
        suggestionLoader: new DataLoader((keys) =>
          batchSuggestions(keys, models)
        ),
      };
    },
  });

  await server.start();

  server.applyMiddleware({
    app, // Pass the Express app object to applyMiddleware
  });

  const httpServer = createServer(app);

  const subscriptionServer = SubscriptionServer.create(
    {
      execute,
      subscribe,
      schema: server.schema,
    },
    {
      server: httpServer,
      path: server.graphqlPath,
    }
  );

  httpServer.listen(4000, () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:4000${server.graphqlPath}`
    );
  });
};

startServer().catch((err) => {
  console.error("Error starting the server:", err);
});
