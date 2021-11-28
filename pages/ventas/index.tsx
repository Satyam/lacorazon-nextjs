import React from 'react';
import { useRouter } from 'next/router';
import { Table, ButtonGroup } from 'react-bootstrap';
import { FaRegCheckSquare, FaRegSquare } from 'react-icons/fa';

import {
  ButtonIconAdd,
  ButtonIconEdit,
  ButtonIconDelete,
} from 'components/Icons';
// import { useIntl } from 'Providers/Intl';

import { formatDate, formatCurrency } from 'util/format';

import { Loading } from 'components/Modals';
import Layout from 'components/Layout';
import { useModals } from 'components/Modals';

import { useListVentas, deleteVenta } from './utils';
import type { Venta } from 'data/types';

const ListVentas: React.FC<{
  idVendedor?: ID;
  nombreVendedor?: string;
  wide?: boolean;
}> = ({ idVendedor, nombreVendedor, wide }) => {
  const router = useRouter();

  const { data: ventas, error, mutate } = useListVentas(idVendedor);

  const { confirmDelete } = useModals();

  if (error) return <div>failed to load</div>;
  if (!ventas) return <Loading>Cargando ventas</Loading>;

  const onAdd: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    router.push('/venta/new');
  };
  const onShow: React.MouseEventHandler<HTMLElement> = (ev) => {
    ev.stopPropagation();
    router.push(`/venta/${ev.currentTarget.dataset.id}`);
  };
  const onDelete: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    const { fecha, id } = ev.currentTarget.dataset;
    confirmDelete(`la venta del ${fecha}`, () => deleteVenta(id!));
  };
  const onEdit: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    router.push(`/venta/edit/${ev.currentTarget.dataset.id}`);
  };
  const onShowVendedor: React.MouseEventHandler<HTMLElement> = (ev) => {
    ev.stopPropagation();
    router.push(`/user/${ev.currentTarget.dataset.id}`);
  };

  const rowVenta = (venta: Venta) => {
    const id = venta.id;
    return (
      <tr key={id}>
        <td
          align="right"
          className="link"
          onClick={onShow}
          data-id={id}
          title="Ver detalle esta venta"
        >
          {formatDate(venta.fecha)}
        </td>
        <td>{venta.concepto}</td>
        {/* {!idVendedor &&
          (venta.vendedor ? (
            <td
              className="link"
              onClick={onShowVendedor}
              data-id={venta.vendedor.id}
              title={`Ver detalle vendedor: \n${venta.vendedor.nombre}`}
            >
              {venta.vendedor.nombre}
            </td>
          ) : (
            <td>---</td>
          ))} */}
        <td align="right">{venta.cantidad}</td>
        <td align="right">{formatCurrency(venta.precioUnitario)}</td>
        <td align="center">
          {venta.iva ? <FaRegCheckSquare /> : <FaRegSquare />}
        </td>
        <td align="right">
          {formatCurrency(venta.cantidad! * venta.precioUnitario!)}
        </td>
        <td align="center">
          <ButtonGroup size="sm">
            <ButtonIconEdit
              outline
              onClick={onEdit}
              data-id={id}
              data-fecha={formatDate(venta.fecha)}
            />
            <ButtonIconDelete outline onClick={onDelete} data-id={id} />
          </ButtonGroup>
        </td>
      </tr>
    );
  };

  return (
    <Layout
      title={idVendedor ? undefined : 'Ventas'}
      heading={nombreVendedor ? `Ventas de ${nombreVendedor}` : 'Ventas'}
      wide={wide}
      action={
        <ButtonIconAdd outline onClick={onAdd}>
          Agregar
        </ButtonIconAdd>
      }
      error={error}
    >
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
    </Layout>
  );
};

export default ListVentas;
