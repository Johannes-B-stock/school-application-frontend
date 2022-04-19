import Layout from "@/components/Layout";
import ApplicationItem from "@/components/ApplicationItem";
import { API_URL } from "@/config/index";
import qs from "qs";
import { parseCookie } from "@/helpers/index";

export default function ApplicationsPage({ applications }) {
  return (
    <Layout>
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
                />
              </div>
            ))}
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
  console.log(result.data);
  const applications = result.data.map((data) => ({
    id: data.id,
    ...data.attributes,
  }));

  return {
    props: { applications: applications },
  };
}
