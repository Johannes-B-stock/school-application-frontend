import { API_URL } from "../config";
import axios from "axios";
import qs from "qs";
import { SingleDataResponse } from "api-definitions/strapiBaseTypes";
import { SchoolApplication } from "api-definitions/backend";

export async function getApplicationDetails(
  id: string,
  token: string,
  queryObject: object
) {
  const query = qs.stringify(queryObject, { encodeValuesOnly: true });
  console.log(query);

  const result = await axios.get<SingleDataResponse<SchoolApplication>>(
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
  id: number,
  token: string,
  desiredState: string,
  type: "school" | "staff" = "school"
) {
  const changeFetch = await fetch(`${API_URL}/api/${type}-applications/${id}`, {
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

export async function updateStep(id: number, step: number, token: string) {
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
