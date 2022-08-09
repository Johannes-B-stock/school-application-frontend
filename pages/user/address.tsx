import GoogleSpinner from "@/components/common/GoogleSpinner";
import AddressEdit from "@/components/user/AddressEdit";
import ProfileHeaderCard from "@/components/user/ProfileHeaderCard";
import ProfileSidebar from "@/components/user/ProfileSidebar";
import AuthContext from "@/context/AuthContext";
import { parseCookie } from "@/helpers/index";
import styles from "@/styles/ProfilePage.module.css";
import { useContext } from "react";

export default function AddressPage({ token }) {
  const { user } = useContext(AuthContext);

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
          <h1 className="title">Addresses</h1>
          <div className={`card ${styles.profileCard}`}>
            <div className="card-header background-gradient-primary-info">
              <div className="card-header-title">My Address</div>
            </div>
            <div className="card-content">
              {user && (
                <AddressEdit token={token} user={user} address={user.address} />
              )}
            </div>
          </div>
          <br />
          <div className={`card ${styles.profileCard}`}>
            <div className="card-header background-gradient-primary-info">
              <div className="card-header-title">Emergency Contact</div>
            </div>
            <div className="card-content">
              {user && (
                <AddressEdit
                  token={token}
                  user={user}
                  address={user.emergency_address}
                  isEmergencyAddress={true}
                />
              )}
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
