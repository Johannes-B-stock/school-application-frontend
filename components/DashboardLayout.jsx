import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import "react-toastify/dist/ReactToastify.css";

export default function DashboardLayout({
  title,
  keywords,
  description,
  children,
}) {
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
      {children}
      <Footer />
    </div>
  );
}

DashboardLayout.defaultProps = {
  title: "School Application | Apply for schools",
  description: "Apply for schools and manage your schools",
  keywords: "ywam, school application, base, university",
};
