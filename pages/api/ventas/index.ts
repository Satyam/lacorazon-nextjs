import type { NextApiRequest, NextApiResponse } from 'next';
import { list } from 'data/ventas';
import type { Venta } from 'data/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Venta[]>
) {
  const { idVendedor } = req.query as {
    idVendedor?: ID;
  };
  const data = await list(idVendedor);
  res.json(data);
}
