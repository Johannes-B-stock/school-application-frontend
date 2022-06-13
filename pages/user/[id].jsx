import { parseCookie } from "@/helpers/index";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { getUser } from "lib/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBirthdayCake,
  faEnvelope,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import DashboardLayout from "@/components/DashboardLayout";
import styles from "@/styles/ProfilePage.module.css";

export default function UserView({ user, error }) {
  if (error) {
    toast.error(error.message);
  }
  const router = useRouter();

  return (
    <section className="section has-background-link-light">
      <div className="level is-centered has-text-centered ">
        <div className="level-item p-5">
          <div className={`box ${styles.profileHeaderCard} backgroundGradient`}>
            <div className="image is-130x130 is-rounded my-4">
              <Image
                className="image is-130x130 is-rounded"
                alt="Profile"
                src={
                  user?.picture?.formats.small.url ??
                  "/images/defaultAvatar.png"
                }
                width="130px"
                height="130px"
                objectFit="cover"
              />
            </div>
            <h1 className="title is-3">{user.username}</h1>
            <h3 className="is-6 has-text-grey mb-5">{user.role.name}</h3>
            <div className="has-text-left">
              <div className="columns">
                <div className="column is-2 has-text-right has-text-weight-bold">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <div className="column">
                  {user?.firstname} {user?.lastname}{" "}
                </div>
              </div>
              <div className="columns">
                <div className="column is-2 has-text-right has-text-weight-bold">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div className="column">{user?.email}</div>
              </div>
              <div className="columns">
                <div className="column is-2 has-text-right has-text-weight-bold">
                  <FontAwesomeIcon icon={faBirthdayCake} />
                </div>
                <div className="column">
                  {user?.birthday
                    ? new Date(user.birthday).toLocaleDateString()
                    : "-"}
                </div>
              </div>
            </div>
          </div>
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

  const userFetch = await getUser(id, token, ["picture", "role"]);

  const userResult = await userFetch.json();
  let user = null;
  let error = null;
  if (userFetch.ok) {
    user = userResult;
  } else {
    error = userResult.error;
  }

  return {
    props: {
      user,
      error,
    },
  };
}
