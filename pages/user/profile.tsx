import AuthContext from "@/context/AuthContext";
import { useContext } from "react";
import styles from "@/styles/ProfilePage.module.css";
import { parseCookie } from "@/helpers/index";
import ProfileHeaderCard from "@/components/user/ProfileHeaderCard";
import ProfileSidebar from "@/components/user/ProfileSidebar";
import GoogleSpinner from "@/components/common/GoogleSpinner";
import UserProfileEdit from "@/components/user/UserProfileEdit";
import UserDetailsEdit from "@/components/user/UserDetailsEdit";
import { profile } from "@/i18n";
import { useRouter } from "next/router";

export default function ProfilePage({ token }) {
  const { user } = useContext(AuthContext);
  const { locale } = useRouter();

  if (!user) {
    return <GoogleSpinner />;
  }

  return (
    <>
      <ProfileHeaderCard user={user} />
      <div className="columns">
        <div className="column is-3">
          <ProfileSidebar />
        </div>
        <div className="column">
          <h1 className="title">{profile[locale].header}</h1>
          <div className={`card ${styles.profileCard}`}>
            <div className="card-header background-gradient-primary-info">
              <div className="card-header-title">
                {profile[locale].profileInfo}
              </div>
            </div>
            <div className="card-content">
              <UserProfileEdit token={token} user={user} />
            </div>
          </div>
          <br />
          <div className={`card ${styles.profileCard}`}>
            <div className="card-header background-gradient-primary-info">
              <div className="card-header-title">
                {profile[locale].personal}
              </div>
            </div>
            <div className="card-content">
              <UserDetailsEdit token={token} userDetails={user.details} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = parseCookie(req);

  return {
    props: { token: token ?? null },
  };
}
