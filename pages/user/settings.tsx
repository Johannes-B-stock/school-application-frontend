import ProfileHeaderCard from "@/components/user/ProfileHeaderCard";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import ProfileSidebar from "@/components/user/ProfileSidebar";
import axios from "axios";
import { API_URL } from "@/config/index";
import { parseCookie } from "lib/utils";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { general, user as useri18n } from "@/i18n";
import { IncomingMessage } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { useLocale } from "i18n/useLocale";

export default function Settings({
  req,
}: {
  req: IncomingMessage & {
    cookies: NextApiRequestCookies;
  };
}) {
  const { user, logout } = useContext(AuthContext);
  const { token } = parseCookie(req);

  const router = useRouter();
  const locale = useLocale();

  const deleteAccount = async () => {
    if (!user) {
      return;
    }

    const confirmed = confirm(
      "Do you really want to delete your account? This can not be undone and all your data will be lost."
    );
    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/users/${user.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Account was successful deleted!");

      await logout();
      router.push("/");
    } catch (error: any) {
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
          <h1 className="title is-3">{useri18n[locale].settings}</h1>
          {/* <div className="box">
            <h2 className="title is-5">{useri18n[locale].appearance}</h2>
            <div className="mb-3"></div>
            <div className="field">
              <CheckboxModeSwitch />
            </div>
          </div> */}
          <div className="box has-background-warning-light">
            <h2 className="title is-5">{useri18n[locale].deleteAccount} </h2>
            <div className="mb-3">{useri18n[locale].deleteCaution}</div>

            <div className="button is-danger" onClick={deleteAccount}>
              {general.buttons[locale].delete}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
