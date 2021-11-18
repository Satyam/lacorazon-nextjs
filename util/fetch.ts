import useSWR from 'swr';

export const swrFetcher = (url: string, config?: RequestInit) => {
  return fetch(url, config).then((res) => {
    if (!res.ok) {
      const error: Error & { status?: number; info?: any } = new Error(
        'An error occurred while fetching the data.'
      );

      return res.json().then((info) => {
        error.info = info;
        error.status = res.status;
        throw error;
      });
      // Attach extra info to the error object.
    }
    return res.json();
  });
};

export const localFetch = (url: string, config?: RequestInit) =>
  swrFetcher(`${window.origin}${url}`, config);

import type { User } from 'data/types';
const API_USERS = '/api/users';

export const useListUsers = () => useSWR<User[]>(API_USERS);

export const deleteUser = (id: ID) =>
  localFetch(`${API_USERS}/${id}`, { method: 'DELETE' });

export const getUser = (id: ID) => localFetch(`${API_USERS}/${id}`);
