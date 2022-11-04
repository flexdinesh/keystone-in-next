import type { NextApiRequest, NextApiResponse } from "next";
import { keystoneContext } from "../../../lib/keystone-context";

// Use Keystone API to send REST response
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { data, query } = req.body;
  const result = await keystoneContext.query.User.createOne({
    data,
    query,
  });
  res.status(200).json(result);
}
