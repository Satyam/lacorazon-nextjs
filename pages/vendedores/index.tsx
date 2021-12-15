import React from 'react';
import { Table, ButtonGroup } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useListVendedores, deleteVendedor } from 'lib/vendedores';
import { ERR_CODE } from 'lib/fetch';
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
        Error: {error} ???
      </Alert>
    );
  if (!vendedores) return <Loading>Cargando vendedores</Loading>;

  // const { can } = useAuth0();

  const onDelete: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    const { nombre, id } = ev.currentTarget.dataset;
    confirmDelete(`al vendedor ${nombre}`, async () => {
      const { error, data } = await deleteVendedor(id as string);
      if (error) {
        if (error === ERR_CODE.NOT_FOUND) {
          alert(
            'No existe',
            `El vendedor "${nombre}" no existe o ha sido borrado`,
            true,
            () => {}
          );
        } else throw new Error(`Error inesperado: ${error}`);
      } else {
        mutate();
      }
    });
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
            <ButtonIconEdit outline link={`/vendedores/edit/${id}`} />
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
  console.log('LIST vendedores', { error, vendedores });
  return (
    <Layout
      title="Vendedores"
      heading="Vendedores"
      action={
        <ButtonIconAdd outline link="/vendedores/edit/new">
          Agregar
        </ButtonIconAdd>
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
