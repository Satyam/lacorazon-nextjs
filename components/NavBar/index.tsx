import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import classNames from 'classnames';
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  // UncontrolledDropdown,
  // DropdownToggle,
  // DropdownMenu,
  // DropdownItem,
} from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';
import type { User } from 'data/types';
import { useAuth } from 'components/AuthProvider';

import styles from './styles.module.css';

export default function NavBar() {
  const { authorized, user, logout } = useAuth();
  console.log({ authorized, user });
  // const { isAuthenticated, loginWithPopup, logout, user } = useAuth0();
  // const { locale, setLocale, locales } = useIntl();
  const router = useRouter();
  const handleSelect = (eventKey: string | null) => {
    switch (eventKey) {
      case 'login':
        router.push('/login?return=/');
        break;
      case 'logout':
        logout();
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
              <Nav.Item>
                <Link href="/users" passHref>
                  <Nav.Link>Usuarios</Nav.Link>
                </Link>
              </Nav.Item>
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
              {/* <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                {locale}
              </DropdownToggle>
              <DropdownMenu right>
                {locales.map(l => (
                  <DropdownItem
                    key={l}
                    active={l === locale}
                    onClick={() => setLocale(l)}
                  >
                    {l}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
            <UncontrolledDropdown nav inNavbar>
              {isAuthenticated && user ? (
                <>
                  <DropdownToggle nav caret className={styles.user}>
                    <img src={user.picture} alt="User" />
                    {user.name}
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={() => logout()}>Logout</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem tag={Link} to="/profile">
                      Profile
                    </DropdownItem>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <DropdownToggle nav caret className={styles.user}>
                    <FaUser />
                    guest
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={() => loginWithPopup()}>
                      Login
                    </DropdownItem>
                  </DropdownMenu>
                </>
              )}
            </UncontrolledDropdown> */}
            </Nav>
            <Nav onSelect={handleSelect}>
              {user?.id ? (
                <NavDropdown title={user.nombre}>
                  <NavDropdown.Item eventKey="logout">Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <NavDropdown title="invitado">
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

// Navigation.whyDidYouRender = true;
