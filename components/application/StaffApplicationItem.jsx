import Link from "next/link";
import styles from "@/styles/ApplicationItem.module.css";
import { API_URL } from "../../config";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

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
        <p className="title is-4 has-text-centered">Staff Application</p>
        <p className="mt-3 subtitle is-italic is-6 has-text-grey">
          arrive at: {new Date(application.arriveAt).toLocaleDateString()}
          <br />
          leave at: {new Date(application.stayUntil).toLocaleDateString()}
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
            <div className="column is-4 has-text-weight-semibold">status:</div>
            <div className="column">{application.state ?? "unknown"}</div>
          </div>
          <div className="columns is-mobile is-1">
            <div className="column is-4 has-text-weight-semibold">
              <p>created:</p>
            </div>
            <div className="column">
              {new Date(application.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="columns is-mobile is-1">
            <div className="column is-4 has-text-weight-semibold">updated:</div>
            <div className="column">
              {new Date(application.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
      <footer className="card-footer">
        <Link href={`/staff-application/${application.id}`}>
          <a className="card-footer-item">Details</a>
        </Link>
        {application.state === "created" && application.step === 3 ? (
          <a onClick={onSubmit} className="card-footer-item">
            Submit
          </a>
        ) : (
          <span
            className="card-footer-item disabled"
            title="You can only submit when the application is finished and not yet submitted"
          >
            Submit
          </span>
        )}
        {application.state === "created" && (
          <>
            <a onClick={onDelete} className="card-footer-item">
              Delete
            </a>
          </>
        )}
      </footer>
    </div>
  );
}
