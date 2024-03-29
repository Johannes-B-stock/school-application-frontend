import DashboardLayout from "@/components/Layout/DashboardLayout";
import styles from "@/styles/Showcase.module.css";
import { parseCookie } from "lib/utils";
import qs from "qs";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { StaffApplicationSetting } from "api-definitions/backend";
import { GetServerSideProps } from "next";
import { getStaffApplicationSettings } from "lib/staffApplication";

export default function StaffApplicationDetailsPage({
  staffAppDetails,
  error,
}: {
  staffAppDetails: StaffApplicationSetting;
  error: string;
}) {
  const router = useRouter();

  if (error) {
    toast.error(error);
  }
  const cardImage =
    staffAppDetails.cardImage.formats.large?.url ??
    staffAppDetails.cardImage.formats.small?.url;
  return (
    <>
      {cardImage && (
        <section
          className={`hero is-medium is-link has-text-centered ${styles.showcase}`}
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)), url(${cardImage})`,
          }}
        >
          <div className="container hero-body">
            <p className="title mb-6">Apply for staff</p>
            <p className="subtitle">{staffAppDetails?.shortDescription}</p>
          </div>
        </section>
      )}
      <div className="section">
        <div className="container is-max-widescreen">
          <div className="content">
            <ReactMarkdown>{staffAppDetails.details}</ReactMarkdown>
          </div>

          <br />
          <div className="has-text-centered">
            <div
              className={`button is-primary is-large ${
                staffAppDetails.allowApplications ? "is-disabled" : ""
              }`}
              onClick={() =>
                staffAppDetails.allowApplications &&
                router.push("/staff-application/create")
              }
            >
              Apply
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

StaffApplicationDetailsPage.getLayout = function getLayout(page: any) {
  return <DashboardLayout title="Staff apply details">{page}</DashboardLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { token } = parseCookie(req);
  const query = qs.stringify({
    populate: ["cardImage", "localizations"],
  });
  try {
    const staffAppDetails = await getStaffApplicationSettings({ token, query });
    if (staffAppDetails.error) {
      return {
        props: {
          error: staffAppDetails.error.message,
        },
      };
    }
    return {
      props: {
        staffAppDetails: staffAppDetails.data,
      },
    };
  } catch (error: any) {
    return {
      props: {
        staffAppDetails: null,
        error: error.message ?? error,
      },
    };
  }
};
