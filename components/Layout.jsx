import Head from "next/head";
import Header from "./Header";
import "bulma/css/bulma.css";
import Footer from "./Footer";
import { useRouter } from "next/router";
import Showcase from "./Showcase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ title, keywords, description, children }) {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
      </Head>
      <Header />
      {router.pathname === "/" && <Showcase />}
      <section className="section">
        <div className="container">{children}</div>
      </section>

      <ToastContainer />
      <Footer />
    </div>
  );
}

Layout.defaultProps = {
  title: "School Application | Apply for schools",
  description: "Apply for schools and manage your schools",
  keywords: "ywam, school application, base, university",
};
