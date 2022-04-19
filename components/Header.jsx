import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="https://bulma.io">
          {/* <Image
            alt="logo"
            src="https://bulma.io/images/bulma-logo.png"
            width="112"
            height="28"
          /> */}
        </a>

        <a
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <Link href="/">
            <a className="navbar-item">Home</a>
          </Link>
          {user && (
            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">Profile</a>

              <div className="navbar-dropdown">
                <Link href="/applications">
                  <a className="navbar-item">My Applications</a>
                </Link>
                <Link href="/schools">
                  <a className="navbar-item">My Schools</a>
                </Link>
                <hr className="navbar-divider"></hr>
                <a className="navbar-item" onClick={logout}>
                  Logout
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {user ? (
                <></>
              ) : (
                <>
                  <Link href="/account/login">
                    <a className="button is-light">Login</a>
                  </Link>
                  <Link href="/account/register">
                    <a className="button is-primary">Register</a>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
