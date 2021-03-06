import SchoolItem from "@/components/school/SchoolItem";
import { API_URL } from "@/config/index";
import qs from "qs";

export default function SchoolsPage({ schools }) {
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

export async function getServerSideProps({ locale }) {
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
  const result = await res.json();
  const schools = result.data.map((data) => ({
    id: data.id,
    ...data.attributes,
    image: data.attributes.image.data.attributes.url,
  }));

  return {
    props: { schools },
  };
}
