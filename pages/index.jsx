import Layout from "@/components/Layout";
import SchoolItem from "@/components/SchoolItem";
import { API_URL } from "@/config/index";
import qs from "qs";

export default function HomePage({ schools }) {
  return (
    <Layout>
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
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const query = qs.stringify({
    filters: {
      isPublic: {
        $eq: true,
      },
    },
    populate: "image",
    sort: ["startDate", "name"],
  });
  const res = await fetch(`${API_URL}/api/schools?${query}`);
  const result = await res.json();
  const schools = result.data.map((data) => ({
    id: data.id,
    ...data.attributes,
    image: data.attributes.image?.data?.attributes.formats.small.url ?? null,
  }));

  return {
    props: { schools },
  };
}
