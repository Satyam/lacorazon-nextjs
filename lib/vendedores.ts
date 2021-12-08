import useSWR from 'swr';

import { localFetch } from 'lib/fetch';

export { FetchError } from 'lib/fetch';
import type { Vendedor } from 'data/types';
const API_VENDEDORES = '/api/vendedores';

export const useListVendedores = () =>
  useSWR<Vendedor[], Error>(API_VENDEDORES);

export const deleteVendedor = (id: ID) =>
  localFetch<Vendedor>(`${API_VENDEDORES}/${id}`, { method: 'DELETE' });

export const getVendedor = (id: ID) =>
  localFetch<Vendedor>(`${API_VENDEDORES}/${id}`);

export const useGetVendedor = (id: ID) =>
  useSWR<Vendedor, Error>(id ? `${API_VENDEDORES}/${id}` : null);

export const upsertVendedor = (vendedor: Partial<Vendedor>) =>
  localFetch<Vendedor>(`${API_VENDEDORES}/${vendedor.id || 0}`, {
    method: 'PUT',
    body: JSON.stringify(vendedor),
  });
