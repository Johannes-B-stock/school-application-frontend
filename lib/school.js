import qs from "qs";
import { API_URL } from "../config";

export async function getPaginatedApplications(
  page,
  stateFilter,
  token,
  pageSize = 10
) {
  let queryObject = {
    populate: ["school", "user"],
    sort: "createdAt:desc",
    pagination: {
      page: page,
      pageSize,
    },
  };
  if (stateFilter) {
    if (stateFilter === "open") {
      queryObject.filters = {
        state: {
          $notIn: ["approved", "revoked"],
        },
      };
    } else {
      queryObject.filters = {
        state: {
          $eq: stateFilter,
        },
      };
    }
  }
  const query = qs.stringify(queryObject);
  const appFetch = await fetch(`${API_URL}/api/school-applications?${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return appFetch;
}
