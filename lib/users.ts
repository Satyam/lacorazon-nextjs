import { apiService, useApiService, OP } from 'lib/fetch';
import type { User } from 'data/types';

const API_USERS = 'users';

export const useListUsers = () =>
  useApiService<User[]>(API_USERS, {
    op: OP.LIST,
  });

export const getUser = (id: ID) =>
  apiService<User>(API_USERS, {
    op: OP.GET,
    id,
  });

export const useGetUser = (id: ID | null) =>
  useApiService<User>(API_USERS, {
    op: OP.GET,
    id,
  });

export const updateUser = (id: ID, user: Partial<User>) =>
  apiService<Partial<User>>(API_USERS, {
    op: OP.UPDATE,
    id,
    data: user,
  });

export const createUser = (user: Partial<User>) =>
  apiService<Partial<User>>(API_USERS, {
    op: OP.CREATE,
    data: user,
  });

export const deleteUser = (id: ID) =>
  apiService<User>(API_USERS, {
    op: OP.DELETE,
    id,
  });
