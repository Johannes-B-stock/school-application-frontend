import { API_URL } from "@/config/index.js";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
import qs from "qs";
import { useRouter } from "next/router";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

export default function SchoolDetails({ school }) {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  let schoolInfo = school;

  if (router.locale !== router.defaultLocale) {
    const localizedSchool = school.localizations.data.find(
      (schoolLoc) => schoolLoc.attributes.locale === router.locale.split("-")[0]
    );
    if (localizedSchool) {
      schoolInfo = localizedSchool.attributes;
    }
  }

  const handleDelete = async (e) => {
    if (confirm("Are you sure?")) {
      const res = await fetch(`${API_URL}/api/schools/${school.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        toast.error(res.statusText);
      } else {
        toast.success(`School ${school.name} successfully deleted.`);
        router.push("/");
      }
    }
  };
  return (
    <div className="content">
      <h1>{schoolInfo.name}</h1>
      <h4 className="is-italic">
        {school.startDate} - {school.endDate}
      </h4>
      <Image
        src={school.image ? school.image : "/images/school-default.png"}
        alt="school image"
        width="800"
        height="600"
      />

      <p>{schoolInfo.description}</p>

      <h3>Fees</h3>
      <p>Application Fee: {school.applicationFee}&euro;</p>
      <p>School Fee: {school.schoolFee}&euro;</p>

      {school.acceptingStudents && (
        <Link href={`/schools/${school.id}/apply`}>
          <a className="button m-1 is-primary">Apply</a>
        </Link>
      )}
      {user && user.role?.name === "SchoolAdmin" && (
        <>
          {" "}
          <Link href={`/schools/${school.id}/edit`}>
            <a className="button m-1 is-secondary">Edit</a>
          </Link>
          <a onClick={handleDelete} className="button m-1 is-danger">
            Delete
          </a>
        </>
      )}
    </div>
  );
}

export async function getServerSideProps({ params: { id } }) {
  const query = qs.stringify(
    {
      filters: {
        isPublic: {
          $eq: true,
        },
      },
      populate: ["image", "localizations"],
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
    // revalidate: 1,
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
