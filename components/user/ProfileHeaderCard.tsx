import Image from "next/image";
import styles from "@/styles/ProfilePage.module.css";
import { profile } from "@/i18n";
import { User } from "api-definitions/backend";
import { useLocale } from "i18n/useLocale";
import { defaultAvatarPath } from "@/config/index";

export default function ProfileHeaderCard({ user }: { user?: User }) {
  const locale = useLocale();
  const joinedAt = user?.createdAt
    ? new Date(user?.createdAt).toLocaleDateString(locale, {
        dateStyle: "long",
      })
    : "undefined";

  return (
    <div className={`card ${styles.profileHeaderCard}`}>
      <div className="card-content">
        <div className="media">
          <div className="media-content">
            <p className="title is-3">{user?.username}</p>
            <p className="subtitle is-6">{user?.email}</p>
            <p className="is-6">
              {profile[locale].role.replace(
                "{0}",
                user?.role?.name ?? "undefined"
              )}
            </p>
            <p className="is-6">
              {profile[locale].joined.replace("{0}", joinedAt)}
            </p>
          </div>
          <div className="media-right">
            <figure className="image is-128x128 is-rounded">
              <Image
                className="image is-128x128 is-rounded"
                alt="Profile"
                src={
                  user?.picture?.formats?.small?.url ??
                  user?.picture?.formats?.thumbnail?.url ??
                  user?.picture?.url ??
                  defaultAvatarPath
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
