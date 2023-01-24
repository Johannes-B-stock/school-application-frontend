import qs from "qs";
import { API_URL } from "../config";
import axios from "axios";
import _ from "lodash";
import {
  ArrayDataResponse,
  SingleDataResponse,
} from "api-definitions/strapiBaseTypes";
import { School, SchoolApplication, User } from "api-definitions/backend";

export async function getPaginatedApplications(
  page: number,
  stateFilter: string,
  token: string,
  schoolId: number | null = null,
  pageSize = 10
) {
  const queryObject = {
    populate: { school: { populate: "" }, user: { populate: "picture" } },
    sort: "createdAt:desc",
    pagination: {
      page: page,
      pageSize,
    },
    filters: {},
  };
  setApplicationFilter(stateFilter, queryObject);
  if (schoolId) {
    queryObject.filters = {
      ...queryObject.filters,
      school: {
        id: {
          $eq: schoolId,
        },
      },
    };
  }
  const query = qs.stringify(queryObject, { encodeValuesOnly: true });
  const appFetch = await axios.get<ArrayDataResponse<SchoolApplication>>(
    `${API_URL}/api/school-applications?${query}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return appFetch;
}

export function setApplicationFilter(
  stateFilter: string,
  queryObject: {
    filters: object;
  }
) {
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
}

export async function addMultipleStaffToSchool(
  userIds: number[],
  schoolId: number,
  token: string
) {
  const staff = await getSchoolStaff(schoolId, token);
  const result = await axios.put(
    `${API_URL}/api/schools/${schoolId}`,
    {
      data: {
        staff: [...staff, ...userIds],
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result;
}

export async function addStaffToSchool(
  userId: number,
  schoolId: number,
  token: string
) {
  const staff = await getSchoolStaff(schoolId, token);
  const result = await axios.put(
    `${API_URL}/api/schools/${schoolId}`,
    {
      data: {
        staff: [...staff, userId],
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result;
}

export async function removeStaffFromSchool(
  userId: number,
  schoolId: number,
  token: string
) {
  const staff = await getSchoolStaff(schoolId, token);
  _.remove(staff, (user) => user.id === userId);
  const result = await axios.put(
    `${API_URL}/api/schools/${schoolId}`,
    {
      data: {
        staff: [...staff],
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result;
}

export async function getSchoolStaff(
  schoolId: number,
  token: string
): Promise<User[]> {
  const query = qs.stringify({
    populate: ["staff"],
  });
  const result = await axios.get<SingleDataResponse<School>>(
    `${API_URL}/api/schools/${schoolId}?${query}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data.data?.staff ?? [];
}

export async function getSchoolStudents(schoolId: number, token: string) {
  const query = qs.stringify({
    populate: ["students"],
  });
  const result = await axios.get<SingleDataResponse<School>>(
    `${API_URL}/api/schools/${schoolId}?${query}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data.data?.students ?? [];
}

export async function getSchoolDetails(
  id: string | string[],
  token: string,
  populate: string[] | object
) {
  const query = qs.stringify(
    {
      populate,
    },
    { encodeValuesOnly: true }
  );
  const schoolData = await axios.get<SingleDataResponse<School>>(
    `${API_URL}/api/schools/${id}?${query}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return schoolData.data;
}
