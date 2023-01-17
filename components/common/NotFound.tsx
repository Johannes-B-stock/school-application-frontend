import { general, notFound } from "@/i18n";
import { useLocale } from "i18n/useLocale";
import { useRouter } from "next/router";

export default function NotFound() {
  const router = useRouter();
  const locale = useLocale();
  return (
    <section className="hero is-danger">
      <div className="hero-body">
        <p className="title">{notFound[locale].title}</p>
        <p className="subtitle">{notFound[locale].subtitle}</p>
        <p>
          <a className="is-primary" onClick={() => router.back()}>
            {general.buttons[locale].back}
          </a>
        </p>
      </div>
    </section>
  );
}
