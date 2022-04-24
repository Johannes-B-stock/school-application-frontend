import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/SchoolItem.module.css";

export default function SchoolItem({ school }) {
  return (
    <div className={`card ${styles.schoolItem}`}>
      <div className="card-image">
        <Image
          src={school.image ? school.image : "/images/school-default.png"}
          alt="school image"
          width="800"
          height="600"
        />
      </div>
      <div className="card-content">
        <p className="title">{school.name}</p>
        <p className="subtitle is-italic is-6">
          <time dateTime="2016-1-1">{school.startDate}</time> -
          <time>{school.endDate}</time>
        </p>
        <div className="content">
          {school.description}
          <br />
        </div>
      </div>
      <footer className="card-footer">
        <Link href={`/schools/${school.id}`}>
          <a className="card-footer-item">Details</a>
        </Link>
        {school.acceptingStudents ? (
          <Link href={`/schools/${school.id}/apply`}>
            <a className="card-footer-item">Apply</a>
          </Link>
        ) : (
          <span className="card-footer-item">Apply</span>
        )}
      </footer>
    </div>
  );
}
