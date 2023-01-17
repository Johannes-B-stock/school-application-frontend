import { general, notAuthorized } from "@/i18n";
import { useLocale } from "i18n/useLocale";
import { useRouter } from "next/router";

export default function NotAuthorized() {
  const router = useRouter();
  const locale = useLocale();

  const goBack = () => {
    router.back();
  };
  return (
    <section className="section is-medium">
      <div className="hero is-danger">
        <div className="hero-body">
          <p className="title">{notAuthorized[locale].title}</p>
          <p className="subtitle">{notAuthorized[locale].subtitle}</p>
          <p>
            <a onClick={goBack} className="is-primary">
              {general.buttons[locale].back}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
