import ProfileHeaderCard from "@/components/ProfileHeaderCard";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import ProfileSidebar from "@/components/ProfileSidebar";
import axios from "axios";
import { API_URL } from "@/config/index";
import { parseCookie } from "@/helpers/index";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function Settings({ req }) {
  const { user, logout } = useContext(AuthContext);
  const { token } = parseCookie(req);

  const router = useRouter();

  const deleteAccount = async () => {
    const confirmed = confirm(
      "Do you really want to delete your account? This can not be undone and all your data will be lost."
    );
    if (!confirmed) {
      return;
    }

    try {
      const deleteFetch = await axios.delete(
        `${API_URL}/api/users/${user.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Account was successful deleted!");

      await logout();
      router.push("/");
    } catch (error) {
      console.log(error);
      toast.error(error.message ?? error);
    }
  };

  return (
    <>
      <ProfileHeaderCard user={user} />
      <div className="columns">
        <div className="column is-3">
          <ProfileSidebar />
        </div>

        <div className="column">
          <h1 className="title is-3">Settings</h1>
          <div
            className="box has-background-warning-light"
            style={{ maxWidth: "350px" }}
          >
            <h2 className="title is-5">Delete Account</h2>
            <div className="mb-3">
              Caution! By Clicking on this button your account will be
              completely deleted!
            </div>

            <div className="button is-danger" onClick={deleteAccount}>
              Delete
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
