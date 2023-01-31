import NotFound from "@/components/common/NotFound";
import Pagination from "@/components/common/Pagination";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import UserAvatar from "@/components/user/UserAvatar";
import { API_URL } from "@/config/index";
import { parseCookie } from "lib/utils";
import { GetServerSideProps } from "next";
import qs from "qs";
import { useEffect, useState } from "react";
import {
  GetAllStaffResponse,
  StaffApplication,
  User,
} from "api-definitions/backend";
import { Pagination as ApiPagination } from "api-definitions/strapiBaseTypes";
import { getAllStaffApplications } from "lib/staffApplication";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import ApplicationsTable from "@/components/admin/ApplicationsTable";
import { setApplicationFilter } from "lib/school";
import InfoTiles from "@/components/admin/InfoTiles";

export default function StaffDashboardPage({
  staff,
  pagination,
  token,
}: {
  staff: User[];
  pagination: ApiPagination;
  token: string;
}) {
  const [staffApplicationPagination, setStaffApplicationPagination] = useState<
    ApiPagination | undefined
  >(pagination);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const [staffApplications, setStaffApplications] = useState<
    StaffApplication[]
  >([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    loadStaffApplications();

    async function loadStaffApplications() {
      try {
        setIsLoadingApplications(true);
        const queryObject = {
          populate: {
            references: {
              populate: "",
            },
            answers: {
              populate: "question",
            },
            user: {
              populate: "picture",
            },
          },
          sort: ["createdAt:desc"],
          pagination: {
            page: page,
            pageSize: 40,
          },
          filters: {},
        };
        setApplicationFilter(filter, queryObject);
        const query = qs.stringify(queryObject, { encodeValuesOnly: true });
        const allStaffApplications = await getAllStaffApplications(
          token,
          query
        );
        if (allStaffApplications.error) {
          toast.error(allStaffApplications.error.message);
          return;
        }
        setStaffApplications(allStaffApplications.data ?? []);
        setStaffApplicationPagination(allStaffApplications.meta?.pagination);
      } catch (error: any) {
        toast.error(error?.message ?? error);
      } finally {
        setIsLoadingApplications(false);
      }
    }
  }, [filter, page, token]);

  if (!staff) {
    return (
      <div className="section">
        <div className="container">
          <NotFound />{" "}
        </div>
      </div>
    );
  }

  const infoTilesData = [
    { count: pagination?.total ?? 0, name: "Base Staff" },
    {
      count: staffApplicationPagination?.total ?? 0,
      name: "Staff Applications",
    },
  ];

  return (
    <div className="section has-background-light">
      <div className="container has-text-centered">
        <div className="level has-text-centered">
          <div className="level-item">
            <p className="title">Staff Admin Dashboard</p>
          </div>
        </div>
        <InfoTiles data={infoTilesData} />
        <div className="tile is-ancestor">
          <div className="tile ">
            <div className="tile is-parent is-vertical">
              <div className="tile card is-child mb-7">
                <header className="card-header">
                  <p className="card-header-title">Staff</p>
                </header>
                <div className="card-content" style={{ overflow: "auto" }}>
                  <div className="columns is-multiline my-3">
                    {staff.map((user) => (
                      <div
                        key={user.id}
                        className="column is-narrow has-text-centered"
                      >
                        <a href={`/user/${user.id}`}>
                          <UserAvatar user={user} />
                        </a>
                      </div>
                    ))}
                  </div>
                  <div className="p-3">
                    <Pagination
                      pagination={staffApplicationPagination}
                      changePage={setPage}
                    />
                  </div>
                </div>
              </div>
              <nav className="tile is-child panel">
                <p className="panel-heading has-background-primary">
                  Staff Applications
                </p>
                <p className="panel-tabs">
                  <a
                    className={filter === "" ? `is-active` : ""}
                    onClick={() => setFilter("")}
                  >
                    All
                  </a>
                  <a
                    className={filter === "open" ? `is-active` : ""}
                    onClick={() => setFilter("open")}
                  >
                    Open
                  </a>
                  <a
                    className={filter === "submitted" ? `is-active` : ""}
                    onClick={() => setFilter("submitted")}
                  >
                    Submitted
                  </a>
                  <a
                    className={filter === "reviewed" ? `is-active` : ""}
                    onClick={() => setFilter("reviewed")}
                  >
                    Reviewed
                  </a>
                  <a
                    className={filter === "approved" ? `is-active` : ""}
                    onClick={() => setFilter("approved")}
                  >
                    Approved
                  </a>
                  <a
                    className={filter === "revoked" ? `is-active` : ""}
                    onClick={() => setFilter("revoked")}
                  >
                    Revoked
                  </a>
                </p>
                {isLoadingApplications && (
                  <span className="panel-icon">
                    <FontAwesomeIcon icon={faSpinner} spin={true} />
                  </span>
                )}
                {staffApplications && (
                  <ApplicationsTable
                    applications={staffApplications}
                    applicationPagination={staffApplicationPagination}
                    setPage={setPage}
                    setApplications={setStaffApplications}
                    token={token}
                  />
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

StaffDashboardPage.getLayout = function getLayout(page: any) {
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
      sort: "username:desc",
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
  const staffRes = (await staffReq.json()) as GetAllStaffResponse;
  if (!staffReq.ok) {
    return {
      props: {
        error: `${staffReq.status} ${staffReq.statusText}`,
      },
    };
  }
  return {
    props: {
      staff: staffRes.staff,
      pagination: staffRes?.pagination,
      token,
    },
  };
};
