import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavLink,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
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
      <Navbar expand="md" light className={styles.navbar}>
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
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Link href="/users" passHref>
                <NavLink>Usuarios</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/distribuidores" passHref>
                <NavLink>Distribuidores</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/ventas" passHref>
                <NavLink>Ventas</NavLink>
              </Link>
            </NavItem>
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
        </Collapse>
      </Navbar>
    </div>
  );
}

// Navigation.whyDidYouRender = true;
