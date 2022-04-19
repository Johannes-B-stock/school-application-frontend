import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/ApplicationItem.module.css";

export default function ApplicationItem({ application }) {
  const onDelete = () => {};

  const onSubmit = () => {};

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
          <time dateTime="2016-1-1">{application.startDate}</time> -
          <time>{application.endDate}</time>
        </p>
        <div className="content">
          {application.status}
          <br />
        </div>
      </div>
      <footer className="card-footer">
        <Link href={`/applications/${application.id}`}>
          <a className="card-footer-item">Details</a>
        </Link>

        {application.isSubmitted ? (
          <span className="card-footer-item">Submit</span>
        ) : (
          <a onClick={onSubmit} className="card-footer-item">
            Submit
          </a>
        )}
      </footer>
    </div>
  );
}
