import { general, serverError } from "@/i18n";
import { useLocale } from "i18n/useLocale";
import { useRouter } from "next/router";

export default function ServerError({
  errorMessage,
}: {
  errorMessage?: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  return (
    <section className="hero is-danger">
      <div className="hero-body">
        <p className="title">{serverError[locale].title}</p>
        <p className="subtitle">{serverError[locale].subtitle}</p>
        <>{errorMessage}</>
        <p>
          <a className="is-primary" onClick={() => router.back()}>
            {general.buttons[locale].back}
          </a>
        </p>
      </div>
    </section>
  );
}
