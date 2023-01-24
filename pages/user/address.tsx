import GoogleSpinner from "@/components/common/GoogleSpinner";
import AddressEdit from "@/components/user/AddressEdit";
import ProfileHeaderCard from "@/components/user/ProfileHeaderCard";
import ProfileSidebar from "@/components/user/ProfileSidebar";
import AuthContext from "@/context/AuthContext";
import { parseCookie } from "lib/utils";
import { address } from "@/i18n";
import styles from "@/styles/ProfilePage.module.css";
import { GetServerSideProps } from "next";
import { useContext, useMemo, useState } from "react";
import { useLocale } from "i18n/useLocale";
import { getEmergencyAddress, getMainAddress } from "lib/address";

export default function AddressPage({ token }: { token: string }) {
  const { user } = useContext(AuthContext);
  const [mainAddress, setMainAddress] = useState(getMainAddress(user));
  const [emergencyAddress, setEmergencyAddress] = useState(
    getEmergencyAddress(user)
  );
  const locale = useLocale();

  useMemo(() => {
    setEmergencyAddress(getEmergencyAddress(user));
    setMainAddress(getMainAddress(user));
  }, [user]);

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
          <h1 className="title">{address[locale].addresses}</h1>
          <div className={`card ${styles.profileCard}`}>
            <div className="card-header background-gradient-primary-info">
              <div className="card-header-title">
                {address[locale].myAddress}
              </div>
            </div>
            <div className="card-content">
              {user && (
                <AddressEdit
                  token={token}
                  user={user}
                  address={mainAddress}
                  addressId={mainAddress?.id}
                />
              )}
            </div>
          </div>
          <br />
          <div className={`card ${styles.profileCard}`}>
            <div className="card-header background-gradient-primary-info">
              <div className="card-header-title">
                {address[locale].emergencyContact}
              </div>
            </div>
            <div className="card-content">
              {user && (
                <AddressEdit
                  token={token}
                  user={user}
                  address={emergencyAddress}
                  addressId={emergencyAddress?.id}
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { token } = parseCookie(req);

  return {
    props: { token: token ?? null },
  };
};
