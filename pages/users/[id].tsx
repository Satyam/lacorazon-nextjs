import React from 'react';
import { useRouter } from 'next/router';
import { ReadOnlyForm, LabeledText } from 'components/Form';
import Layout from 'components/Layout';
import { Loading, Alert } from 'components/Modals';
import { useGetUser } from 'lib/users';
import { ERR_CODE, FetchError } from 'lib/errors';

const ShowUser = () => {
  const router = useRouter();
  const { id } = router.query as { id: ID };
  const { data: user, error } = useGetUser(id as ID);

  if (error instanceof FetchError) {
    if (error.code === ERR_CODE.NOT_FOUND) {
      return (
        <Alert heading="No existe" warning onClose={() => router.back()}>
          El usuario pedido no existe o ha sido borrado
        </Alert>
      );
    }
    return (
      <Alert warning heading="Desconocido" onClose={() => router.back()}>
        Error inesperado: {error}
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
