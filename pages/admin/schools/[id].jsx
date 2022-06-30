import AddUserTable from "@/components/user/AddUserTable";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import GoogleSpinner from "@/components/common/GoogleSpinner";
import NotAuthorized from "@/components/auth/NotAuthorized";
import AuthContext from "@/context/AuthContext";
import { parseCookie } from "@/helpers/index";
import { faAdd, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  addMultipleStaffToSchool,
  getPaginatedApplications,
  getSchoolDetails,
  removeStaffFromSchool,
} from "lib/school";
import { getAllUsers } from "lib/user";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import ApplicationsTable from "@/components/admin/ApplicationsTable";
import UserAvatar from "@/components/user/UserAvatar";
import Link from "next/link";

export default function SchoolAdmin({ school, token }) {
  const { user } = useContext(AuthContext);
  const [isLoadingStudentDetails, setIsLoadingStudentDetails] = useState(false);
  const [students, setStudents] = useState([]);
  const [isLoadingStaffDetails, setIsLoadingStaffDetails] = useState(false);
  const [staff, setStaff] = useState([]);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [addedStaff, setAddedStaff] = useState([]);
  const [isSavingStaff, setIsSavingStaff] = useState(false);
  const [filter, setFilter] = useState("");

  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [applications, setApplications] = useState([]);
  const [userPictures, setUserPictures] = useState([]);
  const [applicationPagination, setApplicationPagination] = useState(null);
  const [page, setPage] = useState(1);

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoadingStaffDetails(true);
        const staff = await getAllUsers(
          school.attributes.staff.data.map((staff) => staff.id),
          token,
          ["picture"]
        );
        setStaff(staff);
      } catch (error) {
        toast(error.message ?? error);
      } finally {
        setIsLoadingStaffDetails(false);
      }
      try {
        setIsLoadingStudentDetails(true);
        const students = await getAllUsers(
          school.attributes.students.data.map((user) => user.id),
          token,
          ["picture"]
        );
        setStudents(students);

        setIsLoadingStudentDetails(false);
      } catch (error) {
        setIsLoadingStudentDetails(false);
        toast(error.message ?? error);
      } finally {
      }
    }
    fetchData();
  }, [school, token]);

  useEffect(() => {
    async function loadApplicationDetails() {
      setIsLoadingApplications(true);

      const appFetch = await getPaginatedApplications(
        page,
        filter,
        token,
        school.id
      );
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
    loadApplicationDetails();
  }, [school, token, filter, page]);

  const toggleStaffModal = () => {
    setShowStaffModal(!showStaffModal);
  };

  const handleSaveStaffModal = async () => {
    if (isSavingStaff) {
      return;
    }
    try {
      setIsSavingStaff(true);
      await addMultipleStaffToSchool(addedStaff, school.id, token);
      setStaff([...staff, ...addedStaff]);
      setShowStaffModal(false);
    } catch (error) {
      toast.error(error.message ?? error);
    } finally {
      setIsSavingStaff(false);
    }
  };

  const clickRemoveStaff = async (userId) => {
    await removeStaffFromSchool(userId, school.id, token);
    const updatedStaff = [...staff];
    _.remove(updatedStaff, (staff) => staff.id === userId);
    setStaff(updatedStaff);
  };

  if (
    !user ||
    (user.role?.name.toLowerCase() !== "schooladmin" &&
      user.role?.name.toLowerCase() !== "admin")
  ) {
    return <NotAuthorized />;
  }
  return (
    <section className="section has-background-light">
      <h2 className="title is-3">School {school.attributes.name}</h2>
      <div className="columns">
        <div className="column">
          <div className="card my-5">
            <div className="card-header">
              <p className="card-header-title background-gradient-primary-info">
                General
              </p>
            </div>
            <div className="card-content">
              <div className="columns">
                <div className="column is-3 has-text-weight-bold">Name:</div>
                <div className="column">{school.attributes.name}</div>
              </div>
              <div className="columns">
                <div className="column is-3 has-text-weight-bold">
                  Description:
                </div>
                <div className="column">{school.attributes.description}</div>
              </div>
              {school.attributes.contactEmail && (
                <div className="columns is-mobile">
                  <div className="column is-3 has-text-weight-bold">
                    Contact:
                  </div>
                  <div className="column">
                    <a href={`mailto:${school.attributes.contactEmail}`}>
                      {school.attributes.contactEmail}
                    </a>
                  </div>
                </div>
              )}

              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">
                  Starts at:
                </div>
                <div className="column">
                  {new Date(school.attributes.startDate).toLocaleDateString()}
                </div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">Ends at:</div>
                <div className="column">
                  {new Date(school.attributes.endDate).toLocaleDateString()}
                </div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">
                  Application Fee:
                </div>
                <div className="column">{school.attributes.applicationFee}</div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">
                  School Fee:
                </div>
                <div className="column">{school.attributes.schoolFee}</div>
              </div>
              <div
                className="button is-primary"
                onClick={() => router.push(`/schools/${school.id}/edit`)}
              >
                Edit School
              </div>
            </div>
          </div>
        </div>
        <div className="column">
          <div className="card my-5">
            <header className="card-header">
              <p className="card-header-title background-gradient-primary-right">
                Students
              </p>
            </header>
            <div className="card-content">
              {isLoadingStudentDetails ? (
                <GoogleSpinner />
              ) : (
                <div className="columns is-multiline">
                  {students.map((student) => (
                    <div
                      className="column is-narrow has-text-centered"
                      key={student.id}
                    >
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={`/user/${student.id}`}
                      >
                        <UserAvatar user={student} />
                      </a>
                    </div>
                  ))}
                </div>
              )}
              {students.length === 0 && <p>No students are accepted yet</p>}
            </div>
          </div>
          <div className="card my-5">
            <header className="card-header">
              <p className="card-header-title background-gradient-primary-right">
                Staff
              </p>
            </header>
            <div className="card-content">
              {isLoadingStaffDetails ? (
                <GoogleSpinner />
              ) : (
                <div className="class columns is-multiline">
                  {staff.map((user) => (
                    <div
                      className="column is-narrow has-text-centered m-1"
                      key={user.id}
                    >
                      <a
                        href={`/user/${user.id}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <UserAvatar
                          user={user}
                          clickRemoveStaff={clickRemoveStaff}
                        />
                      </a>
                    </div>
                  ))}
                </div>
              )}
              {staff.length === 0 && (
                <p>This school does not have any staff yet</p>
              )}
              <br />
              <div className="control">
                <div className="button is-primary" onClick={toggleStaffModal}>
                  <FontAwesomeIcon icon={faAdd} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <div className="card ">
            <div className="card-header">
              <p className="card-header-title background-gradient-primary-info">
                Applications
              </p>
            </div>
            <div className="card-content">
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
            </div>
          </div>
        </div>
      </div>
      <div className={`modal ${showStaffModal ? "is-active" : ""}`}>
        <div className="modal-background" onClick={toggleStaffModal}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Add staff</p>
            <button
              className="delete"
              aria-label="close"
              onClick={toggleStaffModal}
            ></button>
          </header>
          <section className="modal-card-body">
            <AddUserTable
              token={token}
              load={showStaffModal}
              excludedUsers={staff}
              addedUsers={setAddedStaff}
            />
          </section>
          <footer className="modal-card-foot">
            <button
              className={`button is-success ${
                isSavingStaff ? "is-loading" : ""
              }`}
              onClick={handleSaveStaffModal}
            >
              Save
            </button>
            <button className="button" onClick={toggleStaffModal}>
              Cancel
            </button>
          </footer>
        </div>
      </div>
    </section>
  );
}

SchoolAdmin.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export async function getServerSideProps({ req, params: { id } }) {
  const { token } = parseCookie(req);
  const schoolDetails = await getSchoolDetails(id, token, [
    "students",
    "staff",
    "applications",
    "applicationQuestions",
    "referenceQuestions",
  ]);
  return {
    props: {
      school: schoolDetails.data,
      token,
    },
  };
}
