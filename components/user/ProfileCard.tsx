import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBirthdayCake,
  faEnvelope,
  faFlag,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import styles from "@/styles/ProfilePage.module.css";
import { User } from "api-definitions/backend";
import { allNationalities } from "lib/countries";
import { useLocale } from "i18n/useLocale";
import { defaultAvatarPath } from "@/config/index";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import { isAdmin } from "lib/common";

export default function ProfileCard({ userProfile }: { userProfile: User }) {
  const locale = useLocale();
  const { user } = useContext(AuthContext);

  return (
    <div className={`box ${styles.profileBox} backgroundGradient`}>
      <div className="image is-130x130 is-rounded my-4">
        <Image
          className="image is-130x130 is-rounded"
          alt="Profile"
          src={
            userProfile?.picture?.formats.small?.url ??
            userProfile?.picture?.formats.thumbnail?.url ??
            userProfile?.picture?.url ??
            defaultAvatarPath
          }
          width="130px"
          height="130px"
          objectFit="cover"
        />
      </div>
      <h1 className="title is-3">{userProfile.username}</h1>
      <h3 className="is-6 has-text-grey mb-5">{userProfile.role?.name}</h3>
      <div className="has-text-left">
        <div className="columns is-mobile">
          <div className="column is-2 has-text-right has-text-weight-bold">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className="column">
            {userProfile?.firstname} {userProfile?.lastname}{" "}
          </div>
        </div>
        <div className="columns is-mobile">
          <div className="column is-2 has-text-right has-text-weight-bold">
            <FontAwesomeIcon icon={faFlag} />
          </div>
          <div className="column">
            {userProfile?.details?.nationality
              ? allNationalities.getName(
                  userProfile.details.nationality,
                  locale
                )
              : " "}
          </div>
        </div>

        <div className="columns is-mobile">
          <div className="column is-2 has-text-right has-text-weight-bold">
            <FontAwesomeIcon icon={faEnvelope} />
          </div>
          <div className="column">{userProfile?.email}</div>
        </div>
        <div className="columns is-mobile">
          <div className="column is-2 has-text-right has-text-weight-bold">
            <FontAwesomeIcon icon={faBirthdayCake} />
          </div>
          <div className="column">
            {userProfile?.birthday
              ? new Date(userProfile.birthday).toLocaleDateString()
              : "-"}
          </div>
        </div>
      </div>
    </div>
  );
}
