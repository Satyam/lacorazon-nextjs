import type { NextApiRequest, NextApiResponse } from 'next';
import { list } from 'data/ventas';
import type { Venta } from 'data/types';
import { API_REQ, API_REPLY, OP, ERR_CODE } from 'lib/fetch';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<API_REPLY<Partial<Venta> | Venta[]>>
) {
  const { op, id, data: venta, options } = req.body as API_REQ<Partial<Venta>>;
  const idVendedor = options?.idVendedor as ID;

  switch (op) {
    case OP.LIST:
      return res.json({ data: await list(idVendedor) });
    default:
      return res.json({ error: ERR_CODE.BAD_REQUEST });
  }
}
