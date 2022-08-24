import { notConfirmed as t } from "@/i18n";
import Link from "next/link";
import { useRouter } from "next/router";

export default function NotConfirmedPage() {
  const { locale } = useRouter();
  return (
    <section className="section hero">
      <div className="columns is-centered has-text-centered ">
        <div className="column is-7 box p-6 hero is-warning">
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
