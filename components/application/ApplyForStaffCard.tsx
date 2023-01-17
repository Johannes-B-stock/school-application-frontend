import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/SchoolItem.module.css";
import { general, home } from "@/i18n";
import { StaffApplicationSetting } from "api-definitions/backend";
import { useLocale } from "i18n/useLocale";
import { defaultLocale } from "@/config/index";

export default function ApplyForStaffCard({
  staffApplicationDetails,
}: {
  staffApplicationDetails: StaffApplicationSetting;
}) {
  const locale = useLocale();
  const getLocalized = locale !== defaultLocale;
  if (getLocalized) {
    const localizedApplicationInfo =
      staffApplicationDetails.localizations?.find(
        (localization) => localization.locale === locale
      );
    if (localizedApplicationInfo) {
      staffApplicationDetails = localizedApplicationInfo;
    }
  }
  const image = staffApplicationDetails.cardImage?.formats.small;

  return (
    <div className={`card ${styles.schoolItem} has-background-light`}>
      {image && (
        <div className="card-image">
          <Image
            src={image.url}
            alt="staff apply image"
            objectFit="cover"
            width={image?.width ?? "800"}
            height={image?.height ?? "600"}
          />
        </div>
      )}
      <div className="card-content">
        <p className="title">{home[locale].applyForStaff}</p>

        <div className="content">
          {staffApplicationDetails.shortDescription}
          <br />
        </div>
      </div>
      <footer className="card-footer">
        <Link href={`/staff-application/details`}>
          <a className="card-footer-item">{general.buttons[locale].details}</a>
        </Link>
        <Link href={`/staff-application/create`}>
          <a className="card-footer-item">{general.buttons[locale].apply}</a>
        </Link>
      </footer>
    </div>
  );
}
