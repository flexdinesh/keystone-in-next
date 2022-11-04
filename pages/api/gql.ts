import type { NextApiRequest, NextApiResponse } from "next";
import { keystoneContext } from "../../lib/keystone-context";

// Use Keystone API to create a lightweight REST handler that takes GraphQL-style requests from clients
// and responds with GraphQL-style response
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, variables } = req.body;
  const result = await keystoneContext.graphql.raw({ query, variables });
  res.status(200).json(result);
}
