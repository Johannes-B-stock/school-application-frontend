import SchoolItem from "@/components/school/SchoolItem";
import ApplyForStaffCard from "@/components/application/ApplyForStaffCard";
import { API_URL, Locales } from "@/config/index";
import qs from "qs";
import { GetStaticProps } from "next";
import { School, StaffApplicationSetting } from "api-definitions/backend";
import { home } from "@/i18n";
import {
  ArrayDataResponse,
  SingleDataResponse,
} from "api-definitions/strapiBaseTypes";

export default function HomePage({
  schools,
  staffApplicationDetails,
  locale,
}: {
  schools: School[];
  staffApplicationDetails: StaffApplicationSetting;
  locale: Locales;
}) {
  return (
    <div className="content">
      <h1>{home[locale].upcomingSchools}</h1>
      {schools.length === 0 && <h3>{home[locale].noSchools}</h3>}
      <div className="columns is-multiline is-variable">
        {schools.map((school) => (
          <div
            key={school.id}
            className={`column ${
              schools.length > 3 && "is-4-tablet is-3-desktop"
            }`}
          >
            <SchoolItem key={school.id} school={school} />
          </div>
        ))}
      </div>
      {staffApplicationDetails && staffApplicationDetails.allowApplications && (
        <div>
          <hr />
          <h2>{home[locale].others}</h2>
          <div className="columns is-multiline is-variable">
            <div className={`column`}>
              <ApplyForStaffCard
                staffApplicationDetails={staffApplicationDetails}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const query = qs.stringify({
    filters: {
      isPublic: {
        $eq: true,
      },
    },
    populate: ["image", "localizations"],
    sort: ["startDate", "name"],
  });
  const res = await fetch(`${API_URL}/api/schools?${query}`);
  const result = (await res.json()) as ArrayDataResponse<School>;
  const schools = result.data;

  const staffQuery = qs.stringify({
    populate: ["cardImage", "localizations"],
  });

  const fetchRes = await fetch(
    `${API_URL}/api/staff-application-setting?${staffQuery}`
  );
  const staffResult =
    (await fetchRes.json()) as SingleDataResponse<StaffApplicationSetting>;

  const staffApplicationDetails = staffResult.data;

  return {
    props: { schools, staffApplicationDetails, locale },
    revalidate: 10,
  };
};
