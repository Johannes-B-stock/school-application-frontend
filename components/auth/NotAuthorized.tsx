import { general, notAuthorized } from "@/i18n";
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
          <p className="title">{notAuthorized[router.locale].title}</p>
          <p className="subtitle">{notAuthorized[router.locale].subtitle}</p>
          <p>
            <a onClick={goBack} className="is-primary">
              {general.buttons[router.locale].back}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
