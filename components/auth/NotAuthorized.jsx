import { useRouter } from "next/router";
import Layout from "../Layout/Layout";

export default function NotAuthorized() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };
  return (
    <section className="section is-medium">
      <div className="hero is-danger">
        <div className="hero-body">
          <p className="title">403 Not authorized</p>
          <p className="subtitle">
            You are not authorized to access this page!
          </p>
          <p>
            <a onClick={goBack} className="is-primary">
              Go Back
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
