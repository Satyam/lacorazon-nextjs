import type { NextApiRequest, NextApiResponse } from 'next';
import { list, get, create, update, del } from 'data/user';
import type { User } from 'data/types';
import { API_REQ, API_REPLY, OP } from 'lib/fetch';
import { ERR_CODE, FetchError } from 'lib/errors';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<API_REPLY<Partial<User> | User[]>>
) {
  const { op, id, data: user } = req.body as API_REQ<Partial<User>>;
  const badRequest = (msg: string) => ({
    error: new FetchError(
      `${msg} in ${JSON.stringify(req.body)}`,
      ERR_CODE.BAD_REQUEST,
      req.url
    ),
  });
  switch (op) {
    case OP.LIST:
      return res.json({ data: await list() });

    case OP.GET: {
      if (id) {
        const data = await get(id);
        if (data) {
          return res.json({ data });
        }
        return res.json({
          error: new FetchError('No existe', ERR_CODE.NOT_FOUND, req.url),
        });
      }
      return res.json(badRequest('Missing [id]'));
    }
    case OP.CREATE: {
      if (user) {
        return res.json(
          await create(user)
            .then((data) => ({ data }))
            .catch((error) => ({ error }))
        );
      }
      return res.json(badRequest('Missing [data]'));
    }
    case OP.UPDATE: {
      if (id) {
        if (user) {
          return res.json(
            await update(id, user)
              .then((data) => ({ data }))
              .catch((error) => ({ error }))
          );
        }
        return res.json(badRequest('Missing [data]'));
      }
      return res.json(badRequest('Missing [id]'));
    }
    case OP.DELETE: {
      if (id) {
        return res.json(
          await del(id)
            .then((data) => ({ data }))
            .catch((error) => ({ error }))
        );
      }
      return res.json(badRequest('Missing [id]'));
    }
    default:
      return res.json(badRequest('unknown op'));
  }
}
