import type { NextApiRequest, NextApiResponse } from 'next';
import { list } from 'data/vendedores';
import type { Vendedor } from 'data/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Vendedor[]>
) {
  const data = await list();
  res.json(data);
}
