import SchoolItem from "@/components/school/SchoolItem";
import { API_URL } from "@/config/index";
import { School } from "api-definitions/backend";
import { ArrayDataResponse } from "api-definitions/strapiBaseTypes";
import { GetServerSideProps } from "next";
import qs from "qs";

export default function SchoolsPage({ schools }: { schools: School[] }) {
  return (
    <div className="content">
      <h1>Schools</h1>
      {schools.length === 0 && (
        <h3>you are not applied to any school at the moment</h3>
      )}
      <div className="columns is-multiline is-variable">
        {schools &&
          schools.map((school) => (
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
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const query = qs.stringify(
    {
      filters: {
        isPublic: {
          $eq: true,
        },
      },
      locale: locale,
      populate: "image",
      sort: ["startDate", "name"],
    },
    {
      encodeValuesOnly: true,
    }
  );
  const res = await fetch(`${API_URL}/api/schools?${query}`);
  const result = (await res.json()) as ArrayDataResponse<School>;

  return {
    props: { schools: result.data },
  };
};
