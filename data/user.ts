import { User } from './types';
import {
  getById,
  createWithCuid,
  updateById,
  deleteById,
  getDb,
} from './utils';

const TABLE = 'Users';

const safeFields: Array<Partial<keyof User>> = ['id', 'nombre', 'email'];

export async function list() {
  const db = await getDb();
  return db.all(`select ${safeFields.join(',')} from ${TABLE}`);
}

export function del(id: ID) {
  return deleteById<User>(TABLE, id, safeFields);
}

export function get(id: ID) {
  return getById<User>(TABLE, id, safeFields);
}

export async function checkValidUser(
  nombre: string,
  password: string
): Promise<User | undefined> {
  const db = await getDb();
  return db.get(
    `select ${safeFields.join(',')}
     from ${TABLE} where nombre = ? and password= ?`,
    [nombre, password]
  );
}

export function create(user: User) {
  return createWithCuid<User>(TABLE, user, safeFields);
}

export function update(user: User) {
  return updateById<User>(TABLE, user, safeFields);
}
