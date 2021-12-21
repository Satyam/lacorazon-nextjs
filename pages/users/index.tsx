import React from 'react';
import { Table, ButtonGroup } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useListUsers, deleteUser } from 'lib/users';
import { ERR_CODE, FetchError } from 'lib/errors';
import {
  ButtonIconAdd,
  ButtonIconEdit,
  ButtonIconDelete,
} from 'components/Icons';
import Layout from 'components/Layout';
import type { User } from 'data/types';
import { list as listUser } from 'data/user';

import { Loading, useModals, Alert } from 'components/Modals';
// import { useAuth0 } from 'Providers/Auth';

export const getStaticProps: GetStaticProps<{ staticData: User[] }> =
  async () => {
    const staticData = await listUser();
    return {
      props: {
        staticData,
      },
      revalidate: false,
    };
  };

const ListUsers = ({
  staticData,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const { data, error, mutate } = useListUsers();
  const { confirmDelete, alert } = useModals();

  if (error)
    return (
      <Alert warning heading="Desconocido" onClose={() => router.back()}>
        Error inesperado: {error}
      </Alert>
    );

  const users = data || staticData;
  if (!users) return <Loading>Cargando usuarios</Loading>;

  // const { can } = useAuth0();

  const onDelete: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    const { nombre, id } = ev.currentTarget.dataset;
    confirmDelete(`al usuario ${nombre}`, async () => {
      const { error } = await deleteUser(id as string);
      if (error instanceof FetchError) {
        if (error.code === ERR_CODE.NOT_FOUND) {
          alert(
            'No existe',
            `El usuario "${nombre}" no existe o ha sido borrado`,
            true,
            () => {}
          );
        } else throw new Error(`Error inesperado: ${error}`);
      } else {
        mutate();
      }
    });
  };

  const rowUser = (user: User) => {
    const id = user.id;
    return (
      <tr key={id}>
        <td title={`Ver detalles\n${user.nombre}`}>
          <Link href={`/users/${id}`}>
            <a>{user.nombre}</a>
          </Link>
        </td>
        <td>{user.email}</td>
        <td align="center">
          <ButtonGroup size="sm">
            <ButtonIconEdit outline link={`/users/edit/${id}`} />
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
      title="Usuarios"
      heading="Usuarios"
      action={
        <ButtonIconAdd outline link="/users/edit/new">
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
        <tbody>{(users || []).map(rowUser)}</tbody>
      </Table>
    </Layout>
  );
};

export default ListUsers;
