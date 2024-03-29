import styles from "@/styles/Showcase.module.css";
import PageContentContext from "@/context/PageContentContext";
import { useContext } from "react";

export default function Showcase() {
  const { pageContent } = useContext(PageContentContext);

  const showcase = pageContent?.showcase?.formats?.large?.url ?? null;

  return pageContent ? (
    <section
      className={`hero is-medium is-link has-text-centered ${styles.showcase}`}
      style={{
        backgroundImage: `url(${showcase})`,
      }}
    >
      <div className="hero-body">
        <p className="title">{pageContent?.showcaseTitle}</p>
        <p className="subtitle">{pageContent?.showcaseSubtitle}</p>
      </div>
    </section>
  ) : (
    <></>
  );
}
