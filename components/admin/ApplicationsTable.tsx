import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTrash,
  faXmark,
  faEye,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Pagination from "@/components/common/Pagination";
import Link from "next/link";
import _ from "lodash";
import { toast } from "react-toastify";
import { API_URL, defaultAvatarPath } from "@/config/index";
import { useRouter } from "next/router";
import {
  Application,
  ApplicationState,
  School,
  SchoolApplication,
  StaffApplication,
} from "api-definitions/backend";
import { Pagination as ApiPagination } from "api-definitions/strapiBaseTypes";
import { Dispatch, SetStateAction, useContext } from "react";
import { updateState } from "lib/applications";
import AuthContext from "@/context/AuthContext";

export default function ApplicationsTable<
  T extends Application & { school?: School }
>({
  applications,
  applicationPagination,
  setPage,
  setApplications,
}: {
  applications: T[];
  applicationPagination?: ApiPagination;
  setPage: Dispatch<SetStateAction<number>>;
  setApplications: Dispatch<SetStateAction<T[]>>;
}): JSX.Element {
  const router = useRouter();
  const { token } = useContext(AuthContext);

  const hasSchoolApplications = applications.some((app) => "school" in app);

  const applicationLink = (application: T) => {
    return application.school !== undefined
      ? "/admin/school-applications"
      : "/admin/staff-applications";
  };

  const deleteApplication = async (id: number) => {
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
      setApplications(_.remove(applications, (app: any) => app.id !== id));
    } else {
      const result = await deleteFetch.json();
      toast.error("Error while deleting application: " + result.error.message);
    }
  };

  const revokeApplication = async (application: Application) => {
    await changeState(application, "revoked");
  };

  const approveApplication = async (
    application: SchoolApplication | StaffApplication
  ) => {
    await changeState(application, "approved");
  };

  const reviewApplication = async (
    application: SchoolApplication | StaffApplication
  ) => {
    await changeState(application, "reviewing");
  };

  async function changeState(
    application: SchoolApplication | StaffApplication,
    desiredState: ApplicationState
  ) {
    if (!token) {
      throw new Error("not logged in!");
    }
    try {
      const isSchoolApplication = "school" in application;
      await updateState(
        application.id,
        token,
        desiredState,
        isSchoolApplication ? "school" : "staff"
      );
      toast.success(
        `Application state was successfuly changed to ${desiredState}`
      );
      application.state = desiredState;
      setApplications([...applications]);
    } catch (err: any) {
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
            {hasSchoolApplications && <th>School</th>}
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
              <td colSpan={4}>No applications available for this filter</td>
            </tr>
          )}
          {applications.map((application) => (
            <tr key={application.id}>
              <td onClick={navigateToApplication(application)}>
                <div className="image is-32x32 is-rounded">
                  <Image
                    className="image is-32x32 is-rounded"
                    alt="Profile"
                    src={
                      application.user?.picture?.formats?.thumbnail?.url ??
                      application.user?.picture?.url ??
                      defaultAvatarPath
                    }
                    width="32"
                    height="32"
                    objectFit="cover"
                  />
                </div>
              </td>
              <td>
                <Link href={`/user/${application.user.id}`}>
                  {application.user.username}
                </Link>
              </td>
              {"school" in application ? (
                <td onClick={navigateToApplication(application)}>
                  {application.school?.name}
                </td>
              ) : (
                <></>
              )}
              <td width="12%" onClick={navigateToApplication(application)}>
                <progress
                  className="progress is-primary is-small my-2"
                  value={application.step}
                  max="3"
                >
                  {application.step} / 3
                </progress>
              </td>
              <td onClick={navigateToApplication(application)}>
                {application.state}
              </td>
              <td onClick={navigateToApplication(application)}>
                <span className="is-italic">
                  {new Date(application.createdAt).toLocaleDateString()}
                </span>
              </td>
              <td onClick={navigateToApplication(application)}>
                <span className="is-italic">
                  {new Date(application.updatedAt).toLocaleDateString()}
                </span>
              </td>
              <td>
                <div className="field is-grouped">
                  <button
                    className={`button is-small mx-1 tooltip-bottom`}
                    data-tooltip="Review"
                    disabled={application.state !== "submitted"}
                    onClick={() => reviewApplication(application)}
                  >
                    <span className="icon">
                      <FontAwesomeIcon icon={faUserPen} />
                    </span>
                  </button>
                  <button
                    className={`button is-small mx-1 is-success tooltip-bottom`}
                    data-tooltip="Approve"
                    disabled={application.state !== "reviewing"}
                    onClick={() => approveApplication(application)}
                  >
                    <span className="icon">
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                  </button>
                  <button
                    className="button is-small mx-1 is-warning tooltip-bottom"
                    data-tooltip="Revoke"
                    disabled={application.state !== "submitted"}
                    onClick={() => revokeApplication(application)}
                  >
                    <span className="icon">
                      <FontAwesomeIcon icon={faXmark} />
                    </span>
                  </button>
                  <div
                    className="button is-small mx-1 is-link tooltip-bottom"
                    data-tooltip="Show Details"
                    onClick={navigateToApplication(application)}
                  >
                    <span className="icon">
                      <FontAwesomeIcon icon={faEye} />
                    </span>
                  </div>
                  <div
                    className="button is-small mx-1 is-danger tooltip-bottom"
                    data-tooltip="Delete"
                    onClick={() => deleteApplication(application.id)}
                  >
                    <span className="icon">
                      <FontAwesomeIcon icon={faTrash} />
                    </span>
                  </div>
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

  function navigateToApplication(application: T) {
    return () =>
      router.push(`${applicationLink(application)}/${application.id}`);
  }
}
