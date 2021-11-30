import React from 'react';
import { Table, ButtonGroup } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useListVendedores, deleteVendedor } from './utils';
import {
  ButtonIconAdd,
  ButtonIconEdit,
  ButtonIconDelete,
} from 'components/Icons';
import Layout from 'components/Layout';
import type { Vendedor } from 'data/types';

import { Loading, useModals, Alert } from 'components/Modals';
// import { useAuth0 } from 'Providers/Auth';

const ListVendedoress = () => {
  const router = useRouter();
  const { data: vendedores, error, mutate } = useListVendedores();
  const { confirmDelete, alert } = useModals();

  if (error)
    return (
      <Alert warning heading="Desconocido" onClose={() => router.back()}>
        {error.message}
      </Alert>
    );
  if (!vendedores) return <Loading>Cargando vendedores</Loading>;

  // const { can } = useAuth0();

  const onDelete: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    const { nombre, id } = ev.currentTarget.dataset;
    confirmDelete(`al vendedor ${nombre}`, () =>
      deleteVendedor(id as string).then((res) => {
        if (res.error) {
          if (res.error.status === 404) {
            alert(
              'No existe',
              `El vendedor "${nombre}" no existe o ha sido borrado`,
              true,
              () => {}
            );
          } else throw res.error;
        } else {
          mutate();
        }
      })
    );
  };

  const rowVendedores = (vendedor: Vendedor) => {
    const id = vendedor.id;
    return (
      <tr key={id}>
        <td title={`Ver detalles\n${vendedor.nombre}`}>
          <Link href={`/vendedores/${id}`}>
            <a>{vendedor.nombre}</a>
          </Link>
        </td>
        <td>{vendedor.email}</td>
        <td align="center">
          <ButtonGroup size="sm">
            <Link href={`/vendedores/edit/${id}`} passHref>
              <ButtonIconEdit outline />
            </Link>
            {/* {can('vendedor:delete') && ( */}
            <ButtonIconDelete
              outline
              onClick={onDelete}
              data-id={id}
              data-nombre={vendedor.nombre}
            />
            {/* )} */}
          </ButtonGroup>
        </td>
      </tr>
    );
  };

  return (
    <Layout
      title="Vendedores"
      heading="Vendedores"
      action={
        <Link href="/vendedores/edit/new" passHref>
          <ButtonIconAdd outline>Agregar</ButtonIconAdd>
        </Link>
      }
    >
      <Table striped hover size="sm" responsive bordered>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>E-mail</th>
            <th />
          </tr>
        </thead>
        <tbody>{(vendedores || []).map(rowVendedores)}</tbody>
      </Table>
    </Layout>
  );
};

export default ListVendedoress;

ListVendedoress.whyDidYouRender = false;
