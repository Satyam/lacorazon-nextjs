import { ReactNode } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Head from 'next/head';
import Navbar from 'components/NavBar';
import styles from './styles.module.css';

export default function Layout({
  wide,
  children,
  title,
  heading,
  action,
}: {
  wide?: boolean;
  title?: string;
  heading: string;
  action?: React.ReactNode;
  children: ReactNode;
}) {
  const t = title ? `La Corazón - ${title}` : 'La Corazón';
  return (
    <>
      <Head>
        <title>{t}</title>
        <meta name="description" content={t} />
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
          <Col sm="12" md={{ span: wide ? 12 : 8, offset: wide ? 0 : 2 }}>
            <div className={styles.spacing}>
              <h1 className={styles.heading}>{heading}</h1>
              {action && <div className={styles.action}>{action}</div>}
            </div>
            <main className={styles.clear}>{children}</main>
          </Col>
        </Row>
      </Container>
    </>
  );
}
