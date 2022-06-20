import { parseCookie } from "@/helpers/index";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { getUser } from "lib/user";
import DashboardLayout from "@/components/DashboardLayout";
import ProfileCard from "@/components/ProfileCard";

export default function UserView({ user, error }) {
  if (error) {
    toast.error(error.message);
  }
  const router = useRouter();

  return (
    <section className="section has-background-link-light">
      <div className="level is-centered has-text-centered ">
        <div className="level-item p-5">
          <ProfileCard user={user} />
        </div>
      </div>
    </section>
  );
}

UserView.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export async function getServerSideProps({ req, params: { id } }) {
  const { token } = parseCookie(req);

  try {
    const user = await getUser(id, token, ["picture", "role"]);
    return { props: { user, error: null } };
  } catch (error) {
    return { props: { user: null, error } };
  }
}
