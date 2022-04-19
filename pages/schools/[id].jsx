import { API_URL } from "@/config/index.js";
import Layout from "@/components/Layout";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
import qs from "qs";
import { useRouter } from "next/router";

export default function SchoolDetails({ school }) {
  const router = useRouter();

  const handleDelete = async (e) => {
    if (confirm("Are you sure?")) {
      const res = await fetch(`${API_URL}/api/schools/${school.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res);
      if (!res.ok) {
        toast.error(res.statusText);
      } else {
        toast.success(`School ${school.name} successfully deleted.`);
        router.push("/");
      }
    }
  };
  return (
    <Layout>
      <div className="content">
        <h1>{school.name}</h1>
        <h4 className="is-italic">
          {school.startDate} - {school.endDate}
        </h4>
        <Image
          src={school.image ? school.image : "/images/school-default.png"}
          alt="school image"
          width="800"
          height="600"
        />

        <p>{school.description}</p>

        <h3>Fees</h3>
        <p>Application Fee: {school.applicationFee}&euro;</p>
        <p>School Fee: {school.schoolFee}&euro;</p>

        {school.acceptingStudents && (
          <Link href={`/schools/${school.id}/apply`}>
            <a className="button m-1 is-primary">Apply</a>
          </Link>
        )}
        <Link href={`/schools/edit/${school.id}`}>
          <a className="button m-1 is-secondary">Edit</a>
        </Link>

        <a onClick={handleDelete} className="button m-1 is-danger">
          Delete
        </a>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const res = await fetch(`${API_URL}/api/schools`);
  const result = await res.json();
  const schools = result.data;

  const paths = schools.map((school) => ({
    params: { id: school.id.toString() },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params: { id } }) {
  const query = qs.stringify(
    {
      filters: {
        isPublic: {
          $eq: true,
        },
      },
      populate: ["image"],
    },
    {
      encodeValuesOnly: true,
    }
  );
  const res = await fetch(`${API_URL}/api/schools/${id}?${query}`);
  const result = await res.json();
  const school = {
    id: result.data.id,
    ...result.data.attributes,
    image: result.data.attributes.image?.data?.attributes.url ?? null,
  };

  return {
    props: {
      school: school,
    },
    revalidate: 1,
  };
}

// export async function getServerSideProps({ query: { slug } }) {
//   const res = await fetch(`${API_URL}/api/schools/${slug}`);
//   const schools = await res.json();
//   return {
//     props: {
//       school: schools[0],
//     },
//   };
// }
