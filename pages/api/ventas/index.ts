import type { NextApiRequest, NextApiResponse } from 'next';
import { list } from 'data/ventas';
import type { Venta, Rango } from 'data/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Venta[]>
) {
  const { offset, limit, last, idVendedor } = req.query as Rango & {
    idVendedor?: ID;
  };
  const data = await list(
    {
      offset: offset ? Number(offset) : undefined,
      limit: limit ? Number(limit) : undefined,
      last: last ? Number(last) : undefined,
    },
    idVendedor
  );
  res.json(data);
}
