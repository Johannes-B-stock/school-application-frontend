import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/SchoolItem.module.css";
import { useRouter } from "next/router";

export default function ApplyForStaffCard({ staffApplicationDetails }) {
  const router = useRouter();
  const locale = router.locale.split("-")[0];
  const useLocale = router.locale !== router.defaultLocale;
  if (useLocale) {
    const localizedApplicationInfo =
      staffApplicationDetails.attributes.localizations.data.find(
        (localization) => localization.attributes.locale === locale
      );
    if (localizedApplicationInfo) {
      staffApplicationDetails = localizedApplicationInfo.attributes;
    }
  }
  const image =
    staffApplicationDetails.attributes.cardImage?.data?.attributes.formats
      .small;

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
        <p className="title">Apply for Staff</p>

        <div className="content">
          {staffApplicationDetails.attributes.shortDescription}
          <br />
        </div>
      </div>
      <footer className="card-footer">
        <Link href={`/staff-application/details`}>
          <a className="card-footer-item">Details</a>
        </Link>
        <Link href={`/staff-application/create`}>
          <a className="card-footer-item">Apply</a>
        </Link>
      </footer>
    </div>
  );
}
