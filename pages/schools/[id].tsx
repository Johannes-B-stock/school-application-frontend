import { API_URL } from "@/config/index";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
import qs from "qs";
import { useRouter } from "next/router";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import styles from "@/styles/Showcase.module.css";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import ReactMarkdown from "react-markdown";

export default function SchoolDetailsPage({ school }) {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  let schoolInfo = school;

  const schoolImage = school.image
    ? school.image
    : "/images/school-default.png";

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
    <>
      <section
        className={`hero is-medium is-link has-text-centered ${styles.showcase}`}
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)), url(${schoolImage})`,
        }}
      >
        <div className="container hero-body">
          <p className="title mb-1">{schoolInfo?.name}</p>
          <h4 className="is-italic mb-3">
            {new Date(school.startDate).toLocaleDateString(router.locale)} -{" "}
            {new Date(school.endDate).toLocaleDateString(router.locale)}
          </h4>
          <p>{schoolInfo.description}</p>
        </div>
      </section>
      <section className="section">
        <div className="container is-max-widescreen">
          <div className="content">
            <ReactMarkdown>{schoolInfo.detailedDescription}</ReactMarkdown>

            <h3>Fees</h3>
            <p>Application Fee: {school.applicationFee}</p>
            <p>School Fee: {school.schoolFee}</p>

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
        </div>
      </section>
    </>
  );
}

SchoolDetailsPage.getLayout = function getLayout(page) {
  return <DashboardLayout title="School details">{page}</DashboardLayout>;
};

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
