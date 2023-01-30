import Image from "next/image";
import styles from "@/styles/Footer.module.css";
import { useContext } from "react";
import PageContentContext from "@/context/PageContentContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTiktok,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

export default function Socials({
  useFontAwesomeIcons = true,
}: {
  useFontAwesomeIcons?: boolean;
}) {
  const { pageContent } = useContext(PageContentContext);

  return (
    <div className="columns is-centered">
      <div className="column is-5 is-mobile">
        <div className={`${styles.socials}`}>
          <nav className="level is-mobile has-text-grey">
            {pageContent?.tiktokLink && (
              <span className="level-item has-text-centered is-3">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={pageContent.tiktokLink}
                >
                  {useFontAwesomeIcons ? (
                    <FontAwesomeIcon icon={faTiktok} size="lg" />
                  ) : (
                    <Image
                      src="/images/tiktok.png"
                      alt=""
                      width="27px"
                      height="27px"
                    />
                  )}
                </a>
              </span>
            )}
            {pageContent?.facebookLink && (
              <span className="level-item has-text-centered">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={pageContent.facebookLink}
                >
                  {useFontAwesomeIcons ? (
                    <FontAwesomeIcon icon={faFacebook} size="lg" />
                  ) : (
                    <Image
                      src="/images/facebook.png"
                      alt=""
                      width="27px"
                      height="27px"
                    />
                  )}
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
                  {useFontAwesomeIcons ? (
                    <FontAwesomeIcon icon={faTwitter} size="lg" />
                  ) : (
                    <Image
                      src="/images/twitter.png"
                      alt=""
                      width="27px"
                      height="27px"
                    />
                  )}
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
                  {useFontAwesomeIcons ? (
                    <FontAwesomeIcon icon={faInstagram} size="lg" />
                  ) : (
                    <Image
                      src="/images/instagram.png"
                      alt=""
                      width="27px"
                      height="27px"
                    />
                  )}
                </a>
              </span>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
