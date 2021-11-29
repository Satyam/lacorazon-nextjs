import React from 'react';
import { Table, ButtonGroup } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useListUsers, deleteUser } from './utils';
import {
  ButtonIconAdd,
  ButtonIconEdit,
  ButtonIconDelete,
} from 'components/Icons';
import Layout from 'components/Layout';
import type { User } from 'data/types';

import { Loading, useModals, Alert } from 'components/Modals';
// import { useAuth0 } from 'Providers/Auth';

const ListUsers = () => {
  const router = useRouter();
  const { data: users, error, mutate } = useListUsers();
  const { confirmDelete, alert } = useModals();

  if (error)
    return (
      <Alert warning heading="Desconocido" onClose={() => router.back()}>
        {error.message}
      </Alert>
    );
  if (!users) return <Loading>Cargando usuarios</Loading>;

  // const { can } = useAuth0();

  const onDelete: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    const { nombre, id } = ev.currentTarget.dataset;
    confirmDelete(`al usuario ${nombre}`, () =>
      deleteUser(id as string).then((res) => {
        if (res.error) {
          if (res.error.status === 404) {
            alert(
              'No existe',
              `El usuario "${nombre}" no existe o ha sido borrado`,
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

  const rowUser = (user: User) => {
    const id = user.id;
    return (
      <tr key={id}>
        <td title={`Ver detalles\n${user.nombre}`}>
          <Link href={`/users/${id}`}>
            <a className="link-dark">{user.nombre}</a>
          </Link>
        </td>
        <td>{user.email}</td>
        <td align="center">
          <ButtonGroup size="sm">
            <Link href={`/users/edit/${id}`} passHref>
              <ButtonIconEdit outline />
            </Link>
            {/* {can('user:delete') && ( */}
            <ButtonIconDelete
              outline
              onClick={onDelete}
              data-id={id}
              data-nombre={user.nombre}
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
        <Link href="/users/edit/new" passHref>
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
        <tbody>{(users || []).map(rowUser)}</tbody>
      </Table>
    </Layout>
  );
};

export default ListUsers;

ListUsers.whyDidYouRender = false;
