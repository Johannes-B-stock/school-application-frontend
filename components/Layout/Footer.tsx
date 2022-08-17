import PageContentContext from "@/context/PageContentContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { MouseEvent, useContext, useState } from "react";
import styles from "@/styles/Footer.module.css";
import { footer } from "@/i18n";

export default function Footer() {
  const router = useRouter();
  const [langActive, setLangActive] = useState(false);
  const { triggerSetPageContent } = useContext(PageContentContext);

  const changeLocale = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const locale = e.currentTarget.getAttribute("data-value");
    document.cookie = `NEXT_LOCALE=${locale}`;
    triggerSetPageContent(locale);
    const { pathname, asPath, query } = router;
    // change just the locale and maintain all other route information including href's query
    router.push({ pathname, query }, asPath, { locale });
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
            <div className="level-left is-size-6">
              <div className="level-item has-text-centered mx-3">
                <Link href="/impressum">{footer[router.locale].impressum}</Link>
              </div>
              <div className="level-item has-text-centered mx-3">
                <Link href="/privacy">{footer[router.locale].privacy}</Link>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item has-text-centered mx-3">
                <Link href="/about">{footer[router.locale].about}</Link>
              </div>
              <div className="level-item has-text-centered mx-3">
                <Link href="/contact">{footer[router.locale].contact}</Link>
              </div>
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
                    </button>
                  </div>
                  <div
                    className={`dropdown-menu ${styles.dropdownMenu}`}
                    id="dropdown-menu"
                    role="menu"
                  >
                    <div className="dropdown-content">
                      {router.locales.map((locale, index) => (
                        <a
                          data-value={locale}
                          key={index}
                          onClick={changeLocale}
                          className={`dropdown-item ${styles.dropdownItem}`}
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
