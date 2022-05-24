import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Footer() {
  const router = useRouter();
  const [langActive, setLangActive] = useState(false);

  const changeLocale = (e) => {
    e.preventDefault();
    const value = e.target.getAttribute("value");

    const { pathname, asPath, query } = router;
    // change just the locale and maintain all other route information including href's query
    router.push({ pathname, query }, asPath, { locale: value });
    setLangActive(false);
  };

  const handleLangClick = () => {
    setLangActive(!langActive);
  };

  return (
    <footer className="footer">
      <div className="container is-max-widescreen">
        <div className="content has-text-centered">
          <nav className="level">
            <div className="level-left">
              <div className="level-item has-text-centered mx-3">
                <Link href="/about">About</Link>
              </div>
              <div className="level-item has-text-centered mx-3">
                <Link href="/contact">Contact</Link>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <div
                  className={`dropdown is-right ${langActive && "is-active"}`}
                  onClick={handleLangClick}
                >
                  <div className="dropdown-trigger">
                    <button
                      className="button is-text"
                      aria-haspopup="true"
                      aria-controls="dropdown-menu"
                    >
                      <span>{router.locale}</span>
                      <span className="icon is-small">
                        <i className="fas fa-angle-down" aria-hidden="true"></i>
                      </span>
                    </button>
                  </div>
                  <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                      {router.locales.map((locale, index) => (
                        <a
                          value={locale}
                          key={index}
                          onClick={changeLocale}
                          className="dropdown-item"
                        >
                          {locale}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <p className="has-text-grey is-size-6">&copy; Johannes Birkenstock</p>
        </div>
      </div>
    </footer>
  );
}
