import type { NextApiRequest, NextApiResponse } from 'next';
import { list } from 'data/ventas';
import type { Venta } from 'data/types';
import { API_REQ, API_REPLY, OP } from 'lib/fetch';
import { ERR_CODE, FetchError } from 'lib/errors';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<API_REPLY<Partial<Venta> | Venta[]>>
) {
  const { op, options } = req.body as API_REQ<Partial<Venta>>;
  const idVendedor = options?.idVendedor as ID;
  const badRequest = (msg: string) => ({
    error: new FetchError(
      `${msg} in ${JSON.stringify(req.body)}`,
      ERR_CODE.BAD_REQUEST,
      req.url
    ),
  });

  switch (op) {
    case OP.LIST:
      return res.json({ data: await list(idVendedor) });
    default:
      return res.json(badRequest('unknown op'));
  }
}
