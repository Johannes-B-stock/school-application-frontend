import UserAvatar from "@/components/user/UserAvatar";
import { parseCookie } from "lib/utils";
import { userSchool } from "@/i18n";
import { getSchoolDetails } from "lib/school";
import { GetServerSideProps } from "next";
import Currency from "@/components/common/Currency";
import { School } from "api-definitions/backend";
import { useLocale } from "i18n/useLocale";

export default function MySchoolPage({ school }: { school: School }) {
  const locale = useLocale();
  const localizedSchool =
    school.localizations?.find((school) => school.locale === locale) ?? school;

  return (
    <div className="columns">
      <div className="column">
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
              <div className="column">{localizedSchool.name}</div>
            </div>
            <div className="columns is-mobile">
              <div className="column is-3 has-text-weight-bold">
                {userSchool[locale].description}:
              </div>
              <div className="column">{localizedSchool.description}</div>
            </div>
            {school.contactEmail && (
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">
                  {userSchool[locale].contact}:
                </div>
                <div className="column">
                  <a href={`mailto:${school.contactEmail}`}>
                    {school.contactEmail}
                  </a>
                </div>
              </div>
            )}

            <div className="columns is-mobile">
              <div className="column is-3 has-text-weight-bold">
                {userSchool[locale].startsAt}:
              </div>
              <div className="column">
                {new Date(school.startDate).toLocaleDateString()}
              </div>
            </div>
            <div className="columns is-mobile">
              <div className="column is-3 has-text-weight-bold">
                {userSchool[locale].endsAt}:
              </div>
              <div className="column">
                {new Date(school.endDate).toLocaleDateString()}
              </div>
            </div>
            <div className="columns is-mobile">
              <div className="column is-3 has-text-weight-bold">
                {userSchool[locale].applicationFee}:
              </div>
              <div className="column">
                <Currency
                  value={+school.applicationFee}
                  currency={school.currency}
                />
              </div>
            </div>
            <div className="columns is-mobile">
              <div className="column is-3 has-text-weight-bold">
                {userSchool[locale].schoolFee}:
              </div>
              <div className="column">
                <Currency
                  value={+school.schoolFee}
                  currency={school.currency}
                />
              </div>
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
            <div className="columns is-multiline is-mobile">
              {school.students?.map((student) => (
                <div
                  className="column is-narrow has-text-centered"
                  key={student.id}
                >
                  <UserAvatar user={student} />
                </div>
              ))}
            </div>

            {(!school?.students || school?.students?.length === 0) && (
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
            <div className="columns is-multiline is-mobile">
              {school.staff?.map((staff) => (
                <div
                  className="column is-narrow has-text-centered m-1"
                  key={staff.id}
                >
                  <UserAvatar user={staff} />
                </div>
              ))}
            </div>

            {(!school.staff || school.staff.length === 0) && (
              <p>{userSchool[locale].noStaffYet}</p>
            )}
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const id = typeof params?.id === "string" ? params.id : params?.id?.[0];

  if (!id) {
    throw new Error("No school id given");
  }
  const { token } = parseCookie(req);

  if (!token) {
    throw new Error("Not logged in");
  }

  const schoolDetails = await getSchoolDetails(id, token, {
    students: {
      populate: ["picture"],
    },
    staff: {
      populate: ["picture"],
    },
    image: {},
    localizations: {},
  });
  return {
    props: {
      school: schoolDetails.data,
      token,
    },
  };
};
