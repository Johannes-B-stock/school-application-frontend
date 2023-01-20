import Image from "next/image";
import styles from "@/styles/Footer.module.css";
import { useContext } from "react";
import PageContentContext from "@/context/PageContentContext";

export default function Socials() {
  const { pageContent } = useContext(PageContentContext);

  return (
    <div className="columns is-centered">
      <div className="column is-4 is-mobile">
        <div className={`${styles.socials}`}>
          <nav className="level">
            {pageContent?.facebookLink && (
              <span className="level-item has-text-centered">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={pageContent.facebookLink}
                >
                  <Image
                    src="/images/facebook.png"
                    alt=""
                    width="27px"
                    height="27px"
                  />
                </a>
              </span>
            )}
            {pageContent?.twitterLink && (
              <span className="level-item has-text-centered">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={pageContent?.twitterLink}
                >
                  <Image
                    src="/images/twitter.png"
                    alt=""
                    width="27px"
                    height="27px"
                  />
                </a>
              </span>
            )}
            {pageContent?.instagramLink && (
              <span className="level-item has-text-centered">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={pageContent?.instagramLink}
                >
                  <Image
                    src="/images/instagram.png"
                    alt=""
                    width="27px"
                    height="27px"
                  />
                </a>
              </span>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
