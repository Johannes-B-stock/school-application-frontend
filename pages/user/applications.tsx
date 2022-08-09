import ApplicationItem from "@/components/application/ApplicationItem";
import { API_URL } from "@/config/index";
import qs from "qs";
import { parseCookie } from "@/helpers/index";
import ProfileHeaderCard from "@/components/user/ProfileHeaderCard";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import ProfileSidebar from "@/components/user/ProfileSidebar";
import axios from "axios";
import StaffApplicationItem from "@/components/application/StaffApplicationItem";

export default function ApplicationsPage({ applications, token }) {
  const { user } = useContext(AuthContext);
  return (
    <>
      <ProfileHeaderCard user={user} />
      <div className="columns">
        <div className="column is-3">
          <ProfileSidebar />
        </div>
        <div className="column">
          <h1 className="title is-3">My Applications</h1>
          {applications.length === 0 && (
            <h3 className="subtitle is-4">
              you don&apos;t have any open applications yet
            </h3>
          )}
          <div className="columns is-multiline is-variable">
            {applications &&
              applications.map((application) => (
                <div
                  key={application.id}
                  className={`column ${
                    applications.length > 3 && "is-5-tablet is-4-desktop"
                  }`}
                >
                  {application.school != null ? (
                    <ApplicationItem
                      key={application.id}
                      application={application}
                      token={token}
                    />
                  ) : (
                    <StaffApplicationItem
                      key={application.id}
                      application={application}
                      token={token}
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = parseCookie(req);

  if (!token) {
    return { props: {} };
  }

  let query = qs.stringify(
    {
      sort: ["createdAt:desc"],
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
  const applications = result.data?.map((data) => ({
    id: data.id,
    ...data.attributes,
  }));

  query = qs.stringify(
    {
      sort: ["createdAt:desc"],
    },
    {
      encodeValuesOnly: true,
    }
  );

  const staffApplicationsFetch = await axios.get(
    `${API_URL}/api/staff-applications/me?${query}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  applications.push(
    ...staffApplicationsFetch.data.data.map((application) => ({
      id: application.id,
      ...application.attributes,
    }))
  );

  applications.sort((first, second) => {
    if (first.createdAt > second.createdAt) {
      return -1;
    }
    if (first.createdAt < second.createdAt) {
      return 1;
    }
    return 0;
  });

  return {
    props: { applications: applications ?? null, token: token ?? null },
  };
}
