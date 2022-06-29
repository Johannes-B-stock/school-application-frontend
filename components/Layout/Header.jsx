import Link from "next/link";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import PageContentContext from "@/context/PageContentContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { pageContent } = useContext(PageContentContext);
  const [brandImage, setBrandImage] = useState(null);
  const [brandWidth, setBrandWidth] = useState("112");
  const [brandHeight, setBrandHeight] = useState("112");

  useEffect(() => {
    setBrandImage(
      pageContent.navbar_brand?.data?.attributes?.formats.thumbnail.url ??
        pageContent.brandImage
    );
    setBrandWidth(
      pageContent.navbar_brand?.data?.attributes?.formats.thumbnail.width ??
        "112"
    );
    setBrandHeight(
      pageContent.navbar_brand?.data?.attributes?.formats.thumbnail.height ??
        "112"
    );
  }, [pageContent]);

  const [isActive, setisActive] = useState(false);
  return (
    <nav
      className="navbar is-spaced"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container is-max-widescreen">
        <div className="navbar-brand">
          <Link href="/">
            <a className="navbar-item">
              {brandImage && (
                <Image
                  alt="logo"
                  src={brandImage}
                  width={brandWidth}
                  height={brandHeight}
                  objectFit="cover"
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
          <div className="navbar-end">
            {user &&
              (user.role?.name.toLowerCase() === "schooladmin" ||
                user.role?.name.toLowerCase() === "admin") && (
                <Link href="/admin/dashboard">
                  <a className="navbar-item mx-2">Admin</a>
                </Link>
              )}
            <Link href="/">
              <a className="navbar-item mx-2">Home</a>
            </Link>
            <Link href="/user/schools">
              <a className="navbar-item mx-2">Schools</a>
            </Link>
            {user && (
              <div className="navbar-item mx-4 has-dropdown is-hoverable">
                <div className="image avatarOuter is-38x38 is-rounded">
                  <Image
                    className="image avatarInner is-38x38 is-rounded "
                    alt="Profile"
                    src={
                      user.picture?.formats.thumbnail.url ??
                      "/images/defaultAvatar.png"
                    }
                    width="38"
                    height="38"
                    objectFit="cover"
                  />
                </div>

                <div className="navbar-dropdown is-right">
                  <Link href="/user/profile">
                    <a className="navbar-item">Profile</a>
                  </Link>
                  <Link href="/user/applications">
                    <a className="navbar-item">My Applications</a>
                  </Link>
                  <Link href="/user/settings">
                    <a className="navbar-item">Settings</a>
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
      </div>
    </nav>
  );
}
