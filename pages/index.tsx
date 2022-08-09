import SchoolItem from "@/components/school/SchoolItem";
import ApplyForStaffCard from "@/components/application/ApplyForStaffCard";
import { API_URL } from "@/config/index";
import qs from "qs";
import { GetServerSideProps } from "next";
import { SchoolsResponse } from "definitions/backend";

export default function HomePage({ schools, staffApplicationDetails }) {
  return (
    <div className="content">
      <h1>Upcoming Schools</h1>
      {schools.length === 0 && <h3>No schools to apply at the moment</h3>}
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
      {staffApplicationDetails &&
        staffApplicationDetails.attributes.allowApplications && (
          <div>
            <hr />
            <h2>Others</h2>
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

export const getServerSideProps: GetServerSideProps = async () => {
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
  const result = await res.json() as SchoolsResponse;
  const schools = result.data.map((data) => ({
    id: data.id,
    ...data.attributes,
    image: data.attributes.image?.data?.attributes.formats.small ?? null,
  }));

  const staffQuery = qs.stringify({
    populate: ["cardImage", "localizations"],
  });

  const fetchRes = await fetch(
    `${API_URL}/api/staff-application-setting?${staffQuery}`
  );
  const staffResult = await fetchRes.json();

  const staffApplicationDetails = staffResult.data ?? null;

  return {
    props: { schools, staffApplicationDetails },
  };
}
