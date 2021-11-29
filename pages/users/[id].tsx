import React from 'react';
import { useRouter } from 'next/router';
import { Accordion } from 'react-bootstrap';
import { ReadOnlyForm, LabeledText } from 'components/Form';
import Layout from 'components/Layout';
import { Loading, Alert } from 'components/Modals';
import { TablaVentas } from 'pages/ventas/index';
import { useGetUser, FetchError } from './utils';

const ShowUser = () => {
  const router = useRouter();
  const { id } = router.query as { id: ID };
  const { data: user, error } = useGetUser(id as ID);

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

  return (
    <Layout
      title={`Vendedor - ${user ? user.nombre : '??'}`}
      heading={`Vendedor`}
    >
      <ReadOnlyForm>
        <LabeledText label="Nombre" value={user.nombre} />
        <LabeledText label="eMail" value={user.email} />
        <Accordion>
          <Accordion.Item eventKey="ventas">
            <Accordion.Header>Ventas</Accordion.Header>
            <Accordion.Body>
              <TablaVentas idVendedor={id} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="consigna">
            <Accordion.Header>Consigna</Accordion.Header>
            <Accordion.Body>
              Aquí irían los libros que este vendedor tiene en consigna en las
              librerías
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </ReadOnlyForm>
    </Layout>
  );
};

export default ShowUser;
