import styles from "@/styles/Showcase.module.css";
import PageContentContext from "@/context/PageContentContext";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";

export default function Showcase() {
  const { pageContent } = useContext(PageContentContext);
  const { locale } = useRouter();

  useEffect(() => {}, [locale, pageContent]);

  return (
    pageContent && (
      <section
        className={`hero is-medium is-link has-text-centered ${styles.showcase}`}
        style={{
          backgroundImage: `url(${pageContent?.showcase})`,
        }}
      >
        <div className="hero-body">
          <p className="title">{pageContent?.showcaseTitle}</p>
          <p className="subtitle">{pageContent?.showcaseSubtitle}</p>
        </div>
      </section>
    )
  );
}
