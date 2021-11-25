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
import { useGetUser, FetchError, upsertUser, deleteUser } from '../utils';
import type { User } from 'data/types';

// import { useAuth0 } from 'Providers/Auth';

type UserType = Omit<Partial<User>, 'password'>;

const userSchema = yup.object().shape({
  email: yup.string().trim().email().default(''),
  nombre: yup.string().trim().required().default(''),
});

export default function EditUser() {
  const router = useRouter();
  const { alert } = useModals();
  const idUser = router.query.id as ID;
  const id: ID | undefined = idUser === 'new' ? undefined : idUser;

  const { data: user, error } = useGetUser(id as ID);

  const { openLoading, closeLoading, confirmDelete } = useModals();
  // const { can } = useAuth0();

  if (error) {
    if (error instanceof FetchError && error.status === 404) {
      return (
        <Alert heading="No existe" warning onClose={() => router.back()}>
          El vendedor pedido no existe o ha sido borrado
        </Alert>
      );
    }
    return (
      <Alert warning heading="Error Desconocido" onClose={() => router.back()}>
        {error.message}
      </Alert>
    );
  }

  if (id && !user) return <Loading>Cargando usuario</Loading>;

  const onDeleteClick: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    const { nombre, id } = ev.currentTarget.dataset;
    confirmDelete(`al usuario ${nombre}`, () => {
      console.log('should delete', id, nombre);
      deleteUser(id as string).then(({ data, error }) => {
        if (error) {
          if (error instanceof FetchError && error.status === 404) {
            return (
              <Alert heading="No existe" warning onClose={() => router.back()}>
                El vendedor ya había sido borrado
              </Alert>
            );
          }
          return (
            <Alert
              warning
              heading="Error Desconocido"
              onClose={() => router.back()}
            >
              {error.message}
            </Alert>
          );
        }
        router.back();
      });
    });
  };

  const onSubmit: OnFormSubmitFunction<UserType> = async (
    values,
    formReturn
  ) => {
    if (id) {
      openLoading('Actualizando usuario');
      console.log('should update', id, values);
      await upsertUser({ id, ...values })
        .then(({ data, error }) => {
          if (error instanceof FetchError) {
            switch (error.status) {
              case 404:
                return (
                  <Alert
                    heading="No existe"
                    warning
                    onClose={() => router.back()}
                  >
                    El vendedor ya había sido borrado
                  </Alert>
                );
              case 409:
                formReturn.setError('nombre', {
                  type: 'duplicado',
                  message: 'Ese nombre ya existe',
                });
                return (
                  <Alert heading="Duplicado" warning onClose={() => undefined}>
                    Ya existe un vendedor con ese mismo nombre
                  </Alert>
                );
            }
          }
        })
        .finally(closeLoading);
    } else {
      openLoading('Creando usuario');
      console.log('should create', values);
      await upsertUser({ ...values, password: values.nombre })
        .then(({ data, error }) => {
          console.log('after insert, upsert returned', { data, error });
          if (error instanceof FetchError) {
            switch (error.status) {
              case 409:
                formReturn.setError('nombre', {
                  type: 'duplicado',
                  message: 'Ese nombre ya existe',
                });
                return (
                  <Alert heading="Duplicado" warning onClose={() => undefined}>
                    Ya existe un vendedor con ese mismo nombre
                  </Alert>
                );
            }
          }
          router.replace(`/users/edit/${id}`);
        })
        .finally(closeLoading);
    }
  };

  return (
    <Layout
      title={`Vendedor - ${user ? user.nombre : 'nuevo'}`}
      heading={`${id ? 'Edit' : 'Add'} Vendedor`}
      error={error}
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
