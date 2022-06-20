import ProfileHeaderCard from "@/components/ProfileHeaderCard";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import ProfileSidebar from "@/components/ProfileSidebar";
import axios from "axios";
import { API_URL } from "@/config/index";
import { parseCookie } from "@/helpers/index";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";

export default function Settings({ req }) {
  const { user, logout } = useContext(AuthContext);
  const { token } = parseCookie(req);
  const { theme, setTheme } = useTheme();

  const router = useRouter();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else setTheme("light");
  };

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

        <div className="column is-7">
          <h1 className="title is-3">Settings</h1>
          <div className="box">
            <h2 className="title is-5">Appearance</h2>
            <div className="mb-3"></div>
            <div className="field">
              <label htmlFor="switchRoundedDefault">Dark mode </label>
              <input
                id="switchRoundedDefault"
                type="checkbox"
                name="switchRoundedDefault"
                className="switch is-rounded"
                checked={theme === "light" ? true : false}
                onClick={toggleTheme}
              />
              <label htmlFor="switchRoundedDefault">Light mode</label>
            </div>
          </div>
          <div className="box has-background-warning-light">
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
