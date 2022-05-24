import Layout from "@/components/Layout";
import ApplicationItem from "@/components/ApplicationItem";
import { API_URL } from "@/config/index";
import qs from "qs";
import { parseCookie } from "@/helpers/index";
import ProfileHeaderCard from "@/components/ProfileHeaderCard";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import ProfileSidebar from "@/components/ProfileSidebar";

export default function ApplicationsPage({ applications, token }) {
  const { user } = useContext(AuthContext);
  return (
    <Layout>
      <ProfileHeaderCard user={user} />
      <div className="columns">
        <div className="column is-3">
          <ProfileSidebar />
        </div>
        <div className="column">
          <div className="content">
            <h1>My Applications</h1>
            {applications.length === 0 && (
              <h3>you don&apos;t have any open applications yet</h3>
            )}
            <div className="columns is-multiline is-variable">
              {applications &&
                applications.map((application) => (
                  <div
                    key={application.id}
                    className={`column ${
                      applications.length > 3 && "is-4-tablet is-3-desktop"
                    }`}
                  >
                    <ApplicationItem
                      key={application.id}
                      application={application}
                      token={token}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = parseCookie(req);
  const query = qs.stringify(
    {
      sort: ["createdAt"],
      populate: "school",
    },
    {
      encodeValuesOnly: true,
    }
  );
  const res = await fetch(`${API_URL}/api/school-applications/me?${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await res.json();
  const applications = result.data.map((data) => ({
    id: data.id,
    ...data.attributes,
  }));

  return {
    props: { applications: applications, token },
  };
}
