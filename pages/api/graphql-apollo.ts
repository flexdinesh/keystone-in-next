import type { NextApiRequest, NextApiResponse } from "next";
import { ApolloServer } from "apollo-server-micro";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";
import { keystoneContext } from "../../lib/keystone-context";

const apolloServer = new ApolloServer({
  schema: keystoneContext.graphql.schema,
  context: ({ req, res }) => keystoneContext.withRequest(req, res),
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
});

const startServer = apolloServer.start();

// Use Keystone API to create GraphQL handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql-apollo",
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
