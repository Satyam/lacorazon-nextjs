import type { NextApiRequest, NextApiResponse } from 'next';
import type { User } from 'data/types';

import { del, get, update, create } from 'data/user';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | undefined>
) {
  const { id } = req.query;

  const standardReply = (reply: User | undefined) => {
    if (reply) {
      res.json(reply);
    } else {
      res.status(404).end('not found');
    }
  };

  switch (req.method) {
    case 'DELETE':
      standardReply(await del(id as ID));
      break;
    case 'GET':
      standardReply(await get(id as ID));
      break;
    case 'PUT': {
      const user = JSON.parse(req.body) as User;
      await (id === '0' ? create(user) : update(user))
        .then(standardReply)
        .catch((error) => {
          if (error.errno === 19) {
            res.status(409).end('Duplicate user name');
          }
        });
    }
  }
}
