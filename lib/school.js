import qs from "qs";
import { API_URL } from "../config";
import axios from "axios";
import _ from "lodash";

export async function getPaginatedApplications(
  page,
  stateFilter,
  token,
  schoolId,
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

export async function addMultipleStaffToSchool(userIds, schoolId, token) {
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

export async function addStaffToSchool(userId, schoolId, token) {
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

export async function removeStaffFromSchool(userId, schoolId, token) {
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

export async function getSchoolStaff(schoolId, token) {
  const query = qs.stringify({
    populate: ["staff"],
  });
  const result = await axios.get(
    `${API_URL}/api/schools/${schoolId}?${query}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data.data.attributes.staff.data;
}

export async function getSchoolStudents(schoolId, token) {
  const query = qs.stringify({
    populate: ["students"],
  });
  const result = await axios.get(
    `${API_URL}/api/schools/${schoolId}?${query}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data.data.attributes.students.data;
}

export async function getSchoolDetails(id, token, populate) {
  const query = qs.stringify(
    {
      populate,
    },
    { encodeValuesOnly: true }
  );
  const schoolData = await axios.get(`${API_URL}/api/schools/${id}?${query}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return schoolData.data;
}

export async function addStudentToSchool(application, token) {
  if (application.attributes.state !== "approved") {
    return;
  }
  const userId = application.attributes.user.data.id;
  const schoolId = application.attributes.school.data.id;

  const students = await getSchoolStudents(schoolId, token);
  const result = await axios.put(
    `${API_URL}/api/schools/${schoolId}`,
    {
      data: {
        students: [...students, userId],
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
