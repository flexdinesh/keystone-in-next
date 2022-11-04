import type { NextApiRequest, NextApiResponse } from "next";
import { keystoneContext } from "../../../lib/keystone-context";

// Use Keystone API to send REST response
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, where } = req.body;
  const result = await keystoneContext.query.User.findOne({
    where,
    query,
  });
  res.status(200).json(result);
}
