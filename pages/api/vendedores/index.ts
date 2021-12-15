import type { NextApiRequest, NextApiResponse } from 'next';
import { list, get, create, update, del } from 'data/vendedores';
import type { Vendedor } from 'data/types';
import { API_REQ, API_REPLY, OP, ERR_CODE } from 'lib/fetch';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<API_REPLY<Partial<Vendedor> | Vendedor[]>>
) {
  const { op, id, data: vendedor } = req.body as API_REQ<Partial<Vendedor>>;
  switch (op) {
    case OP.LIST:
      return res.json({ data: await list() });
    case OP.GET: {
      if (id) {
        const data = await get(id);
        if (data) {
          return res.json({ data });
        }
        return res.json({ error: ERR_CODE.NOT_FOUND });
      }
      return res.json({ error: ERR_CODE.BAD_REQUEST });
    }
    case OP.CREATE: {
      if (vendedor) {
        const data = await create(vendedor);
        if (data) {
          return res.json({ data });
        }
        return res.json({ error: ERR_CODE.DUPLICATE });
      }
      return res.json({ error: ERR_CODE.BAD_REQUEST });
    }
    case OP.UPDATE: {
      if (id) {
        if (vendedor) {
          const data = await update(id, vendedor).catch((error) => {
            if (error.errno === 19) {
              return res.json({ error: ERR_CODE.DUPLICATE });
            }
            throw error;
          });
          if (data) {
            return res.json({ data });
          }
        }
      }
      return res.json({ error: ERR_CODE.NOT_FOUND });
    }
    case OP.DELETE: {
      if (id) {
        const data = await del(id);
        if (data) {
          return res.json({ data });
        }
        return res.json({ error: ERR_CODE.NOT_FOUND });
      }
      return res.json({ error: ERR_CODE.BAD_REQUEST });
    }
  }
}
