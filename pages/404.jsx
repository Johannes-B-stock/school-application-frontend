import Link from "next/link";
import Layout from "@/components/Layout";
import getPageContent from "lib/pageContent";

export default function NotFoundPage({ pageContent }) {
  return (
    <Layout title="Page not Found" pageContent={pageContent}>
      <section className="hero is-danger">
        <div className="hero-body">
          <p className="title">404 Page not found</p>
          <p className="subtitle">Oops, there is nothing here to see...</p>
          <p>
            <Link href="/">
              <a className="is-primary">Back Home</a>
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const pageContent = await getPageContent();
  return {
    props: { pageContent },
  };
}
