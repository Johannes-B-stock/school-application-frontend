import Image from "next/image";
import styles from "@/styles/ProfilePage.module.css";
import { useRouter } from "next/router";
import { profile } from "@/i18n";

export default function ProfileHeaderCard({ user }) {
  const { locale } = useRouter();
  return (
    <div className={`card ${styles.profileHeaderCard}`}>
      <div className="card-content">
        <div className="media">
          <div className="media-content">
            <p className="title is-3">{user?.username}</p>
            <p className="subtitle is-6">{user?.email}</p>
            <p className="is-6">
              {profile[locale].role.replace("{0}", user?.role?.name)}
            </p>
            <p className="is-6">
              {profile[locale].joined.replace(
                "{0}",
                new Date(user?.createdAt).toLocaleDateString(locale, {
                  dateStyle: "long",
                })
              )}
            </p>
          </div>
          <div className="media-right">
            <figure className="image is-128x128 is-rounded">
              <Image
                className="image is-128x128 is-rounded"
                alt="Profile"
                src={
                  user?.picture?.formats.small?.url ??
                  user?.picture?.formats.thumbnail?.url ??
                  "/images/defaultAvatar.png"
                }
                layout="fill"
                objectFit="cover"
              />
            </figure>
          </div>
        </div>
        <div className="content">
          <p></p>
        </div>
      </div>
    </div>
  );
}
