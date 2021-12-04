import type { GetStaticProps } from 'next';
import useSWR, { Middleware, SWRHook } from 'swr';

import { localFetch } from 'lib/fetch';

export { FetchError } from 'lib/fetch';
import type { Venta } from 'data/types';
export type VentaVendedor = Venta & { vendedor?: string };

const API_VENTAS = '/api/ventas';

const ventasMiddleware: Middleware = (useSWRNext) => {
  return (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config);

    if (swr.error || !swr.data) return swr;

    // @ts-ignore
    const ventas = swr.data.map<VentaVendedor>((venta) => ({
      ...venta,
      fecha: new Date(venta.fecha),
    }));

    // After hook runs...
    return { ...swr, data: ventas };
  };
};
export const useListVentas = (idVendedor?: ID) =>
  useSWR<VentaVendedor[], Error>(
    idVendedor ? `${API_VENTAS}?idVendedor=${idVendedor}` : API_VENTAS,
    { use: [ventasMiddleware] }
  );

export const deleteVenta = (id: ID) =>
  localFetch<Venta>(`${API_VENTAS}/${id}`, { method: 'DELETE' });

// This is so NextJS fails on trying to render this page
export const getStaticProps: GetStaticProps = async () => {
  if (process.env.NODE_ENV === 'production') {
    return { notFound: true };
  }
  return { props: {} };
};

const NoRender = () => 'Not a real page';
export default NoRender;
