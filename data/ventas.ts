import { Venta } from './types';
import {
  getDb,
  getById,
  createWithCuid,
  updateById,
  deleteById,
} from './utils';

const TABLE = 'Ventas';

export async function list(idVendedor?: ID) {
  const db = await getDb();
  if (idVendedor) {
    return db.all(
      `select * from ${TABLE} where idVendedor = $idVendedor order by fecha, id`,
      {
        $idVendedor: idVendedor,
      }
    );
  }
  return db.all(`
    select Ventas.*, Users.nombre as vendedor from Ventas 
    inner join Users on Ventas.idVendedor = Users.id  
    order by fecha, id
  `);
}

export function del(id: ID) {
  return deleteById<Venta>(TABLE, id);
}

export function get(id: ID) {
  return getById<Venta>(TABLE, id);
}

export function create(user: Partial<Venta>) {
  return createWithCuid<Partial<Venta>>(TABLE, user);
}

export function update(id: ID, user: Partial<Venta>) {
  return updateById<Partial<Venta>>(TABLE, id, user);
}
