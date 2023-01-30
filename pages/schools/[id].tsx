import { API_URL } from "@/config/index";
import { toast } from "react-toastify";
import Link from "next/link";
import qs from "qs";
import { useRouter } from "next/router";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import styles from "@/styles/Showcase.module.css";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import ReactMarkdown from "react-markdown";
import { SingleDataResponse } from "api-definitions/strapiBaseTypes";
import { School } from "api-definitions/backend";
import Currency from "@/components/common/Currency";
import { general, userSchool } from "@/i18n";
import { useLocale } from "i18n/useLocale";
import { GetServerSideProps } from "next";

export default function SchoolDetailsPage({ school }: { school: School }) {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const locale = useLocale();

  let schoolInfo = school;

  const schoolImage = school?.image?.url ?? "/images/school-default.png";

  if (locale !== router.defaultLocale) {
    const localizedSchool = school.localizations?.find(
      (schoolLoc) => schoolLoc.locale === locale
    );
    if (localizedSchool) {
      schoolInfo = localizedSchool;
    }
  }

  const handleDelete = async () => {
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
            {new Date(school.startDate).toLocaleDateString(locale)} -{" "}
            {new Date(school.endDate).toLocaleDateString(locale)}
          </h4>
          <p>{schoolInfo.description}</p>
        </div>
      </section>
      <section className="section">
        <div className="container is-max-widescreen">
          <div className="content">
            <ReactMarkdown>{schoolInfo.detailedDescription}</ReactMarkdown>

            <h3>{userSchool[locale].fees}</h3>
            <p>
              {userSchool[locale].applicationFee}:&nbsp;
              <Currency
                currency={school.currency}
                value={school.applicationFee}
              />
            </p>
            <p>
              {userSchool[locale].schoolFee}:&nbsp;
              <Currency currency={school.currency} value={school.schoolFee} />
            </p>
            <p>
              {userSchool[locale].outreachFee}:&nbsp;
              <Currency currency={school.currency} value={school.outreachFee} />
            </p>

            {school.acceptingStudents && (
              <Link href={`/schools/${school.id}/apply`}>
                <a className="button m-1 is-primary">
                  {general.buttons[locale].apply}
                </a>
              </Link>
            )}
            {user && user.role?.name === "SchoolAdmin" && (
              <>
                {" "}
                <Link href={`/schools/${school.id}/edit`}>
                  <a className="button m-1 is-secondary">
                    {general.buttons[locale].edit}
                  </a>
                </Link>
                <a onClick={handleDelete} className="button m-1 is-danger">
                  {general.buttons[locale].delete}
                </a>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

SchoolDetailsPage.getLayout = function getLayout(page: any) {
  return <DashboardLayout title="School details">{page}</DashboardLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id;
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
  const result = (await res.json()) as SingleDataResponse<School>;
  const school = result.data;

  return {
    props: {
      school: school,
    },
  };
};
