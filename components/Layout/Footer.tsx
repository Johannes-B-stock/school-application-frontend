import PageContentContext from "@/context/PageContentContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { MouseEvent, useContext, useState } from "react";
import styles from "@/styles/Footer.module.css";
import { footer } from "@/i18n";
import AnimatedModeSwitch from "./AnimatedModeSwitch";
import { useLocale } from "i18n/useLocale";
import { LOCALES } from "@/config/index";
import Socials from "./Socials";

export default function Footer() {
  const router = useRouter();
  const locale = useLocale();
  const [langActive, setLangActive] = useState(false);
  const { triggerSetPageContent } = useContext(PageContentContext);

  const changeLocale = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const locale = e.currentTarget.getAttribute("data-value");
    if (!locale) {
      return;
    }
    document.cookie = `NEXT_LOCALE=${locale};path=/`;
    triggerSetPageContent(locale as "en" | "de");
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
                <Link href="/impressum">{footer[locale].impressum}</Link>
              </div>
              <div className="level-item has-text-centered mx-3">
                <Link href="/privacy">{footer[locale].privacy}</Link>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item has-text-centered mx-3">
                <Link href="/about">{footer[locale].about}</Link>
              </div>
              <div className="level-item has-text-centered mx-3">
                <Link href="/contact">{footer[locale].contact}</Link>
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
                      <span>{locale}</span>
                    </button>
                  </div>
                  <div
                    className={`dropdown-menu ${styles.dropdownMenu}`}
                    id="dropdown-menu"
                    role="menu"
                  >
                    <div className="dropdown-content">
                      {LOCALES.map((locale, index) => (
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
          <Socials />
          <AnimatedModeSwitch size={30} />

          <p className="has-text-grey is-size-6">&copy; Johannes Birkenstock</p>
        </div>
      </div>
    </footer>
  );
}
