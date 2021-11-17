import cuid from 'cuid';
import type { Database } from 'sqlite';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

import { RecordWithId, Rango, PartialExcept } from './types';
import { join } from 'path';
let _db: Database;

export async function getDb() {
  if (!_db) {
    _db = await open({
      filename: join(process.cwd(), 'data', 'db.sqlite'),
      driver: sqlite3.Database,
    });
  }
  return _db;
}

export async function getAllLimitOffset<R extends RecordWithId>(
  nombreTabla: string,
  { offset = 0, limit }: Rango,

  camposSalida?: Array<keyof R>
): Promise<R[]> {
  const f = camposSalida ? camposSalida.join(',') : '*';
  const db = await getDb();
  if (limit) {
    return db.all(
      `select ${f} from ${nombreTabla} order by nombre limit ? offset ?`,
      [limit, offset]
    );
  }
  return db.all(`select * from ${nombreTabla} order by nombre`);
}

export async function getById<R extends RecordWithId>(
  nombreTabla: string,
  id: ID,

  camposSalida?: Array<keyof R>
): Promise<R | undefined> {
  const f = camposSalida ? camposSalida.join(',') : '*';
  const db = await getDb();
  return db.get(`select ${f} from ${nombreTabla} where id = ?`, [id]);
}

export async function createWithAutoId<R extends RecordWithId>(
  nombreTabla: string,
  fila: Omit<R, 'id'>,

  camposSalida?: Array<keyof R>
): Promise<R | undefined> {
  const fields = Object.keys(fila);
  const values = Object.values(fila);
  const db = await getDb();
  const response = await db.run(
    `insert into ${nombreTabla} (${fields}) values (${Array(fields.length)
      .fill('?')
      .join(',')})`,
    values
  );
  if (response.lastID)
    return getById(nombreTabla, response.lastID, camposSalida);
  return undefined;
}

export async function createWithCuid<R extends RecordWithId>(
  nombreTabla: string,
  fila: R,

  camposSalida?: Array<keyof R>
): Promise<R | undefined> {
  const id = cuid();
  const fields = Object.keys(fila);
  const values = Object.values(fila);
  const db = await getDb();
  await db.run(
    `insert into ${nombreTabla} (id, ${fields.join(',')}) values (${Array(
      fields.length + 1
    )
      .fill('?')
      .join(',')})`,
    [id, ...values]
  );
  return getById(nombreTabla, id, camposSalida);
}

export async function updateById<R extends RecordWithId>(
  nombreTabla: string,
  fila: PartialExcept<R, 'id'>,

  camposSalida?: Array<keyof R>
): Promise<R | undefined> {
  if ('id' in fila) {
    const { id, ...rest } = fila;
    const fields = Object.keys(rest);
    const values = Object.values(rest);
    const db = await getDb();
    const result = await db.run(
      `update ${nombreTabla}  set (${fields.join(',')}) = (${Array(
        fields.length
      )
        .fill('?')
        .join(',')})  where id = ?`,
      [...values, id]
    );
    if (result.changes !== 1)
      throw new Error(`${id} not found in ${nombreTabla}`);
    return getById(nombreTabla, id, camposSalida);
  }
}

export async function deleteById<R extends RecordWithId>(
  nombreTabla: string,
  id: ID,

  camposSalida?: Array<keyof R>
): Promise<R | undefined> {
  const old = await getById(nombreTabla, id, camposSalida);
  if (old) {
    const db = await getDb();
    await db.run(`delete from ${nombreTabla} where id = ?`, [id]);
    return old as R;
  } else throw new Error(`${id} not found in ${nombreTabla}`);
}

// export function delay(ms: number) {
//   return (value) =>
//     new Promise((resolve) => {
//       setTimeout(() => resolve(value), ms);
//     });
// }
