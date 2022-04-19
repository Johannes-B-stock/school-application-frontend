import Layout from "@/components/Layout";

export default function ContactPage() {
  return (
    <Layout>
      <section className="hero is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="columns is-8 is-variable ">
              <div className="column is-two-thirds has-text-left">
                <h1 className="title is-1">Contact Us</h1>
                <p className="is-size-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla
                  eligendi soluta voluptate facere molestiae consequatur.
                </p>
                <div className="social-media">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="button is-light is-large"
                  >
                    <i className="fa fa-facebook-square" aria-hidden="true"></i>
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="button is-light is-large"
                  >
                    <i className="fa fa-instagram" aria-hidden="true"></i>
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="button is-light is-large"
                  >
                    <i className="fa fa-twitter" aria-hidden="true"></i>
                  </a>
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
    </Layout>
  );
}
