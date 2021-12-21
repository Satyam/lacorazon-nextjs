import React from 'react';
import { useRouter } from 'next/router';
import { Accordion } from 'react-bootstrap';
import { ReadOnlyForm, LabeledText } from 'components/Form';
import Layout from 'components/Layout';
import { Loading, Alert } from 'components/Modals';
import { TablaVentas } from 'pages/ventas/index';
import { useGetVendedor } from 'lib/vendedores';
import { ERR_CODE, FetchError } from 'lib/fetch';

const ShowVendedores = () => {
  const router = useRouter();
  const { id } = router.query as { id: ID };
  const { data: vendedor, error } = useGetVendedor(id as ID);

  if (error instanceof FetchError) {
    if (error.code === ERR_CODE.NOT_FOUND) {
      return (
        <Alert heading="No existe" warning onClose={() => router.back()}>
          El vendedor pedido no existe o ha sido borrado
        </Alert>
      );
    }
    return (
      <Alert warning heading="Desconocido" onClose={() => router.back()}>
        Error inesperado: {error}
      </Alert>
    );
  }
  if (!id || !vendedor) return <Loading>Cargando vendedor</Loading>;

  return (
    <Layout
      title={`Vendedor - ${vendedor ? vendedor.nombre : '??'}`}
      heading={`Vendedor`}
    >
      <ReadOnlyForm>
        <LabeledText label="Nombre" value={vendedor.nombre} />
        <LabeledText label="eMail" value={vendedor.email} />
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

export default ShowVendedores;
