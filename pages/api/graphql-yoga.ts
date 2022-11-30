import { createYoga } from "graphql-yoga";
import type { NextApiRequest, NextApiResponse } from "next";
import { keystoneContext } from "../../lib/keystone-context";

export const config = {
  api: {
    // Disable body parsing (required for file uploads)
    bodyParser: false,
  },
};

// Use Keystone API to create GraphQL handler
export default createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  graphqlEndpoint: "/api/graphql-yoga",
  schema: keystoneContext.graphql.schema,
  context: ({ req, res }) => keystoneContext.withRequest(req, res),
});
