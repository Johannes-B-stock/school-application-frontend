import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@/styles/AdminOverview.module.css";
import Image from "next/image";

export default function UserAvatar({ user, clickRemoveStaff }) {
  return (
    <div className={styles.user}>
      {clickRemoveStaff && (
        <a
          style={{
            display: "block",
            marginLeft: "auto",
            marginBottom: "-10px",
          }}
          className="icon has-text-danger"
          onClick={() => clickRemoveStaff(user.id)}
        >
          <FontAwesomeIcon icon={faXmark} />
        </a>
      )}
      <figure className="image is-50x50 is-rounded">
        <Image
          className="image is-50x50 is-rounded"
          alt={user.username}
          src={
            user.picture?.formats.thumbnail?.url ?? "/images/defaultAvatar.png"
          }
          objectFit="cover"
          width="50"
          height="50"
        />
      </figure>
      <span className="is-size-7">{user.username}</span>
    </div>
  );
}
