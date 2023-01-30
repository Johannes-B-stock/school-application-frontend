import MySchoolItem from "@/components/school/MySchoolItem";
import NotAuthorized from "@/components/auth/NotAuthorized";
import AuthContext from "@/context/AuthContext";
import { useContext } from "react";
import axios from "axios";
import { parseCookie } from "lib/utils";
import { API_URL } from "@/config/index";
import { user as useri18n } from "@/i18n";
import qs from "qs";
import { GetServerSideProps } from "next";
import { School, User } from "api-definitions/backend";
import { useLocale } from "i18n/useLocale";

export default function MySchools({ schools }: { schools: School[] }) {
  const { user } = useContext(AuthContext);
  const locale = useLocale();

  if (!user) {
    return <NotAuthorized />;
  }
  return (
    <section className="section">
      <div className="level has-text-centered">
        <div className="level-item">
          <p className="title">{useri18n[locale].mySchools}</p>
        </div>
      </div>
      {schools.length === 0 ? (
        <p className="subtitle">{useri18n[locale].noSchools}</p>
      ) : (
        <div className="columns is-multiline">
          {schools.map((school) => (
            <div key={school.id} className="column is-4-tablet">
              <MySchoolItem key={school.id} school={school} />
            </div>
          ))}
        </div>
      )}
      <br />
    </section>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  locale,
}) => {
  try {
    const { token } = parseCookie(req);
    const query = qs.stringify(
      {
        populate: {
          schools: {
            populate: ["image", "localizations"],
          },
        },
      },
      { encodeValuesOnly: true }
    );
    const me = await axios.get<User>(`${API_URL}/api/users/me?${query}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      props: {
        schools: me.data?.schools ?? [],
        locale,
      },
    };
  } catch (error: any) {
    return {
      props: {
        error: error.message ?? error,
        locale,
      },
    };
  }
};
