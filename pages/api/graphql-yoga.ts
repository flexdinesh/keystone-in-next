import { createServer } from "@graphql-yoga/node";
import type { NextApiRequest, NextApiResponse } from "next";
import { keystoneContext } from "../../lib/keystone-context";

export const config = {
  api: {
    // Disable body parsing (required for file uploads)
    bodyParser: false,
  },
};

// Use Keystone API to create GraphQL handler
export default createServer<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  schema: keystoneContext.graphql.schema,
  context: keystoneContext
  // endpoint: "/api/graphql-yoga",
});
