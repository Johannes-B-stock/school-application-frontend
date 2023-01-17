import { School, SchoolApplication, User } from "api-definitions/backend";
import InfoTiles from "./InfoTiles";

export default function SchoolInfoTiles({ schools }: { schools: School[] }) {
  let allApplications: SchoolApplication[] = [];
  let allStudents: User[] = [];
  let schoolStaff: User[] = [];
  schools.forEach((school) => {
    allApplications = allApplications.concat(school.applications ?? []);
    allStudents = allStudents.concat(school.students ?? []);
    schoolStaff = schoolStaff.concat(school.staff ?? []);
  });

  const data: { count: number; name: string }[] = [];
  data.push({ count: schools.length, name: "Schools" });
  data.push({ count: allApplications.length, name: "School Applications" });
  data.push({ count: allStudents.length, name: "Students" });
  data.push({ count: schoolStaff.length, name: "School Staff" });

  return <InfoTiles data={data} />;
}
