import type { NextApiRequest, NextApiResponse } from 'next';
import type { User } from 'data/types';

import { del, get } from 'data/user';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | undefined>
) {
  const { id } = req.query;
  let reply: User | undefined;

  switch (req.method) {
    case 'DELETE':
      reply = await del(id as ID);
      break;
    case 'GET':
      reply = await get(id as ID);
      break;
  }
  res.json(reply);
}
