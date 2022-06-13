import { API_URL } from "../config";
import axios from "axios";
import qs from "qs";

export async function getApplicationDetails(id, token, populate) {
  const query = qs.stringify(
    {
      populate,
    },
    { encodeValuesOnly: true }
  );

  const result = await axios.get(
    `${API_URL}/api/school-applications/${id}?${query}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data;
}

export async function updateState(id, token, desiredState) {
  const changeFetch = await fetch(`${API_URL}/api/school-applications/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: {
        state: desiredState,
      },
    }),
  });
  if (!changeFetch.ok) {
    const result = await changeFetch.json();
    throw new Error(result.error?.message ?? changeFetch.statusText);
  }
}

export async function updateStep(id, step, token) {
  const fetchUpdate = await fetch(`${API_URL}/api/school-applications/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: {
        step,
      },
    }),
  });
  const result = await fetchUpdate.json();

  if (fetchUpdate.ok) {
    return { ok: true };
  } else {
    return {
      ok: false,
      errorMessage: result.message || fetchUpdate.statusText,
    };
  }
}

export async function addUserToSchool(application, token) {
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

export async function getSchoolStudents(id, token) {
  const query = qs.stringify({
    populate: ["students"],
  });
  const result = await axios.get(`${API_URL}/api/schools/${id}?${query}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return result.data.data.attributes.students.data;
}
