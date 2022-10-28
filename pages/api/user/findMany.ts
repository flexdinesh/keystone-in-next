import type { NextApiRequest, NextApiResponse } from "next";
import { keystoneContext } from "../../../lib/keystone-context";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { orderBy, query, skip, take, where } = req.body;
  const result = await keystoneContext.query.User.findMany({
    orderBy,
    skip,
    take,
    where,
    query,
  });
  res.status(200).json(result);
}
