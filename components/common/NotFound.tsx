import { general, notFound } from "@/i18n";
import { useRouter } from "next/router";

export default function NotFound() {
  const router = useRouter();
  return (
    <section className="hero is-danger">
      <div className="hero-body">
        <p className="title">{notFound[router.locale].title}</p>
        <p className="subtitle">{notFound[router.locale].subtitle}</p>
        <p>
          <a className="is-primary" onClick={() => router.back()}>
            {general.buttons[router.locale].back}
          </a>
        </p>
      </div>
    </section>
  );
}
