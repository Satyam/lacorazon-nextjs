import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

import { FaUser } from 'react-icons/fa';
import { useAuth } from 'components/AuthProvider';

import styles from './styles.module.css';

export default function NavBar() {
  const { authorized, user, logout } = useAuth();
  const router = useRouter();
  const handleSelect = (eventKey: string | null) => {
    switch (eventKey) {
      case 'login':
        router.push('/login?return=/');
        break;
      case 'logout':
        logout();
        break;
      case 'profile':
        router.push('/profile');
        break;
    }
  };

  return (
    <div>
      <Navbar expand="md" bg="light" className={styles.navbar}>
        <Container>
          <Link href="/" passHref>
            <Navbar.Brand>
              <Image
                src="/La Corazon.png"
                alt="La Corazón"
                layout="fixed"
                width="20"
                height="20"
              />{' '}
              La Corazón
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto" navbar>
              {authorized && (
                <Nav.Item>
                  <Link href="/users" passHref>
                    <Nav.Link>Usuarios</Nav.Link>
                  </Link>
                </Nav.Item>
              )}
              <Nav.Item>
                <Link href="/vendedores" passHref>
                  <Nav.Link>Vendedores</Nav.Link>
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link href="/distribuidores" passHref>
                  <Nav.Link>Distribuidores</Nav.Link>
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link href="/ventas" passHref>
                  <Nav.Link>Ventas</Nav.Link>
                </Link>
              </Nav.Item>
            </Nav>
            <Nav onSelect={handleSelect}>
              {user?.id ? (
                <NavDropdown title={user.nombre}>
                  <NavDropdown.Item eventKey="logout">Logout</NavDropdown.Item>
                  <NavDropdown.Item eventKey="profile">
                    Profile
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <NavDropdown
                  title={
                    <>
                      <FaUser /> invitado
                    </>
                  }
                >
                  <NavDropdown.Item eventKey="login">Login</NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
