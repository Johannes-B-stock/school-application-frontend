import Link from "next/link";
import Image from "next/image";
import { useContext, useState } from "react";
import AuthContext from "@/context/AuthContext";
import PageContentContext from "@/context/PageContentContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { pageContent } = useContext(PageContentContext);

  const [isActive, setisActive] = useState(false);

  return (
    <nav
      className="navbar is-spaced"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand ml-5">
        <Link href="/">
          <a className="navbar-item">
            {pageContent?.brandImage && (
              <Image
                alt="logo"
                src={pageContent?.brandImage}
                width="112"
                height="112"
              />
            )}
          </a>
        </Link>
        <a
          role="button"
          className={`navbar-burger ${isActive ? "is-active" : ""}`}
          aria-label="menu"
          onClick={() => {
            setisActive(!isActive);
          }}
          aria-expanded="false"
          data-target="burgerMenu"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div
        id="burgerMenu"
        className={`navbar-menu ml-4 ${isActive ? "is-active" : ""}`}
      >
        <div className="navbar-start">
          <Link href="/">
            <a className="navbar-item">Home</a>
          </Link>
        </div>

        <div className="navbar-end mr-5">
          {user && (
            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-item">
                <div className="image is-32x32 is-rounded">
                  <Image
                    className="image is-32x32 is-rounded"
                    alt="Profile"
                    src={
                      user.picture?.formats.thumbnail.url ??
                      "/images/defaultAvatar.png"
                    }
                    width="32"
                    height="32"
                  />
                </div>
              </a>

              <div className="navbar-dropdown is-right">
                <Link href="/user/profile">
                  <a className="navbar-item">Profile</a>
                </Link>
                <Link href="/user/applications">
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
