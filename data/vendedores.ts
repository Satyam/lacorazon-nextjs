import { Vendedor } from './types';
import {
  getById,
  createWithCuid,
  updateById,
  deleteById,
  getDb,
} from './utils';

const TABLE = 'Vendedores';

export async function list() {
  const db = await getDb();
  return db.all(`select * from ${TABLE}`);
}

export function del(id: ID) {
  return deleteById<Vendedor>(TABLE, id);
}

export function get(id: ID) {
  return getById<Vendedor>(TABLE, id);
}

export function create(vendedor: Vendedor) {
  return createWithCuid<Vendedor>(TABLE, vendedor);
}

export function update(vendedor: Vendedor) {
  return updateById<Vendedor>(TABLE, vendedor);
}
