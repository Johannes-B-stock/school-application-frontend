import DashboardLayout from "@/components/Layout/DashboardLayout";
import styles from "@/styles/Showcase.module.css";
import { API_URL } from "@/config/index";
import { parseCookie } from "@/helpers/index";
import axios from "axios";
import qs from "qs";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function StaffApplicationDetailsPage({
  staffAppDetails,
  error,
}) {
  const router = useRouter();

  if (error) {
    toast.error(error);
  }
  const cardImage =
    staffAppDetails.cardImage.data.attributes.formats.large?.url ??
    staffAppDetails.cardImage.data.attributes.formats.small?.url;
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

StaffApplicationDetailsPage.getLayout = function getLayout(page) {
  return <DashboardLayout title="Staff apply details">{page}</DashboardLayout>;
};

export async function getServerSideProps({ req }) {
  const { token } = parseCookie(req);
  const query = qs.stringify({
    populate: ["cardImage", "localizations"],
  });
  try {
    const staffAppDetails = await axios.get(
      `${API_URL}/api/staff-application-setting?${query}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      props: {
        staffAppDetails: staffAppDetails.data.data.attributes,
      },
    };
  } catch (error) {
    return {
      props: {
        staffAppDetails: null,
        error: error.message ?? error,
      },
    };
  }
}
