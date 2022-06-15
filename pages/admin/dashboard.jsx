import { API_URL } from "@/config/index";
import { parseCookie } from "@/helpers/index";
import qs from "qs";
import AuthContext from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import NotAuthorized from "@/components/NotAuthorized";
import { toast } from "react-toastify";
import InfoTiles from "@/components/InfoTiles";
import { useRouter } from "next/router";
import SchoolsTable from "@/components/SchoolsTable";
import DashboardLayout from "@/components/DashboardLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faSpinner,
  faTrash,
  faXmark,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import _ from "lodash";
import { updateState } from "lib/application";
import { addStudentToSchool, getPaginatedApplications } from "lib/school";
import { getUser } from "lib/user";

export default function AdminDashboard({ schools, error, token }) {
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [applications, setApplications] = useState([]);
  const [applicationLoadingError, setApplicationLoadingError] = useState("");
  const [userPictures, setUserPictures] = useState([]);
  const [applicationPagination, setApplicationPagination] = useState(null);
  const [page, setPage] = useState(1);

  const [filter, setFilter] = useState("");

  const { user } = useContext(AuthContext);

  const router = useRouter();

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
        setApplicationLoadingError(applicationsResult.error.message);
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

  const deleteApplication = async (id) => {
    if (
      !confirm(
        "Do you really want to delete this application? There is no going back..."
      )
    )
      return;
    const deleteFetch = await fetch(
      `${API_URL}/api/school-applications/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (deleteFetch.ok) {
      toast.success("Application was successful deleted");
      setApplications(_.remove(applications, (app) => app.id !== id));
    } else {
      const result = await deleteFetch.json();
      toast.error("Error while deleting application: " + result.error.message);
    }
  };

  const revokeApplication = async (application) => {
    await changeState(application, "revoked");
  };

  const approveApplication = async (application) => {
    try {
      await changeState(application, "approved");
      await addStudentToSchool(application, token);
    } catch (error) {
      toast.error(error.message ?? error);
    }
  };

  async function changeState(application, desiredState) {
    try {
      const currentState = application.attributes.state;
      if (currentState !== "submitted" && currentState !== "reviewed") {
        return;
      }
      await updateState(application.id, token, desiredState);
      toast.success(`Application was successful ${desiredState}`);
      application.attributes.state = desiredState;
      setApplications([...applications]);
    } catch (err) {
      toast.error(
        "Error while changing state of application: " + error?.message ?? error
      );
    }
  }

  return (
    <section className="section has-background-light">
      <div className="container">
        <div className="level has-text-centered">
          <div className="level-item">
            <p className="title">Dashboard</p>
          </div>
        </div>
        <section className="p-5">
          <InfoTiles schools={schools} />
          <div className="tile is-ancestor">
            <div className="tile ">
              <div className="tile is-parent is-vertical">
                <div className="tile card is-child">
                  <header className="card-header">
                    <p className="card-header-title">Schools</p>
                  </header>
                  <div className="card-content">
                    <SchoolsTable schools={schools} />
                  </div>
                </div>
                <nav className="tile is-child panel has-background-white">
                  <p className="panel-heading has-background-primary">
                    Applications
                  </p>
                  {/* <div className="panel-block">
                      <p className="control has-icons-left">
                        <input
                          className="input"
                          type="text"
                          placeholder="Search"
                        />
                        <span className="icon is-left">
                          <i className="fas fa-search" aria-hidden="true"></i>
                        </span>
                      </p>
                    </div> */}
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
                    <div className="table-container">
                      <table className="table is-fullwidth is-striped is-hoverable">
                        <thead>
                          <tr>
                            <th></th>
                            <th>User</th>
                            <th>School</th>
                            <th>Progress</th>
                            <th>State</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {applications.length === 0 && (
                            <tr>
                              <td colSpan="4">
                                No applications available for this filter
                              </td>
                            </tr>
                          )}
                          {applications.map((application) => (
                            <tr key={application.id}>
                              <td>
                                <div className="image is-32x32 is-rounded">
                                  <Image
                                    className="image is-32x32 is-rounded"
                                    alt="Profile"
                                    src={
                                      userPictures.find(
                                        (user) =>
                                          user.id ===
                                          application.attributes.user.data.id
                                      )?.picture ?? "/images/defaultAvatar.png"
                                    }
                                    width="32"
                                    height="32"
                                    objectFit="cover"
                                  />
                                </div>
                              </td>
                              <td>
                                <Link
                                  href={`/user/${application.attributes.user.data.id}`}
                                >
                                  {
                                    application.attributes.user.data.attributes
                                      .username
                                  }
                                </Link>
                              </td>
                              <td>
                                {
                                  application.attributes.school.data.attributes
                                    .name
                                }
                              </td>

                              <td width="12%">
                                <progress
                                  className="progress is-primary is-small my-2"
                                  value={application.attributes.step}
                                  max="3"
                                >
                                  {application.attributes.step} / 3
                                </progress>
                              </td>
                              <td>{application.attributes.state}</td>
                              <td>
                                <span className="is-italic">
                                  {new Date(
                                    application.attributes.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </td>
                              <td>
                                <span className="is-italic">
                                  {new Date(
                                    application.attributes.updatedAt
                                  ).toLocaleDateString()}
                                </span>
                              </td>
                              <td>
                                <div
                                  className={`button is-small mx-1 is-success`}
                                  title="Approve"
                                  disabled={
                                    application.attributes.state !== "submitted"
                                  }
                                  onClick={() =>
                                    approveApplication(application)
                                  }
                                >
                                  <span className="icon">
                                    <FontAwesomeIcon icon={faCheck} />
                                  </span>
                                </div>
                                <div
                                  className="button is-small mx-1 is-warning"
                                  title="Revoke"
                                  disabled={
                                    application.attributes.state !== "submitted"
                                  }
                                  onClick={() => revokeApplication(application)}
                                >
                                  <FontAwesomeIcon icon={faXmark} />
                                </div>
                                <div
                                  className="button is-small mx-1 is-link"
                                  title="Show Details"
                                  onClick={() =>
                                    router.push(
                                      `/admin/applications/${application.id}`
                                    )
                                  }
                                >
                                  <span className="icon">
                                    <FontAwesomeIcon icon={faEye} />
                                  </span>
                                </div>
                                <div
                                  className="button is-small mx-1 is-danger"
                                  title="Delete"
                                  onClick={() =>
                                    deleteApplication(application.id)
                                  }
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="p-3">
                        <Pagination
                          pagination={applicationPagination}
                          changePage={setPage}
                        />
                      </div>
                    </div>
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
        </section>
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
