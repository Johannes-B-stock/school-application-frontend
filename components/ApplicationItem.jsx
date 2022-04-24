import Link from "next/link";
import styles from "@/styles/ApplicationItem.module.css";
import { API_URL } from "../config";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function ApplicationItem({ application, token }) {
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
      `${API_URL}/api/school-applications/${application.id}`,
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
      router.push("/user/applications");
    } else {
      toast.error(`Delete failed: ${res.statusText}`);
    }
  };

  const onSubmit = async () => {
    const res = await fetch(
      `${API_URL}/api/school-applications/${application.id}`,
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
        <p className="title">
          <Link href={`/schools/${application.school.data.id}`}>
            <span>
              Application for school {application.school.data.attributes.name}
            </span>
          </Link>
        </p>
        <p className="subtitle is-italic is-6">
          school starts:{" "}
          {new Date(
            application.school.data.attributes.startDate
          ).toLocaleDateString()}
          <br />
          school ends:{" "}
          {new Date(
            application.school.data.attributes.endDate
          ).toLocaleDateString()}
        </p>
        <div className="content has-text-left">
          <div className="columns is-1">
            <div className="column is-3">status:</div>
            <div className="column has-text-weight-bold">
              {application.state ?? "unknown"}
            </div>
          </div>
          <div className="columns is-1">
            <div className="column is-3">
              <p>created:</p>
            </div>
            <div className="column">
              {new Date(application.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="columns is-1">
            <div className="column is-3">updated:</div>
            <div className="column">
              {new Date(application.updatedAt).toLocaleDateString()}
            </div>
          </div>
          <br />
        </div>
      </div>
      <footer className="card-footer">
        <Link href={`/applications/${application.id}`}>
          <a className="card-footer-item">Details</a>
        </Link>

        {application.state === "created" ? (
          <>
            <a onClick={onSubmit} className="card-footer-item">
              Submit
            </a>
            <a onClick={onDelete} className="card-footer-item">
              Delete
            </a>
          </>
        ) : (
          <span className="card-footer-item">Submit</span>
        )}
      </footer>
    </div>
  );
}
