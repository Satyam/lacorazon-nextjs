import { User, Rango } from './types';
import {
  getById,
  getAllLimitOffset,
  createWithCuid,
  updateById,
  deleteById,
} from './utils';

const TABLE = 'Users';

const safeFields: Array<Partial<keyof User>> = ['id', 'nombre', 'email'];

export function list(rango: Rango) {
  return getAllLimitOffset<User>(TABLE, rango, safeFields);
}

export function del(id: ID) {
  return deleteById<User>(TABLE, id, safeFields);
}

export function get(id: ID) {
  return getById<User>(TABLE, id, safeFields);
}

export function create(user: User) {
  return createWithCuid<User>(TABLE, user, safeFields);
}

export function update(user: User) {
  return updateById<User>(TABLE, user, safeFields);
}
