import React from 'react';
import { useRouter } from 'next/router';
import * as yup from 'yup';

import { Form, TextField, SubmitButton } from 'components/Form';
import Layout from 'components/Layout';
import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'components/Icons';
import { Loading, useModals, Alert } from 'components/Modals';
import { useGetUser, FetchError } from 'util/fetch';

// import { useAuth0 } from 'Providers/Auth';
// import { UseFormMethods } from 'react-hook-form';

type UserType = {
  id?: ID;
  nombre?: string;
  email?: string;
};

const userSchema = yup.object().shape({
  email: yup.string().trim().email().default(''),
  nombre: yup.string().trim().required().default(''),
});

export default function EditUser() {
  const router = useRouter();
  const { alert } = useModals();
  const { id } = router.query;

  const { data: user, error } = useGetUser(id as ID);

  // const createUser = useCreateUser();
  // const updateUser = useUpdateUser();
  // const deleteUser = useDeleteUser();
  const { openLoading, closeLoading, confirmDelete } = useModals();
  // const [gqlErr, setGqlErr] = useState<string | false>(false);
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
      <Alert warning heading="Desconocido" onClose={() => router.back()}>
        {error.message}
      </Alert>
    );
  }

  if (!id || !user) return <Loading>Cargando usuario</Loading>;

  const onDeleteClick: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    const { nombre, id } = ev.currentTarget.dataset;
    confirmDelete(
      `al usuario ${nombre}`,
      () => console.log('should delete', id, nombre)
      // deleteUser(id as string)
      //   .then(() => router.replace('/users'))
      //   .catch((err) => {
      //     if (err.message === 'GraphQL error: unauthorized') {
      //       setGqlErr('No está autorizado para borrar el usuario');
      //     } else throw err;
      //   })
    );
  };

  const onSubmit = async (
    values: UserType,
    // formMethods: UseFormMethods
  ): Promise<void> => {
    if (id) {
      openLoading('Actualizando usuario');
      console.log('should update', id, values);
      // await updateUser(id, values)
      //   .catch((err) => {
      //     if (
      //       err.message ===
      //       'GraphQL error: SQLITE_CONSTRAINT: UNIQUE constraint failed: Users.nombre'
      //     ) {
      //       formMethods.setError('nombre', {
      //         type: 'duplicate',
      //         message: 'Ese usuario ya existe',
      //       });
      //     } else throw err;
      //   })
      //   .finally(closeLoading);
    } else {
      openLoading('Creando usuario');
      console.log('should create', values);
      // await createUser({ ...values, password: values.nombre })
      //   .then((id) => {
      //     router.replace(`/user/edit/${id}`);
      //   })
      //   .catch((err) => {
      //     if (
      //       err.message ===
      //       'GraphQL error: SQLITE_CONSTRAINT: UNIQUE constraint failed: Users.nombre'
      //     ) {
      //       formMethods.setError('nombre', {
      //         type: 'duplicate',
      //         message: 'Ese usuario ya existe',
      //       });
      //     } else throw err;
      //   })
      //   .finally(closeLoading);
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
