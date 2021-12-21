import React from 'react';
import { useRouter } from 'next/router';
import * as yup from 'yup';

import {
  Form,
  TextField,
  SubmitButton,
  OnFormSubmitFunction,
} from 'components/Form';
import Layout from 'components/Layout';
import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'components/Icons';
import { Loading, useModals, Alert } from 'components/Modals';
import { useGetUser, createUser, updateUser, deleteUser } from 'lib/users';
import { ERR_CODE, FetchError, SqlError, SQLITE_CONSTRAINT } from 'lib/errors';
import type { User } from 'data/types';

// import { useAuth0 } from 'Providers/Auth';

type UserType = Omit<Partial<User>, 'password'>;

const userSchema = yup.object().shape({
  email: yup.string().trim().email().default(''),
  nombre: yup.string().trim().required().default(''),
});

export default function EditUser() {
  const router = useRouter();
  const idUser = router.query.id as ID;
  const id: ID | null | undefined = idUser === 'new' ? null : idUser;

  const { data: user, error } = useGetUser(id as ID);

  const { openLoading, closeLoading, confirmDelete } = useModals();
  // const { can } = useAuth0();

  const handleGetError = (error: Error) => {
    if (error instanceof FetchError && error.code === ERR_CODE.NOT_FOUND) {
      return (
        <Alert heading="No existe" warning onClose={() => router.back()}>
          El usuario pedido no existe o ha sido borrado
        </Alert>
      );
    }
    return (
      <Alert warning heading="Error Desconocido" onClose={() => router.back()}>
        Error inesperado: {error}
      </Alert>
    );
  };
  if (error) return handleGetError(error);

  if (id && !user) return <Loading>Cargando usuario</Loading>;

  const onDeleteClick: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    const { nombre, id } = ev.currentTarget.dataset;
    confirmDelete(`al usuario ${nombre}`, () => {
      deleteUser(id as string).then(({ data, error }) => {
        if (error) return handleGetError(error);
        router.back();
      });
    });
  };

  const onSubmit: OnFormSubmitFunction<UserType> = async (
    values,
    formReturn
  ) => {
    const handleUpsertError = (error: Error) => {
      if (error instanceof SqlError) {
        switch (error.code) {
          case ERR_CODE.NOT_FOUND:
            return (
              <Alert heading="No existe" warning onClose={() => router.back()}>
                El usuario ya había sido borrado
              </Alert>
            );
          case SQLITE_CONSTRAINT:
            formReturn.setError('nombre', {
              type: 'duplicado',
              message: 'Ese nombre ya existe',
            });
            return (
              <Alert heading="Duplicado" warning onClose={() => undefined}>
                Ya existe un usuario con ese mismo nombre
              </Alert>
            );

          default:
        }
      }
      return (
        <Alert warning heading="Error Desconocido" onClose={() => undefined}>
          Error inesperado: {error}
        </Alert>
      );
    };

    if (id) {
      openLoading('Actualizando usuario');
      await updateUser(id, values)
        .then(({ error }) => {
          if (error) return handleUpsertError(error);
        })
        .finally(closeLoading);
    } else {
      openLoading('Creando usuario');
      await createUser({ ...values, password: values.nombre })
        .then(({ data, error }) => {
          if (error) return handleUpsertError(error);
          router.replace(`/users/edit/${data?.id}`);
        })
        .finally(closeLoading);
    }
  };

  return (
    <Layout
      title={`Usuario - ${user ? user.nombre : 'nuevo'}`}
      heading={`${id ? 'Edit' : 'Add'} Usuario`}
    >
      <Form<UserType>
        defaultValues={user}
        onSubmit={onSubmit}
        schema={userSchema}
      >
        <TextField name="nombre" label="Nombre" />
        <TextField name="email" label="eMail" />
        <ButtonSet>
          <SubmitButton component={ButtonIconAdd}>
            {id ? 'Modificar' : 'Agregar'}
          </SubmitButton>
          {/* {id && can('user:delete') && ( */}
          <ButtonIconDelete
            data-id={id}
            data-nombre={user && user.nombre}
            onClick={onDeleteClick}
          >
            Borrar
          </ButtonIconDelete>
          {/* )} */}
        </ButtonSet>
      </Form>
    </Layout>
  );
}
