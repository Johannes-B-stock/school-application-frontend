import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBirthdayCake,
  faEnvelope,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import styles from "@/styles/ProfilePage.module.css";

export default function ProfileCard({ user }) {
  return (
    <div className={`box ${styles.profileBox} backgroundGradient`}>
      <div className="image is-130x130 is-rounded my-4">
        <Image
          className="image is-130x130 is-rounded"
          alt="Profile"
          src={user?.picture?.formats.small.url ?? "/images/defaultAvatar.png"}
          width="130px"
          height="130px"
          objectFit="cover"
        />
      </div>
      <h1 className="title is-3">{user.username}</h1>
      <h3 className="is-6 has-text-grey mb-5">{user.role?.name}</h3>
      <div className="has-text-left">
        <div className="columns">
          <div className="column is-2 has-text-right has-text-weight-bold">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className="column">
            {user?.firstname} {user?.lastname}{" "}
          </div>
        </div>
        <div className="columns">
          <div className="column is-2 has-text-right has-text-weight-bold">
            <FontAwesomeIcon icon={faEnvelope} />
          </div>
          <div className="column">{user?.email}</div>
        </div>
        <div className="columns">
          <div className="column is-2 has-text-right has-text-weight-bold">
            <FontAwesomeIcon icon={faBirthdayCake} />
          </div>
          <div className="column">
            {user?.birthday
              ? new Date(user.birthday).toLocaleDateString()
              : "-"}
          </div>
        </div>
      </div>
    </div>
  );
}
