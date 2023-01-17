import { confirmed as t } from "@/i18n";
import { useLocale } from "i18n/useLocale";
import Link from "next/link";

export default function ConfirmedPage() {
  const locale = useLocale();

  return (
    <section className="section hero">
      <div className="columns is-centered has-text-centered ">
        <div className="column is-7 box p-6 hero has-background-success-light">
          <h1 className="title is-4">{t[locale].title}</h1>
          <p>{t[locale].text1}</p>
          <p>
            {t[locale].textBeforeLogin}
            <Link href="/account/login">
              <a>{t[locale].login}</a>
            </Link>
            {t[locale].textAfterLogin}
          </p>
        </div>
      </div>
    </section>
  );
}
