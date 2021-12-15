import cuid from 'cuid';
import type { Database } from 'sqlite';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

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

export async function getById<R extends AnyRecord = AnyRecord>(
  nombreTabla: string,
  id: ID,
  camposSalida?: Array<keyof R>
): Promise<R | undefined> {
  const f = camposSalida ? camposSalida.join(',') : '*';
  const db = await getDb();
  return db.get(`select ${f} from ${nombreTabla} where id = ?`, [id]);
}

export async function createWithAutoId<R extends RecordWithoutId>(
  nombreTabla: string,
  fila: Omit<R, 'id'>,

  camposSalida?: Array<keyof R>
): Promise<R | undefined> {
  const { id: _, ...rest } = fila;
  const fields = Object.keys(rest);
  const values = Object.values(rest);
  const db = await getDb();
  const response = await db.run(
    `insert into ${nombreTabla} (${fields}) values (${Array(fields.length)
      .fill('?')
      .join(',')})`,
    values
  );
  if (response.lastID)
    return getById<R & { id: ID }>(nombreTabla, response.lastID, camposSalida);
  return undefined;
}

export async function createWithCuid<R extends RecordWithoutId>(
  nombreTabla: string,
  fila: R,

  camposSalida?: Array<keyof R>
): Promise<R | undefined> {
  const id = cuid();
  const { id: _, ...rest } = fila;
  const fields = Object.keys(rest);
  const values = Object.values(rest);
  const db = await getDb();

  const { lastID, changes } = await db.run(
    `insert into ${nombreTabla} (id, ${fields.join(',')}) values (${Array(
      fields.length + 1
    )
      .fill('?')
      .join(',')})`,
    [id, ...values]
  );
  console.log('createWithCuid', { nombreTabla, fila, id, lastID, changes });
  if (changes !== 1) return;
  return getById<R & { id: ID }>(nombreTabla, id, camposSalida);
}

export async function updateById<R extends AnyRecord = AnyRecord>(
  nombreTabla: string,
  id: ID,
  fila: PartialExcept<R, 'id'>,

  camposSalida?: Array<keyof R>
): Promise<R | undefined> {
  const fields = Object.keys(fila);
  const values = Object.values(fila);
  const db = await getDb();
  const result = await db.run(
    `update ${nombreTabla}  set (${fields.join(',')}) = (${Array(fields.length)
      .fill('?')
      .join(',')})  where id = ?`,
    [...values, id]
  );
  if (result.changes !== 1) return;
  return getById(nombreTabla, id, camposSalida);
}

export async function deleteById<R extends AnyRecord = AnyRecord>(
  nombreTabla: string,
  id: ID,

  camposSalida?: Array<keyof R>
): Promise<R | undefined> {
  const old = await getById(nombreTabla, id, camposSalida);
  if (old) {
    const db = await getDb();
    await db.run(`delete from ${nombreTabla} where id = ?`, [id]);
    return old as R;
  } else return;
}

// export function delay(ms: number) {
//   return (value) =>
//     new Promise((resolve) => {
//       setTimeout(() => resolve(value), ms);
//     });
// }
