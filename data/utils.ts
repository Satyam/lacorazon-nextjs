import cuid from 'cuid';
import type { Database } from 'sqlite';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

import { join } from 'path';

type SQLiteErr = {
  errno: number;
  code: string;
  toString: () => string;
};

const rxUnique = /UNIQUE\s*constraint\s*failed:\s*([a-zA-Z]\w*)\.([a-zA-Z]\w*)/;

const SQLITE_EMPTY = 16; // Declared but not used by SQLite,
const SQLITE_ERROR = 1; // Generic
const SQLITE_NOTFOUND = 12;
export class SqlError extends Error {
  code: number;
  table: string | undefined;
  column: string | undefined;
  constructor(err: SQLiteErr, table = '') {
    super(err.toString());

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SqlError);
    }
    this.name = 'SqlError';
    this.code = err.errno;
    this.table = table;
    if (this.code === 19) {
      const m = rxUnique.exec(err.toString());
      if (m) {
        this.table = m[1];
        this.column = m[2];
        return;
      }
    }
  }
}

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
  return db
    .get(`select ${f} from ${nombreTabla} where id = ?`, [id])
    .catch((err) => {
      throw new SqlError(err, nombreTabla);
    });
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

  const response = await db
    .run(
      `insert into ${nombreTabla} (${fields}) values (${Array(fields.length)
        .fill('?')
        .join(',')})`,
      values
    )
    .catch((err) => {
      throw new SqlError(err, nombreTabla);
    });
  if (response.lastID)
    return getById<R & { id: ID }>(nombreTabla, response.lastID, camposSalida);
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

  const { changes } = await db
    .run(
      `insert into ${nombreTabla} (id, ${fields.join(',')}) values (${Array(
        fields.length + 1
      )
        .fill('?')
        .join(',')})`,
      [id, ...values]
    )
    .catch((err) => {
      throw new SqlError(err, nombreTabla);
    });
  if (changes === 1) {
    return getById<R & { id: ID }>(nombreTabla, id, camposSalida);
  } else {
    throw new SqlError(
      { errno: SQLITE_ERROR, code: 'no changes' },
      nombreTabla
    );
  }
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
  const { changes } = await db
    .run(
      `update ${nombreTabla}  set (${fields.join(',')}) = (${Array(
        fields.length
      )
        .fill('?')
        .join(',')})  where id = ?`,
      [...values, id]
    )
    .catch((err) => {
      throw new SqlError(err, nombreTabla);
    });
  if (changes === 1) return getById(nombreTabla, id, camposSalida);
  throw new SqlError(
    { errno: SQLITE_NOTFOUND, code: 'no changes' },
    nombreTabla
  );
}

export async function deleteById<R extends AnyRecord = AnyRecord>(
  nombreTabla: string,
  id: ID,

  camposSalida?: Array<keyof R>
): Promise<R | undefined> {
  const old = await getById(nombreTabla, id, camposSalida);
  if (old) {
    const db = await getDb();
    const { changes } = await db
      .run(`delete from ${nombreTabla} where id = ?`, [id])
      .catch((err) => {
        throw new SqlError(err, nombreTabla);
      });
    if (changes === 1) return old as R;
    throw new SqlError(
      { errno: SQLITE_NOTFOUND, code: 'no changes' },
      nombreTabla
    );
  } else return;
}

// export function delay(ms: number) {
//   return (value) =>
//     new Promise((resolve) => {
//       setTimeout(() => resolve(value), ms);
//     });
// }
