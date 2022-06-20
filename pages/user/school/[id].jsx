import GoogleSpinner from "@/components/GoogleSpinner";
import { parseCookie } from "@/helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getSchoolDetails } from "lib/school";
import { getAllUsers } from "lib/user";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function MySchoolPage({ school, token }) {
  const [isLoadingStudentDetails, setIsLoadingStudentDetails] = useState(false);
  const [students, setStudents] = useState([]);
  const [isLoadingStaffDetails, setIsLoadingStaffDetails] = useState(false);
  const [staff, setStaff] = useState([]);

  console.log(school.attributes.image);

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

        setIsLoadingStudentDetails(false);
      } catch (error) {
        setIsLoadingStudentDetails(false);
        toast(error.message ?? error);
      } finally {
      }
    }
    fetchData();
  }, [school, token]);

  return (
    <div className="columns">
      <div className="column">
        {/* <Image
          src={
            school.attributes.image?.data.attributes.formats.small?.url
              ? school.attributes.image.data.attributes.formats.small?.url
              : "/images/school-default.png"
          }
          alt="school image"
          objectFit="cover"
          width={school.attributes.image?.data.attributes?.width ?? "800"}
          height={school.attributes.image?.data.attributes?.height ?? "600"}
        /> */}
        <div className="card my-5">
          <div className="card-header">
            <p className="card-header-title background-gradient-light-left">
              General
            </p>
          </div>
          <div className="card-content">
            <div className="columns is-mobile">
              <div className="column is-3 has-text-weight-bold">Name:</div>
              <div className="column">{school.attributes.name}</div>
            </div>
            <div className="columns is-mobile">
              <div className="column is-3 has-text-weight-bold">
                Description:
              </div>
              <div className="column">{school.attributes.description}</div>
            </div>
            {school.attributes.contactEmail && (
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">Contact:</div>
                <div className="column">
                  <a href={`mailto:${school.attributes.contactEmail}`}>
                    {school.attributes.contactEmail}
                  </a>
                </div>
              </div>
            )}

            <div className="columns is-mobile">
              <div className="column is-3 has-text-weight-bold">Starts at:</div>
              <div className="column">
                {new Date(school.attributes.startDate).toLocaleDateString()}
              </div>
            </div>
            <div className="columns is-mobile">
              <div className="column is-3 has-text-weight-bold">Ends at:</div>
              <div className="column">
                {new Date(school.attributes.endDate).toLocaleDateString()}
              </div>
            </div>
            <div className="columns is-mobile">
              <div className="column is-3 has-text-weight-bold">
                Application Fee:
              </div>
              <div className="column">{school.attributes.applicationFee}</div>
            </div>
            <div className="columns is-mobile">
              <div className="column is-3 has-text-weight-bold">
                School Fee:
              </div>
              <div className="column">{school.attributes.schoolFee}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="column">
        <div className="card my-5">
          <header className="card-header">
            <p className="card-header-title background-gradient-primary-right">
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
                          student.picture?.formats.thumbnail?.url ??
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
            <p className="card-header-title background-gradient-primary-right">
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
                      <figure className="image is-50x50 is-rounded">
                        <Image
                          className="image is-50x50 is-rounded"
                          alt={user.username}
                          src={
                            user.picture?.formats.thumbnail?.url ??
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
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params: { id }, req }) {
  const { token } = parseCookie(req);
  const schoolDetails = await getSchoolDetails(id, token, [
    "students",
    "staff",
    "image",
  ]);
  return {
    props: {
      school: schoolDetails.data,
      token,
    },
  };
}
