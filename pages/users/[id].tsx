import React from 'react';
import { useRouter } from 'next/router';
import { LabeledText } from 'components/Form';
import Layout from 'components/Layout';
import { Loading, Alert, useModals } from 'components/Modals';
// import { Accordion, AccordionPanel } from 'Components/Accordion';
// import ListVentas from 'Components/ventas/ListVentas';
import { useGetUser, FetchError } from 'util/fetch';

const ShowUser = () => {
  const router = useRouter();
  const { alert } = useModals();
  const { id } = router.query;
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
      error={error}
    >
      <>
        <LabeledText label="Nombre" value={user.nombre} />
        <LabeledText label="eMail" value={user.email} />
        {/* <Accordion>
            <AccordionPanel label="Ventas" name="ventas">
              <ListVentas idVendedor={id} nombreVendedor={user.nombre} wide />
            </AccordionPanel>
            <AccordionPanel label="Consigna" name="consigna">
              Aquí irían los libros que este vendedor tiene en consigna en las
              librerías
            </AccordionPanel>
          </Accordion> */}
      </>
    </Layout>
  );
};

export default ShowUser;
