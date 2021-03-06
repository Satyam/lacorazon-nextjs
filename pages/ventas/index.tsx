import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Table, ButtonGroup } from 'react-bootstrap';
import { FaRegCheckSquare, FaRegSquare } from 'react-icons/fa';

import {
  ButtonIconAdd,
  ButtonIconEdit,
  ButtonIconDelete,
} from 'components/Icons';
// import { useIntl } from 'Providers/Intl';

import { formatDate, formatCurrency } from 'lib/format';

import { Loading } from 'components/Modals';
import Layout from 'components/Layout';
import { useModals, Alert } from 'components/Modals';

import { useListVentas, deleteVenta, VentaVendedor } from 'lib/ventas';

export const TablaVentas: React.FC<{
  idVendedor?: ID;
}> = ({ idVendedor }) => {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: ventas, error, mutate } = useListVentas(idVendedor);

  const { confirmDelete } = useModals();

  if (error)
    return (
      <Alert warning heading="Desconocido" onClose={() => router.back()}>
        Error inesperado: {error.message}
      </Alert>
    );
  if (!ventas) return <Loading>Cargando ventas</Loading>;

  const onDelete: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    const { fecha, id } = ev.currentTarget.dataset;
    if (id) {
      ev.stopPropagation();
      confirmDelete(`la venta del ${fecha}`, () => deleteVenta(id));
    }
  };

  const rowVenta = (venta: VentaVendedor) => {
    const id = venta.id;

    return (
      <tr key={id}>
        <td align="right" title="Ver detalle esta venta">
          <Link href={`/ventas/${id}`}>
            <a>{formatDate(venta.fecha)}</a>
          </Link>
        </td>
        <td>{venta.concepto}</td>

        {!idVendedor &&
          (venta.vendedor ? (
            <td title={`Ver detalle vendedor: \n${venta.vendedor}`}>
              <Link href={`/users/${venta.idVendedor}`}>
                <a>{venta.vendedor}</a>
              </Link>
            </td>
          ) : (
            <td>---</td>
          ))}
        <td align="right">{venta.cantidad}</td>
        <td align="right">{formatCurrency(venta.precioUnitario)}</td>
        <td align="center">
          {venta.iva ? <FaRegCheckSquare /> : <FaRegSquare />}
        </td>
        <td align="right">
          {formatCurrency((venta.cantidad ?? 1) * (venta.precioUnitario ?? 0))}
        </td>
        <td align="center">
          <ButtonGroup size="sm">
            <ButtonIconEdit outline link={`/ventas/edit/${id}`} />
            <ButtonIconDelete
              outline
              onClick={onDelete}
              data-id={id}
              data-fecha={formatDate(venta.fecha)}
            />
          </ButtonGroup>
        </td>
      </tr>
    );
  };

  return (
    <Table striped hover size="sm" responsive bordered>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Concepto</th>
          {!idVendedor && <th>Vendedor</th>}
          <th>Cantidad</th>
          <th>Precio Unitario</th>
          <th>IVA</th>
          <th>Precio Total</th>
          <th />
        </tr>
      </thead>
      <tbody>{(ventas || []).map(rowVenta)}</tbody>
    </Table>
  );
};

const ListVentas: React.FC<{
  idVendedor?: ID;
  nombreVendedor?: string;
  wide?: boolean;
}> = ({ idVendedor, nombreVendedor, wide }) => {
  return (
    <Layout
      title={idVendedor ? undefined : 'Ventas'}
      heading={nombreVendedor ? `Ventas de ${nombreVendedor}` : 'Ventas'}
      wide={wide}
      action={
        <ButtonIconAdd outline link="/ventas/edit/new">
          Agregar
        </ButtonIconAdd>
      }
    >
      <TablaVentas idVendedor={idVendedor} />
    </Layout>
  );
};

export default ListVentas;
