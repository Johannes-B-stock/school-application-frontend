import Image from "next/image";
import styles from "@/styles/ProfilePage.module.css";

export default function ProfileHeaderCard({ user }) {
  return (
    <div className={`card ${styles.profileHeaderCard}`}>
      <div className="card-content">
        <div className="media">
          <div className="media-content">
            <p className="title is-3">{user?.username}</p>
            <p className="subtitle is-6">{user?.email}</p>
            <p className="is-6">Current role is {user?.role?.name}</p>
            <p className="is-6">
              Joined on {new Date(user?.createdAt).toDateString()}
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
