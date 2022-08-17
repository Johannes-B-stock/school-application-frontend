import Link from "next/link";
import styles from "@/styles/ApplicationItem.module.css";
import { API_URL } from "../../config";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { applications, general } from "@/i18n";

export default function StaffApplicationItem({ application, token }) {
  const router = useRouter();
  const onDelete = async () => {
    if (
      !confirm(
        "Do you really want to delete this application? There is no way back"
      )
    ) {
      return;
    }
    const res = await fetch(
      `${API_URL}/api/staff-applications/${application.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      toast.success("Application successfully deleted.");
      router.reload();
    } else {
      toast.error(`Delete failed: ${res.statusText}`);
    }
  };

  const onSubmit = async () => {
    const res = await fetch(
      `${API_URL}/api/staff-applications/${application.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            state: "submitted",
          },
        }),
      }
    );

    if (res.ok) {
      application.state = "submitted";
      toast.success(
        "Submitted application successfully. Please wait for our response."
      );
    }
  };

  return (
    <div className={`card ${styles.applicationItem}`}>
      <div className="card-content">
        <p className="title is-4 has-text-centered">
          {applications[router.locale].staffApplication}
        </p>
        <p className="mt-3 subtitle is-italic is-6 has-text-grey has-text-centered">
          {applications[router.locale].arriveAt}:{" "}
          {application.arriveAt
            ? new Date(application.arriveAt).toLocaleDateString(router.locale, {
                dateStyle: "long",
              })
            : applications[router.locale].unknown}
          <br />
          {applications[router.locale].leaveAt}:{" "}
          {application.stayUntil
            ? new Date(application.stayUntil).toLocaleDateString(
                router.locale,
                {
                  dateStyle: "long",
                }
              )
            : applications[router.locale].unknown}
        </p>
        <div className="content has-text-left">
          <div className="px-4 mb-5">
            <progress
              className="progress is-primary my-3"
              value={application.step}
              max="3"
            >
              {application.step} / 3
            </progress>
          </div>
          <div className="columns is-mobile is-1">
            <div className="column is-6 has-text-right has-text-weight-semibold">
              {applications[router.locale].status}:
            </div>
            <div className="column">{application.state ?? "unknown"}</div>
          </div>
          <div className="columns is-mobile is-1">
            <div className="column is-6 has-text-right has-text-weight-semibold">
              <p>{applications[router.locale].created}:</p>
            </div>
            <div className="column">
              {new Date(application.createdAt).toLocaleDateString(
                router.locale
              )}
            </div>
          </div>
          <div className="columns is-mobile is-1">
            <div className="column is-6 has-text-right has-text-weight-semibold">
              {applications[router.locale].updated}:
            </div>
            <div className="column">
              {new Date(application.updatedAt).toLocaleDateString(
                router.locale
              )}
            </div>
          </div>
        </div>
      </div>
      <footer className="card-footer">
        <Link href={`/staff-application/${application.id}`}>
          <a className="card-footer-item">
            {general.buttons[router.locale].details}
          </a>
        </Link>
        {application.state === "created" && application.step === 3 ? (
          <a onClick={onSubmit} className="card-footer-item">
            {general.buttons[router.locale].submit}
          </a>
        ) : (
          <span
            className="card-footer-item disabled"
            title="You can only submit when the application is finished and not yet submitted"
          >
            {general.buttons[router.locale].submit}
          </span>
        )}
        {application.state === "created" && (
          <>
            <a onClick={onDelete} className="card-footer-item">
              {general.buttons[router.locale].delete}
            </a>
          </>
        )}
      </footer>
    </div>
  );
}
