import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSchool,
  faSchoolLock,
  faEye,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

export default function SchoolsTable({ schools }) {
  const router = useRouter();

  return (
    <table className="table is-fullwidth is-striped">
      <tbody>
        {schools &&
          schools.map((school) => (
            <tr key={school.id}>
              <td width="5%">
                <span className="icon has-text-info">
                  <FontAwesomeIcon
                    icon={school.attributes.isPublic ? faSchool : faSchoolLock}
                  />
                </span>
              </td>
              <td>{school.attributes.name}</td>
              <td>
                <span className="is-italic has-text-grey is-size-6">
                  {" "}
                  {new Date(
                    school.attributes.startDate
                  ).toLocaleDateString()} -{" "}
                  {new Date(school.attributes.endDate).toLocaleDateString()}
                </span>
              </td>
              <td>
                <span
                  className={`tag ${
                    school.attributes.isSecondary ? "is-warning" : "is-danger"
                  }`}
                >
                  {school.attributes.isSecondary ? "Secondary school" : "DTS"}
                </span>
              </td>
              <td>{school.attributes.students.data.length} Students</td>
              <td>
                <div
                  className="button is-small is-primary mx-1"
                  title="View"
                  onClick={() => router.push(`/admin/schools/${school.id}`)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </div>
                <div
                  className="button is-small is-link mx-1"
                  title="Edit"
                  onClick={() => router.push(`/schools/${school.id}/edit`)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
