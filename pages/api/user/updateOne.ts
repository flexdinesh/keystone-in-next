import type { NextApiRequest, NextApiResponse } from "next";
import { keystoneContext } from "../../../lib/keystone-context";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { where, data, query } = req.body;
  const result = await keystoneContext.query.User.updateOne({
    where,
    data,
    query,
  });
  res.status(200).json(result);
}
