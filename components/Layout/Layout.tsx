import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import { useRouter } from "next/router";
import Showcase from "./Showcase";
import "react-toastify/dist/ReactToastify.css";
import { ReactElement, useContext } from "react";
import PageContentContext from "@/context/PageContentContext";

export default function Layout({
  title,
  keywords,
  description,
  children,
}: {
  title?: string;
  keywords?: string;
  description?: string;
  children: ReactElement;
}) {
  const { pageContent } = useContext(PageContentContext);
  const router = useRouter();

  return (
    <div className="content-wrapper">
      <Head>
        <title>{title ?? pageContent?.pageTitle}</title>
        <meta
          name="description"
          content={description ?? pageContent?.pageDescription}
        />
        <meta name="keywords" content={keywords ?? pageContent?.pageKeywords} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
      </Head>
      <div className="page-content">
        <Header />
        {router.pathname === "/" && <Showcase />}
        <section className="section">
          <div className="container is-max-widescreen">{children}</div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
