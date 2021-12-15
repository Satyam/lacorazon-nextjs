import { apiService, useApiService, OP } from 'lib/fetch';

import type { Vendedor } from 'data/types';
const API_VENDEDORES = 'vendedores';

export const useListVendedores = () =>
  useApiService<Vendedor[]>(API_VENDEDORES, {
    op: OP.LIST,
  });

export const getVendedor = (id: ID) =>
  apiService<Vendedor>(API_VENDEDORES, {
    op: OP.GET,
    id,
  });

export const useGetVendedor = (id: ID | null) =>
  useApiService<Vendedor>(API_VENDEDORES, {
    op: OP.GET,
    id,
  });

export const updateVendedor = (id: ID, vendedor: Partial<Vendedor>) =>
  apiService<Partial<Vendedor>>(API_VENDEDORES, {
    op: OP.UPDATE,
    id,
    data: vendedor,
  });

export const createVendedor = (vendedor: Partial<Vendedor>) =>
  apiService<Partial<Vendedor>>(API_VENDEDORES, {
    op: OP.CREATE,
    data: vendedor,
  });

export const deleteVendedor = (id: ID) =>
  apiService<Vendedor>(API_VENDEDORES, {
    op: OP.DELETE,
    id,
  });
