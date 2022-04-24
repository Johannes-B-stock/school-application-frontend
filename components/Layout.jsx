import Head from "next/head";
import Header from "./Header";
import "bulma/css/bulma.css";
import Footer from "./Footer";
import { useRouter } from "next/router";
import Showcase from "./Showcase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({
  title,
  keywords,
  description,
  children,
  pageContent,
}) {
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
      <Header brandImage={pageContent.brandImage} />
      {router.pathname === "/" && (
        <Showcase
          imageUrl={pageContent.showcase}
          title={pageContent.showcaseTitle}
          subtitle={pageContent.showcaseSubtitle}
        />
      )}
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
  pageContent: {
    brandImage:
      "https://res.cloudinary.com/johnny-boy/image/upload/v1650448727/thumbnail_university_d8f6c86ddb.png",
    showcase:
      "https://res.cloudinary.com/johnny-boy/image/upload/v1649361607/large_showcase_85ca7afc73.png",
  },
};
