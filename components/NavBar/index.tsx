import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames';
import {
  Navbar,
  Nav,
  // UncontrolledDropdown,
  // DropdownToggle,
  // DropdownMenu,
  // DropdownItem,
} from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';

import styles from './styles.module.css';

export default function NavBar() {
  const [isOpen, setOpen] = useState(false);
  // const { isAuthenticated, loginWithPopup, logout, user } = useAuth0();
  // const { locale, setLocale, locales } = useIntl();
  function toggle() {
    setOpen(!isOpen);
  }

  return (
    <div>
      <Navbar expand="md" bg="light" className={styles.navbar}>
        <Link href="/">
          <a className={classNames('navbar-brand', styles.navbrand)}>
            <Image
              src="/La Corazon.png"
              alt="La Corazón"
              layout="fixed"
              width="20"
              height="20"
            />{' '}
            La Corazón
          </a>
        </Link>
        <Navbar.Toggle onClick={toggle} />
        <Navbar.Collapse>
          <Nav className="ml-auto" navbar>
            <Nav.Item>
              <Link href="/users" passHref>
                <Nav.Link>Usuarios</Nav.Link>
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
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

// Navigation.whyDidYouRender = true;
