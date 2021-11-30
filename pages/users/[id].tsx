import React from 'react';
import { useRouter } from 'next/router';
import { ReadOnlyForm, LabeledText } from 'components/Form';
import Layout from 'components/Layout';
import { Loading, Alert } from 'components/Modals';
import { useGetUser, FetchError } from './utils';

const ShowUser = () => {
  const router = useRouter();
  const { id } = router.query as { id: ID };
  const { data: user, error } = useGetUser(id as ID);

  if (error) {
    if (error instanceof FetchError && error.status === 404) {
      return (
        <Alert heading="No existe" warning onClose={() => router.back()}>
          El usuario pedido no existe o ha sido borrado
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

  return (
    <Layout
      title={`Usuario - ${user ? user.nombre : '??'}`}
      heading={`Usuario`}
    >
      <ReadOnlyForm>
        <LabeledText label="Nombre" value={user.nombre} />
        <LabeledText label="eMail" value={user.email} />
      </ReadOnlyForm>
    </Layout>
  );
};

export default ShowUser;
