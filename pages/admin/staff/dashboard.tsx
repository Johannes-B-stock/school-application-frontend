import NotAuthorized from "@/components/auth/NotAuthorized";
import NotFound from "@/components/common/NotFound";
import Pagination from "@/components/common/Pagination";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import UserAvatar from "@/components/user/UserAvatar";
import { API_URL } from "@/config/index";
import { parseCookie } from "@/helpers/index";
import axios from "axios";
import { GetServerSideProps } from "next";
import qs from "qs";
import { useState } from "react";

export default function StaffDashboardPage({ staff, error, pagination }) {
  const [staffPagination, setStaffPagination] = useState(pagination);
  const [page, setPage] = useState(null);

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
    <div className="section is-medium">
      <div className="container has-text-centered">
        <div className="title is-2">Staff</div>

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
          <div className="p-3">
            <Pagination pagination={staffPagination} changePage={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
}

StaffDashboardPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { token } = parseCookie(req);

  if (!token) {
    return {
      props: {
        staff: null,
      },
    };
  }

  const query = qs.stringify(
    {
      populate: ["school_applications", "picture", "staff_applications"],
      sort: ["username:desc"],
      pagination: {
        page: 1,
        pageSize: 40,
      },
    },
    { encodeValuesOnly: true }
  );
  const staffReq = await fetch(`${API_URL}/api/users/staff?${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const staffRes = await staffReq.json();
  if (!staffReq.ok) {
    return {
      props: {
        error: staffRes.error.message ?? staffRes.error,
      },
    };
  }
  return {
    props: {
      staff: staffRes.users,
      pagination: staffRes?.pagination,
      error: staffRes.error?.message ?? staffReq.statusText,
    },
  };
}
