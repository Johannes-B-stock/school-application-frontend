import Image from "next/image";
import styles from "@/styles/SchoolItem.module.css";
import { useRouter } from "next/router";

export default function MySchoolItem({ school }) {
  const router = useRouter();
  const locale = router.locale.split("-")[0];
  const useLocale = router.locale !== router.defaultLocale;
  let schoolInfo = school;
  if (useLocale) {
    const localizations = school.localizations?.data ?? school.localizations;
    const localizedSchool = localizations?.find(
      (schoolLocalization) =>
        schoolLocalization.attributes?.locale === locale ||
        schoolLocalization.locale === locale
    );
    if (localizedSchool) {
      schoolInfo = localizedSchool.attributes ?? localizedSchool;
    }
  }

  return (
    <div
      className={`card is-clickable ${styles.isHoverable} ${styles.schoolItem}`}
      onClick={() => router.push(`/user/school/${school.id}`)}
    >
      <div className="card-image">
        <Image
          src={school.image?.formats.small?.url ?? "/images/school-default.png"}
          alt="school image"
          objectFit="cover"
          width={school.image?.width ?? "800"}
          height={school.image?.height ?? "600"}
        />
      </div>
      <div className="card-content">
        <p className="title">{schoolInfo.name}</p>
        <p className="subtitle is-italic is-6">
          {new Date(school.startDate).toLocaleDateString(router.locale)} -{" "}
          {new Date(school.endDate).toLocaleDateString(router.locale)}
        </p>
        <div className="content">
          {schoolInfo.description}
          <br />
        </div>
      </div>
    </div>
  );
}
