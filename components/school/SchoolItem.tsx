import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/SchoolItem.module.css";
import { useRouter } from "next/router";
import { general, home } from "@/i18n";

export default function SchoolItem({ school }) {
  const router = useRouter();
  const locale = router.locale.split("-")[0];
  const useLocale = router.locale !== router.defaultLocale;
  let schoolInfo = school;
  if (useLocale) {
    const localizedSchool = school.localizations.data.find(
      (schoolLocalization) => schoolLocalization.attributes.locale === locale
    );
    if (localizedSchool) {
      schoolInfo = localizedSchool.attributes;
    }
  }

  return (
    <div className={`card ${styles.schoolItem}`}>
      <div className="card-image">
        <Image
          src={
            school.image?.url ? school.image?.url : "/images/school-default.png"
          }
          alt="school image"
          objectFit="cover"
          width={school.image?.width ?? "800"}
          height={school.image?.height ?? "600"}
        />
      </div>
      <div className="card-content">
        <p className="title">{schoolInfo.name}</p>
        <p className="subtitle is-7">
          <span className="is-italic">
            {new Date(school.startDate).toLocaleDateString(locale)}
          </span>
          {home[locale].dateRange}
          <span className="is-italic">
            {new Date(school.endDate).toLocaleDateString(locale)}
          </span>
        </p>
        <div className="content">
          {schoolInfo.description}
          <br />
        </div>
      </div>
      <footer className="card-footer">
        <Link href={`/schools/${school.id}`}>
          <a className="card-footer-item">{general.buttons[locale].details}</a>
        </Link>
        {school.acceptingStudents ? (
          <Link href={`/schools/${school.id}/apply`}>
            <a className="card-footer-item">{general.buttons[locale].apply}</a>
          </Link>
        ) : (
          <span className="card-footer-item">
            {general.buttons[locale].apply}
          </span>
        )}
      </footer>
    </div>
  );
}
