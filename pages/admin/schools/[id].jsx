import AddUserTable from "@/components/AddUserTable";
import DashboardLayout from "@/components/DashboardLayout";
import GoogleSpinner from "@/components/GoogleSpinner";
import NotAuthorized from "@/components/NotAuthorized";
import AuthContext from "@/context/AuthContext";
import { parseCookie } from "@/helpers/index";
import { faAdd, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  addMultipleStaffToSchool,
  getSchoolDetails,
  removeStaffFromSchool,
} from "lib/school";
import { getAllUsers } from "lib/user";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "@/styles/AdminOverview.module.css";
import { useRouter } from "next/router";

export default function SchoolAdmin({ school, token }) {
  const { user } = useContext(AuthContext);
  const [isLoadingStudentDetails, setIsLoadingStudentDetails] = useState(false);
  const [students, setStudents] = useState([]);
  const [isLoadingStaffDetails, setIsLoadingStaffDetails] = useState(false);
  const [staff, setStaff] = useState([]);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [addedStaff, setAddedStaff] = useState([]);
  const [isSavingStaff, setIsSavingStaff] = useState(false);

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
        console.log(students);

        setIsLoadingStudentDetails(false);
      } catch (error) {
        setIsLoadingStudentDetails(false);
        toast(error.message ?? error);
      } finally {
      }
    }
    fetchData();
  }, [school, token]);

  const toggleStaffModal = () => {
    setShowStaffModal(!showStaffModal);
  };

  const handleSaveStaffModal = async () => {
    if (isSavingStaff) {
      return;
    }
    console.log(addedStaff);
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
      <div className="columns">
        <div className="column">
          <div className="card my-5">
            <div className="card-header">
              <p className="card-header-title has-background-warning-light">
                General
              </p>
            </div>
            <div className="card-content">
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
              <p className="card-header-title has-background-danger-light">
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
                      <figure className="image is-50x50 is-rounded">
                        <Image
                          className="image is-50x50 is-rounded"
                          alt={student.username}
                          src={
                            student.picture?.formats.small.url ??
                            "/images/defaultAvatar.png"
                          }
                          objectFit="cover"
                          width="50"
                          height="50"
                        />
                      </figure>
                      {student.username}
                    </div>
                  ))}
                </div>
              )}
              {students.length === 0 && <p>No students are accepted yet</p>}
            </div>
          </div>
          <div className="card my-5">
            <header className="card-header">
              <p className="card-header-title has-background-danger-light">
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
                      <div className={styles.user}>
                        <a
                          style={{
                            display: "block",
                            marginLeft: "auto",
                            marginBottom: "-10px",
                          }}
                          className="icon has-text-danger"
                          onClick={() => clickRemoveStaff(user.id)}
                        >
                          <FontAwesomeIcon icon={faXmark} />
                        </a>
                        <figure className="image is-50x50 is-rounded">
                          <Image
                            className="image is-50x50 is-rounded"
                            alt={user.username}
                            src={
                              user.picture?.formats.small.url ??
                              "/images/defaultAvatar.png"
                            }
                            objectFit="cover"
                            width="50"
                            height="50"
                          />
                        </figure>
                        {user.username}
                      </div>
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
