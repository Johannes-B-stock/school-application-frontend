import GoogleSpinner from "@/components/common/GoogleSpinner";
import UserAvatar from "@/components/user/UserAvatar";
import { parseCookie } from "@/helpers/index";
import { userSchool } from "@/i18n";
import { getSchoolDetails } from "lib/school";
import { getAllUsers } from "lib/user";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function MySchoolPage({ school, token, locale }) {
  const [isLoadingStudentDetails, setIsLoadingStudentDetails] = useState(false);
  const [students, setStudents] = useState([]);
  const [isLoadingStaffDetails, setIsLoadingStaffDetails] = useState(false);
  const [staff, setStaff] = useState([]);

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
            <p className="card-header-title background-gradient-primary-info">
              {userSchool[locale].general}
            </p>
          </div>
          <div className="card-content">
            <div className="columns is-mobile">
              <div className="column is-3 has-text-weight-bold">
                {userSchool[locale].name}:
              </div>
              <div className="column">{school.attributes.name}</div>
            </div>
            <div className="columns is-mobile">
              <div className="column is-3 has-text-weight-bold">
                {userSchool[locale].description}:
              </div>
              <div className="column">{school.attributes.description}</div>
            </div>
            {school.attributes.contactEmail && (
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">
                  {userSchool[locale].contact}:
                </div>
                <div className="column">
                  <a href={`mailto:${school.attributes.contactEmail}`}>
                    {school.attributes.contactEmail}
                  </a>
                </div>
              </div>
            )}

            <div className="columns is-mobile">
              <div className="column is-3 has-text-weight-bold">
                {userSchool[locale].startsAt}:
              </div>
              <div className="column">
                {new Date(school.attributes.startDate).toLocaleDateString()}
              </div>
            </div>
            <div className="columns is-mobile">
              <div className="column is-3 has-text-weight-bold">
                {userSchool[locale].endsAt}:
              </div>
              <div className="column">
                {new Date(school.attributes.endDate).toLocaleDateString()}
              </div>
            </div>
            <div className="columns is-mobile">
              <div className="column is-3 has-text-weight-bold">
                {userSchool[locale].applicationFee}:
              </div>
              <div className="column">{school.attributes.applicationFee}</div>
            </div>
            <div className="columns is-mobile">
              <div className="column is-3 has-text-weight-bold">
                {userSchool[locale].schoolFee}:
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
              {userSchool[locale].students}
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
                    <UserAvatar user={student} />
                  </div>
                ))}
              </div>
            )}
            {students.length === 0 && (
              <p>{userSchool[locale].noStudentsAccepted}</p>
            )}
          </div>
        </div>
        <div className="card my-5">
          <header className="card-header">
            <p className="card-header-title background-gradient-primary-right">
              {userSchool[locale].staff}
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
                    <UserAvatar user={user} />
                  </div>
                ))}
              </div>
            )}
            {staff.length === 0 && <p>{userSchool[locale].noStaffYet}</p>}
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params: { id },
  req,
  locale,
}) => {
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
      locale,
    },
  };
};
