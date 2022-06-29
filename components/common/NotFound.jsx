import Link from "next/link";
import { useRouter } from "next/router";

export default function NotFound() {
  const router = useRouter();
  return (
    <section className="hero is-danger">
      <div className="hero-body">
        <p className="title">404 Page not found</p>
        <p className="subtitle">Oops, there is nothing here to see...</p>
        <p>
          <a className="is-primary" onClick={() => router.back()}>
            Back
          </a>
        </p>
      </div>
    </section>
  );
}
