import { ReactNode } from 'react';
import { Container, Row, Col } from 'reactstrap';
import Head from 'next/head';
import Navbar from 'components/NavBar';
import styles from './styles.module.css';

export default function Layout({
  wide,
  children,
  title,
  heading,
  action,
  error,
}: {
  wide?: boolean;
  title?: string;
  heading: string;
  action?: React.ReactNode;
  children: ReactNode;
  error?: Error;
}) {
  return (
    <>
      <Head>
        <title>{title ? `La Corazón - ${title}` : 'La Corazón'}</title>
        <link
          rel="icon"
          sizes="200x200"
          href="/La Corazon.png"
          type="image/png"
        ></link>
      </Head>
      <Navbar />
      <Container fluid>
        <Row>
          <Col sm="12" md={{ size: wide ? 12 : 8, offset: wide ? 0 : 2 }}>
            <div className={styles.spacing}>
              <h1 className={styles.heading}>{heading}</h1>
              <div className={styles.action}>{action}</div>
            </div>
            <div className={styles.clear}>{error}</div>
            <main>{children}</main>
          </Col>
        </Row>
      </Container>
    </>
  );
}
