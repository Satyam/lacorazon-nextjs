import { User } from './types';
import {
  getById,
  createWithCuid,
  updateById,
  deleteById,
  getDb,
} from './utils';
import hash from 'lib/hash';

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
  email: string,
  password: string
): Promise<User | undefined> {
  const db = await getDb();
  db.on('trace', console.info);
  return db.get(
    `select ${safeFields.join(',')}
     from ${TABLE} where lower(email) = lower(?) and password = ?`,
    [email, hash(password.toLowerCase())]
  );
}

function hashPassword(user: User) {
  return user.password ? { ...user, password: hash(user.password) } : user;
}

export function create(user: User) {
  return createWithCuid<User>(TABLE, hashPassword(user), safeFields);
}

export function update(user: User) {
  return updateById<User>(TABLE, hashPassword(user), safeFields);
}
