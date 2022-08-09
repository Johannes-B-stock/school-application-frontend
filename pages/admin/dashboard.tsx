import { API_URL } from "@/config/index";
import { parseCookie } from "@/helpers/index";
import qs from "qs";
import AuthContext from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import NotAuthorized from "@/components/auth/NotAuthorized";
import { toast } from "react-toastify";
import InfoTiles from "@/components/admin/InfoTiles";
import SchoolsTable from "@/components/school/SchoolsTable";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { getPaginatedApplications } from "lib/school";
import { getUser } from "lib/user";
import ApplicationsTable from "@/components/admin/ApplicationsTable";

export default function AdminDashboard({ schools, error, token }) {
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [applications, setApplications] = useState([]);
  const [userPictures, setUserPictures] = useState([]);
  const [applicationPagination, setApplicationPagination] = useState(null);
  const [page, setPage] = useState(1);

  const [filter, setFilter] = useState("");

  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function fetchData() {
      setIsLoadingApplications(true);

      const appFetch = await getPaginatedApplications(page, filter, token);
      const applicationsResult = await appFetch.json();

      if (appFetch.ok) {
        setIsLoadingApplications(false);
        setApplications(applicationsResult.data);
        setApplicationPagination(applicationsResult.meta.pagination);
      } else {
        toast.error(
          "Cannot load applications because " + applicationsResult.error.message
        );
      }
      const condensedUserIds = [];
      applicationsResult.data.forEach(
        (app) =>
          !condensedUserIds.includes(app.attributes.user.data.id) &&
          app.attributes.user.data.id &&
          condensedUserIds.push(app.attributes.user.data.id)
      );
      const users = [];
      await Promise.all(
        condensedUserIds.map(async (userId) => {
          try {
            const user = await getUser(userId, token, ["picture"]);
            users.push(user);
          } catch (error) {
            console.log(error.message ?? error);
          }
        })
      );
      const pictures = users.map((user) => {
        return { id: user.id, picture: user.picture?.formats.thumbnail.url };
      });
      setUserPictures(pictures);
    }
    fetchData();
  }, [schools, token, filter, page]);

  if (!user || !isSchoolAdmin(user.role)) {
    return <NotAuthorized />;
  }

  if (error) {
    toast.error(error);
  }

  return (
    <section className="section has-background-light">
      <div className="container">
        <div className="level has-text-centered">
          <div className="level-item">
            <p className="title">Dashboard</p>
          </div>
        </div>
        <InfoTiles schools={schools} />
        <div className="tile is-ancestor">
          <div className="tile ">
            <div className="tile is-parent is-vertical">
              <div className="tile card is-child">
                <header className="card-header">
                  <p className="card-header-title">Schools</p>
                </header>
                <div className="card-content" style={{ overflow: "auto" }}>
                  <SchoolsTable schools={schools} />
                </div>
              </div>
              <nav className="tile is-child panel">
                <p className="panel-heading has-background-primary">
                  School Applications
                </p>
                <p className="panel-tabs">
                  <a
                    className={filter === "" ? `is-active` : ""}
                    onClick={() => setFilter("")}
                  >
                    All
                  </a>
                  <a
                    className={filter === "open" ? `is-active` : ""}
                    onClick={() => setFilter("open")}
                  >
                    Open
                  </a>
                  <a
                    className={filter === "submitted" ? `is-active` : ""}
                    onClick={() => setFilter("submitted")}
                  >
                    Submitted
                  </a>
                  <a
                    className={filter === "reviewed" ? `is-active` : ""}
                    onClick={() => setFilter("reviewed")}
                  >
                    Reviewed
                  </a>
                  <a
                    className={filter === "approved" ? `is-active` : ""}
                    onClick={() => setFilter("approved")}
                  >
                    Approved
                  </a>
                  <a
                    className={filter === "revoked" ? `is-active` : ""}
                    onClick={() => setFilter("revoked")}
                  >
                    Revoked
                  </a>
                </p>
                {isLoadingApplications && (
                  <span className="panel-icon">
                    <FontAwesomeIcon icon={faSpinner} spin={true} />
                  </span>
                )}
                {applications && (
                  <ApplicationsTable
                    applications={applications}
                    applicationPagination={applicationPagination}
                    setPage={setPage}
                    userPictures={userPictures}
                    setApplications={setApplications}
                    token={token}
                  />
                )}
              </nav>
            </div>
          </div>
        </div>
        <div className="tile">
          <div className="columns">
            <div className="column-is-2">
              <div className="box m-3 p-3 has-background-warning-light">
                <p>
                  Not enough information on this page? <br />
                  For more adjustment go to the{" "}
                </p>
                <br />
                <div
                  className="button is-link"
                  onClick={() => window.open(`${API_URL}/admin`, "_blank")}
                >
                  backend dashboard
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

AdminDashboard.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export async function getServerSideProps({ req }) {
  const { token } = parseCookie(req);

  const dateToFilter = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 6);
  const query = qs.stringify({
    filters: {
      endDate: {
        $gt: dateToFilter.toISOString(),
      },
    },
    sort: "startDate",
    populate: ["students", "applications", "staff"],
  });
  const schoolFetch = await fetch(`${API_URL}/api/schools?${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  let schools = null;
  let error = null;

  const schoolResult = await schoolFetch.json();
  if (schoolFetch.ok) {
    schools = schoolResult.data;
  } else {
    error = schoolResult.error.message;
  }

  return {
    props: {
      schools,
      error,
      token,
    },
  };
}

export function isSchoolAdmin(role) {
  return role.name === "SchoolAdmin" || role.name === "admin";
}
