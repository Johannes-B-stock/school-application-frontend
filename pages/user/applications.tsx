import ApplicationItem from "@/components/application/ApplicationItem";
import { API_URL } from "@/config/index";
import qs from "qs";
import { parseCookie } from "lib/utils";
import ProfileHeaderCard from "@/components/user/ProfileHeaderCard";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import ProfileSidebar from "@/components/user/ProfileSidebar";
import axios from "axios";
import { applications as appli18n } from "@/i18n";
import StaffApplicationItem from "@/components/application/StaffApplicationItem";
import { GetServerSideProps } from "next";
import { ArrayDataResponse } from "api-definitions/strapiBaseTypes";
import {
  Application,
  SchoolApplication,
  StaffApplication,
} from "api-definitions/backend";
import { useLocale } from "i18n/useLocale";

export default function ApplicationsPage({
  applications,
  token,
}: {
  applications: (SchoolApplication | StaffApplication)[];
  token: string;
}) {
  const { user } = useContext(AuthContext);
  const locale = useLocale();
  return (
    <>
      <ProfileHeaderCard user={user} />
      <div className="columns">
        <div className="column is-3">
          <ProfileSidebar />
        </div>
        <div className="column">
          <h1 className="title is-3">{appli18n[locale].applications}</h1>
          {applications.length === 0 && (
            <h3 className="subtitle is-5 mt-5">
              {appli18n[locale].noApplications}
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
                  {"school" in application ? (
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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  locale,
}) => {
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
  const result = await axios.get<ArrayDataResponse<SchoolApplication>>(
    `${API_URL}/api/school-applications/me?${query}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const applications: Application[] = result.data?.data ?? [];
  query = qs.stringify(
    {
      sort: ["createdAt:desc"],
    },
    {
      encodeValuesOnly: true,
    }
  );

  const staffApplicationsFetch = await axios.get<
    ArrayDataResponse<StaffApplication>
  >(`${API_URL}/api/staff-applications/me?${query}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  applications.push(...(staffApplicationsFetch.data.data ?? []));

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
    props: { applications: applications ?? null, token: token ?? null, locale },
  };
};
