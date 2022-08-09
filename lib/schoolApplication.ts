import { API_URL } from "../config";
import axios from "axios";
import qs from "qs";

export async function getApplicationDetails(
  id: string,
  token: string,
  populate: string[]
) {
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

export async function updateState(
  id: string,
  token: string,
  desiredState: string
) {
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

export async function updateStep(id: string, step: number, token: string) {
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
