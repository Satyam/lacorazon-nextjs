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
  return db.all<Vendedor[]>(`select * from ${TABLE}`);
}

export function del(id: ID) {
  return deleteById<Vendedor>(TABLE, id);
}

export function get(id: ID) {
  return getById<Vendedor>(TABLE, id);
}

export function create(vendedor: Partial<Vendedor>) {
  return createWithCuid<Partial<Vendedor>>(TABLE, vendedor);
}

export function update(id: ID, vendedor: Partial<Vendedor>) {
  return updateById<Partial<Vendedor>>(TABLE, id, vendedor);
}
