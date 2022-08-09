import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import PageContentContext from "@/context/PageContentContext";
import { useContext } from "react";

export default function ContactPage() {
  const { pageContent } = useContext(PageContentContext);

  return (
    <section className="hero is-fullheight">
      <div className="hero-body">
        <div className="container has-text-centered">
          <div className="columns is-8 is-variable ">
            <div className="column is-two-thirds has-text-left">
              <h1 className="title is-1">Contact Us</h1>
              <p className="is-size-4">
                {pageContent?.contact ? (
                  pageContent.contact
                ) : (
                  <>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nulla eligendi soluta voluptate facere molestiae
                    consequatur.
                  </>
                )}
              </p>
              <div className="social-media">
                {pageContent?.facebookLink && (
                  <a
                    href={pageContent.facebookLink}
                    target="_blank"
                    rel="noreferrer"
                    className="button is-light is-large"
                  >
                    <FontAwesomeIcon icon={faFacebook} aria-hidden="true" />
                  </a>
                )}
                {pageContent?.instagramLink && (
                  <a
                    href={pageContent?.instagramLink}
                    target="_blank"
                    rel="noreferrer"
                    className="button is-light is-large"
                  >
                    <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                  </a>
                )}
                {pageContent?.twitterLink && (
                  <a
                    href={pageContent.twitterLink}
                    target="_blank"
                    rel="noreferrer"
                    className="button is-light is-large"
                  >
                    <FontAwesomeIcon icon={faTwitter} aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
            <div className="column is-one-third has-text-left">
              <div className="field">
                <label className="label">Name</label>
                <div className="control">
                  <input className="input is-medium" type="text" />
                </div>
              </div>
              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input className="input is-medium" type="text" />
                </div>
              </div>
              <div className="field">
                <label className="label">Message</label>
                <div className="control">
                  <textarea className="textarea is-medium"></textarea>
                </div>
              </div>
              <div className="control">
                <button
                  type="submit"
                  className="button is-link is-fullwidth has-text-weight-medium is-medium"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
