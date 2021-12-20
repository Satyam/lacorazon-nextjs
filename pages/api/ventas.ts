import type { NextApiRequest, NextApiResponse } from 'next';
import { list } from 'data/ventas';
import type { Venta } from 'data/types';
import { API_REQ, API_REPLY, OP, ERR_CODE, FetchError } from 'lib/fetch';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<API_REPLY<Partial<Venta> | Venta[]>>
) {
  const { op, id, data: venta, options } = req.body as API_REQ<Partial<Venta>>;
  const idVendedor = options?.idVendedor as ID;
  const badRequest = (msg: string) => ({
    error: new FetchError(
      ERR_CODE.BAD_REQUEST,
      `${msg} in ${JSON.stringify(req.body)}`,
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
