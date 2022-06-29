import NotAuthorized from "@/components/auth/NotAuthorized";
import NotFound from "@/components/common/NotFound";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import UserAvatar from "@/components/user/UserAvatar";
import { API_URL } from "@/config/index";
import { parseCookie } from "@/helpers/index";
import axios from "axios";
import qs from "qs";

export default function StaffDashboardPage({ staff, error }) {
  if (!staff) {
    return (
      <div className="section">
        <div className="container">
          <NotFound />{" "}
        </div>
      </div>
    );
  }

  return (
    <div className="section is-large">
      <div className="container">
        <div className="title is-2">Staff Overview</div>

        <div className="box">
          <div className="columns is-multiline my-3">
            {staff.map((user) => (
              <div key={user.id} className="column is-narrow has-text-centered">
                <a href={`/user/${user.id}`}>
                  <UserAvatar user={user} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

StaffDashboardPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export async function getServerSideProps({ req }) {
  const { token } = parseCookie(req);

  if (!token) {
    return {
      props: {
        staff: null,
      },
    };
  }

  const query = qs.stringify({
    populate: ["school_applications", "picture", "staff_applications"],
  });
  try {
    const staffReq = await axios.get(`${API_URL}/api/users/staff?${query}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return {
      props: {
        error: error.message ?? error,
      },
    };
  }
  return {
    props: {
      staff: staffReq.data,
    },
  };
}
