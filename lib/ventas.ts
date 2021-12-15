import { apiService, useApiService, OP } from 'lib/fetch';

import type { Venta } from 'data/types';
export type VentaVendedor = Venta & { vendedor?: string };

const API_VENTAS = 'ventas';

export const useListVentas = (idVendedor?: ID) =>
  useApiService<Venta[]>(
    API_VENTAS,
    {
      op: OP.LIST,
      options: { idVendedor },
    },
    (venta) =>
      ({
        ...venta,
        fecha: new Date(venta.fecha),
      } as Venta)
  );

export const deleteVenta = (id: ID) =>
  apiService<Venta>(API_VENTAS, {
    op: OP.DELETE,
    id,
  });
