import type { GetStaticProps } from 'next';
import useSWR, { Middleware, SWRHook } from 'swr';

import { localFetch } from 'util/fetch';

export { FetchError } from 'util/fetch';
import type { Venta } from 'data/types';
const API_VENTAS = '/api/ventas';

const ventasMiddleware: Middleware = (useSWRNext) => {
  return (key, fetcher, config) => {
    // Before hook runs...

    // Handle the next middleware, or the `useSWR` hook if this is the last one.
    const swr = useSWRNext(key, fetcher, config);

    if (swr.error || !swr.data) return swr;

    // @ts-ignore
    const ventas = swr.data.map<Venta>((venta) => ({
      ...venta,
      fecha: new Date(venta.fecha),
    }));

    // After hook runs...
    return { ...swr, data: ventas };
  };
};
export const useListVentas = (idVendedor?: ID) =>
  useSWR<Venta[], Error>(
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
