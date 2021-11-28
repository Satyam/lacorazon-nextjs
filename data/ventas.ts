import { Venta, Rango } from './types';
import {
  getDb,
  getById,
  getAllLimitOffset,
  createWithCuid,
  updateById,
  deleteById,
} from './utils';

const TABLE = 'Ventas';

export async function list(rango: Rango, idVendedor?: ID) {
  if (idVendedor) {
    const db = await getDb();
    return db.all(
      'select * from Ventas where idVendedor = $idVendedor order by fecha, id',
      {
        $idVendedor: idVendedor,
      }
    );
  }
  return getAllLimitOffset<Venta>(TABLE, rango);
}

export function del(id: ID) {
  return deleteById<Venta>(TABLE, id);
}

export function get(id: ID) {
  return getById<Venta>(TABLE, id);
}

export function create(user: Venta) {
  return createWithCuid<Venta>(TABLE, user);
}

export function update(user: Venta) {
  return updateById<Venta>(TABLE, user);
}
