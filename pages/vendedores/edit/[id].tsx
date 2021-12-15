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
  createVendedor,
  updateVendedor,
  deleteVendedor,
} from 'lib/vendedores';
import { ERR_CODE } from 'lib/fetch';
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
  const id: ID | null = idVendedor === 'new' ? null : idVendedor;

  const { data: vendedor, error } = useGetVendedor(id as ID);

  const { openLoading, closeLoading, confirmDelete } = useModals();
  // const { can } = useAuth0();

  const handleGetError = (error: ERR_CODE | Error) => {
    if (error === ERR_CODE.NOT_FOUND) {
      return (
        <Alert heading="No existe" warning onClose={() => router.back()}>
          El vendedor pedido no existe o ha sido borrado
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
    const handleUpsertError = (error: ERR_CODE | Error) => {
      switch (error) {
        case ERR_CODE.NOT_FOUND:
          return (
            <Alert heading="No existe" warning onClose={() => router.back()}>
              El vendedor ya había sido borrado
            </Alert>
          );
        case ERR_CODE.DUPLICATE:
          formReturn.setError('nombre', {
            type: 'duplicado',
            message: 'Ese nombre ya existe',
          });
          return (
            <Alert heading="Duplicado" warning onClose={() => undefined}>
              Ya existe un vendedor con ese mismo nombre
            </Alert>
          );
        default:
          return (
            <Alert
              warning
              heading="Error Desconocido"
              onClose={() => undefined}
            >
              Error inesperado: {error}
            </Alert>
          );
      }
    };

    if (id) {
      openLoading('Actualizando vendedor');
      await updateVendedor(id, values)
        .then(({ error }) => {
          if (error) return handleUpsertError(error);
        })
        .finally(closeLoading);
    } else {
      openLoading('Creando vendedor');
      await createVendedor(values)
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
