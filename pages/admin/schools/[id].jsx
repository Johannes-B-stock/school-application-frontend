import DashboardLayout from "@/components/DashboardLayout";
import NotAuthorized from "@/components/NotAuthorized";
import AuthContext from "@/context/AuthContext";
import { useContext } from "react";

export default function SchoolAdmin({ school }) {
  const { user } = useContext(AuthContext);

  if (
    !user ||
    user.role.name.toLowerCase() !== "schooladmin" ||
    user.role.name.toLowerCase() !== "admin"
  ) {
    return <NotAuthorized />;
  }
  return <div>SchoolAdmin</div>;
}

SchoolAdmin.getLayout = function getLayout(page) {
  return <DashboardLayout> {page}</DashboardLayout>;
};

export function getServerSideProps({ id }) {
  return { props: {} };
}
