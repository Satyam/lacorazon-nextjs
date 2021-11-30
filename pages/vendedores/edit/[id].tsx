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
import {
  useGetVendedor,
  FetchError,
  upsertVendedor,
  deleteVendedor,
} from '../utils';
import type { Vendedor } from 'data/types';

// import { useAuth0 } from 'Providers/Auth';

type VendedorType = Partial<Vendedor>;

const vendedorSchema = yup.object().shape({
  email: yup.string().trim().email().default(''),
  nombre: yup.string().trim().required().default(''),
});

export default function EditVendedor() {
  const router = useRouter();
  const idVendedor = router.query.id as ID;
  const id: ID | undefined = idVendedor === 'new' ? undefined : idVendedor;

  const { data: vendedor, error } = useGetVendedor(id as ID);

  const { openLoading, closeLoading, confirmDelete } = useModals();
  // const { can } = useAuth0();

  const handleGetError = (error: Error) => {
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
  };
  if (error) return handleGetError(error);

  if (id && !vendedor) return <Loading>Cargando usuario</Loading>;

  const onDeleteClick: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    const { nombre, id } = ev.currentTarget.dataset;
    confirmDelete(`al usuario ${nombre}`, () => {
      deleteVendedor(id as string).then(({ data, error }) => {
        if (error) return handleGetError(error);
        router.back();
      });
    });
  };

  const onSubmit: OnFormSubmitFunction<VendedorType> = async (
    values,
    formReturn
  ) => {
    const handleUpsertError = (error: Error) => {
      if (error instanceof FetchError) {
        switch (error.status) {
          case 404:
            return (
              <Alert heading="No existe" warning onClose={() => router.back()}>
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
      return (
        <Alert warning heading="Error Desconocido" onClose={() => undefined}>
          {error.message}
        </Alert>
      );
    };

    if (id) {
      openLoading('Actualizando vendedor');
      await upsertVendedor({ id, ...values })
        .then(({ error }) => {
          if (error) return handleUpsertError(error);
        })
        .finally(closeLoading);
    } else {
      openLoading('Creando vendedor');
      await upsertVendedor(values)
        .then(({ data, error }) => {
          if (error) return handleUpsertError(error);
          router.replace(`/vendedores/edit/${data?.id}`);
        })
        .finally(closeLoading);
    }
  };

  return (
    <Layout
      title={`Vendedor - ${vendedor ? vendedor.nombre : 'nuevo'}`}
      heading={`${id ? 'Edit' : 'Add'} Vendedor`}
    >
      <Form<VendedorType>
        defaultValues={vendedor}
        onSubmit={onSubmit}
        schema={vendedorSchema}
      >
        <TextField name="nombre" label="Nombre" />
        <TextField name="email" label="eMail" />
        <ButtonSet>
          <SubmitButton component={ButtonIconAdd}>
            {id ? 'Modificar' : 'Agregar'}
          </SubmitButton>
          {/* {id && can('vendedor:delete') && ( */}
          <ButtonIconDelete
            data-id={id}
            data-nombre={vendedor && vendedor.nombre}
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
