import type { NextApiRequest, NextApiResponse } from 'next';
import { list } from 'data/user';
import type { User } from 'data/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User[]>
) {
  const data = await list();
  res.json(data);
}
