import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { Table, ButtonGroup, Alert } from 'reactstrap';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import {
  ButtonIconAdd,
  ButtonIconEdit,
  ButtonIconDelete,
} from 'components/Icons';
import Layout from 'components/Layout';
import type { User } from 'data/types';
import listUsers from 'pages/api/users/list';

// import { Loading } from 'Components/Modals';
// import { useModals } from 'Providers/Modals';
// import { useAuth0 } from 'Providers/Auth';

// import { useListUsers, useDeleteUser, UserType } from './actions';

const ListUsers = ({ users }: { users: User[] }) => {
  const router = useRouter();
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR<User[]>('/api/users/list', fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  // const { loading, error, users } = useListUsers();
  // const deleteUser = useDeleteUser();
  // const { confirmDelete } = useModals();
  // const [gqlErr, setGqlErr] = useState<string | false>(false);
  // const { can } = useAuth0();

  // if (loading) return <Loading>Cargando usuarios</Loading>;

  const onAdd: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    router.push(`/user/new`);
  };
  const onShow: React.MouseEventHandler<HTMLTableCellElement> = (ev) => {
    ev.stopPropagation();
    router.push(`/user/${ev.currentTarget.dataset.id}`);
  };
  // const onDelete: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
  //   ev.stopPropagation();
  //   const { nombre, id } = ev.currentTarget.dataset;
  //   confirmDelete(`al usuario ${nombre}`, () =>
  //     deleteUser(id as string).catch((err) => {
  //       if (err.message === 'GraphQL error: unauthorized') {
  //         setGqlErr('No está autorizado para borrar el usuario');
  //       } else throw err;
  //     })
  //   );
  // };
  const onEdit: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    router.push(`/user/edit/${ev.currentTarget.dataset.id}`);
  };

  const rowUser = (user: User) => {
    const id = user.id;
    return (
      <tr key={id}>
        <td
          onClick={onShow}
          data-id={id}
          className="link"
          title={`Ver detalles\n${user.nombre}`}
        >
          {user.nombre}
        </td>
        <td>{user.email}</td>
        <td align="center">
          <ButtonGroup size="sm">
            <ButtonIconEdit outline onClick={onEdit} data-id={id} />
            {/* {can('user:delete') && (
              <ButtonIconDelete
                outline
                onClick={onDelete}
                data-id={id}
                data-nombre={user.nombre}
              />
            )} */}
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
        <ButtonIconAdd outline onClick={onAdd} label="Agregar">
          Agregar
        </ButtonIconAdd>
      }
      // error={error}
    >
      {/* <Alert color="danger" isOpen={!!gqlErr} toggle={() => setGqlErr(false)}>
        {gqlErr}
      </Alert> */}

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
