import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTrash,
  faXmark,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Pagination from "@/components/common/Pagination";
import Link from "next/link";
import _ from "lodash";
import { toast } from "react-toastify";
import { updateState } from "lib/schoolApplication";
import { addStudentToSchool } from "lib/school";
import { API_URL } from "@/config/index";
import { useRouter } from "next/router";

export default function ApplicationsTable({
  applications,
  applicationPagination,
  setPage,
  setApplications,
  userPictures,
  token,
}) {
  const router = useRouter();
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
        "Error while changing state of application: " + err?.message ?? err
      );
    }
  }

  return (
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
              <td colSpan="4">No applications available for this filter</td>
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
                          user.id === application.attributes.user.data.id
                      )?.picture ?? "/images/defaultAvatar.png"
                    }
                    width="32"
                    height="32"
                    objectFit="cover"
                  />
                </div>
              </td>
              <td>
                <Link href={`/user/${application.attributes.user.data.id}`}>
                  {application.attributes.user.data.attributes.username}
                </Link>
              </td>
              <td>{application.attributes.school.data.attributes.name}</td>

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
                  disabled={application.attributes.state !== "submitted"}
                  onClick={() => approveApplication(application)}
                >
                  <span className="icon">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                </div>
                <div
                  className="button is-small mx-1 is-warning"
                  title="Revoke"
                  disabled={application.attributes.state !== "submitted"}
                  onClick={() => revokeApplication(application)}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </div>
                <div
                  className="button is-small mx-1 is-link"
                  title="Show Details"
                  onClick={() =>
                    router.push(`/admin/applications/${application.id}`)
                  }
                >
                  <span className="icon">
                    <FontAwesomeIcon icon={faEye} />
                  </span>
                </div>
                <div
                  className="button is-small mx-1 is-danger"
                  title="Delete"
                  onClick={() => deleteApplication(application.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-3">
        <Pagination pagination={applicationPagination} changePage={setPage} />
      </div>
    </div>
  );
}
