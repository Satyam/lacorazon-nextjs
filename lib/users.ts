import useSWR from 'swr';

import { localFetch } from 'lib/fetch';

export { FetchError } from 'lib/fetch';
import type { User } from 'data/types';
const API_USERS = '/api/users';

export const useListUsers = () => useSWR<User[], Error>(API_USERS);

export const deleteUser = (id: ID) =>
  localFetch<User>(`${API_USERS}/${id}`, { method: 'DELETE' });

export const getUser = (id: ID) => localFetch<User>(`${API_USERS}/${id}`);

export const useGetUser = (id: ID) =>
  useSWR<User, Error>(id ? `${API_USERS}/${id}` : null);

export const upsertUser = (user: Partial<User>) =>
  localFetch<User>(`${API_USERS}/${user.id || 0}`, {
    method: 'PUT',
    body: JSON.stringify(user),
  });
