import type { NextApiRequest, NextApiResponse } from 'next';
import { list } from 'data/user';
import type { User } from 'data/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User[]>
) {
  const { offset, limit, last } = req.query;
  const data = await list({
    offset: offset ? Number(offset) : undefined,
    limit: limit ? Number(limit) : undefined,
    last: last ? Number(last) : undefined,
  });
  res.json(data);
}
