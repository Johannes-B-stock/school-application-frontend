import styles from "@/styles/InfoTiles.module.css";

export default function InfoTiles({ schools }) {
  let allApplications = [];
  let allStudents = [];
  let schoolStaff = [];
  schools.forEach((school) => {
    allApplications = allApplications.concat(
      school.attributes.applications.data
    );
    allStudents = allStudents.concat(school.attributes.students.data);
    schoolStaff = schoolStaff.concat(school.attributes.staff.data);
  });

  return (
    <div className="tile is-ancestor has-text-centered">
      <div className="tile is-parent">
        <article className="tile is-child box">
          <p className="title">{schools.length}</p>
          <p className={`subtitle ${styles.subtitle}`}>Schools</p>
        </article>
      </div>
      <div className="tile is-parent">
        <article className="tile is-child box">
          <p className="title">{allApplications.length}</p>
          <p className={`subtitle ${styles.subtitle}`}>Applications</p>
        </article>
      </div>
      <div className="tile is-parent">
        <article className="tile is-child box">
          <p className="title">{allStudents.length}</p>
          <p className={`subtitle ${styles.subtitle}`}>Students</p>
        </article>
      </div>
      <div className="tile is-parent">
        <article className="tile is-child box">
          <p className="title">{schoolStaff.length}</p>
          <p className={`subtitle ${styles.subtitle}`}>Staff</p>
        </article>
      </div>
    </div>
  );
}
