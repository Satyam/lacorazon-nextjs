import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames';
import {
  Navbar,
  Nav,
  Container,
  // UncontrolledDropdown,
  // DropdownToggle,
  // DropdownMenu,
  // DropdownItem,
} from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';
import type { User } from 'data/types';
import styles from './styles.module.css';

export default function NavBar({ user }: { user?: User }) {
  // const { isAuthenticated, loginWithPopup, logout, user } = useAuth0();
  // const { locale, setLocale, locales } = useIntl();
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
            <Nav className="ml-auto" navbar>
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
            <Nav className="justify-content-end">
              <Nav.Item>
                {user?.id ? (
                  user.nombre
                ) : (
                  <Link href="/login?return=/" passHref>
                    <Nav.Link>Login</Nav.Link>
                  </Link>
                )}
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

// Navigation.whyDidYouRender = true;
