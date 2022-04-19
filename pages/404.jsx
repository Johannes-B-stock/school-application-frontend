import Link from "next/link";
import Layout from "@/components/Layout";

export default function NotFoundPage() {
  return (
    <Layout title="Page not Found">
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
