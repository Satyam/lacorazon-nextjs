import type { NextApiRequest, NextApiResponse } from 'next';
import type { Vendedor } from 'data/types';

import { del, get, update, create } from 'data/vendedores';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Vendedor | undefined>
) {
  const { id } = req.query;

  const standardReply = (reply: Vendedor | undefined) => {
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
      const vendedor = JSON.parse(req.body) as Vendedor;
      await (id === '0' ? create(vendedor) : update(vendedor))
        .then(standardReply)
        .catch((error) => {
          if (error.errno === 19) {
            res.status(409).end('Duplicate vendedor name');
          }
        });
    }
  }
}
