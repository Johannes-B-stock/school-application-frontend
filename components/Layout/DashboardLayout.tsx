import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import PageContentContext from "@/context/PageContentContext";

export default function DashboardLayout({
  title,
  keywords,
  description,
  children,
}: {
  title?: string;
  keywords?: string;
  description?: string;
  children?: any;
}) {
  const { pageContent } = useContext(PageContentContext);

  return (
    <div className="content-wrapper">
      <Head>
        <title>{title ?? pageContent?.pageTitle + " - Admin"}</title>
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
        {children}
      </div>
      <Footer />
    </div>
  );
}
