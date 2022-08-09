import MySchoolItem from "@/components/school/MySchoolItem";
import NotAuthorized from "@/components/auth/NotAuthorized";
import AuthContext from "@/context/AuthContext";
import { useContext } from "react";
import axios from "axios";
import { parseCookie } from "@/helpers/index";
import { API_URL } from "@/config/index";
import qs from "qs";

export default function MySchools({ schools }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <NotAuthorized />;
  }
  return (
    <section className="section">
      <div className="level has-text-centered">
        <div className="level-item">
          <p className="title">My Schools</p>
        </div>
      </div>
      {schools.length === 0 ? (
        <p className="subtitle">You are not part of any school yet</p>
      ) : (
        schools.map((school) => (
          <MySchoolItem key={school.id} school={school} />
        ))
      )}
      <br />
    </section>
  );
}

export async function getServerSideProps({ req }) {
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
    const me = await axios.get(`${API_URL}/api/users/me?${query}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      props: {
        schools: me.data.schools ?? null,
      },
    };
  } catch (error) {
    return {
      props: {
        error: error.message ?? error,
      },
    };
  }
}
