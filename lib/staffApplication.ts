import { API_URL } from "../config";
import axios from "axios";
import qs from "qs";
import { ApplicationState, StaffApplication } from "api-definitions/backend";
import {
  ArrayDataResponse,
  SingleDataResponse,
} from "api-definitions/strapiBaseTypes";

export async function getStaffApplicationDetails(
  id: string,
  token: string,
  queryObject: object
) {
  const query = qs.stringify(queryObject, { encodeValuesOnly: true });

  const result = await axios.get<SingleDataResponse<StaffApplication>>(
    `${API_URL}/api/staff-applications/${id}?${query}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data;
}

export async function getAllStaffApplications(token: string, query: string) {
  const allStaff = await axios.get<ArrayDataResponse<StaffApplication>>(
    `${API_URL}/api/staff-applications?${query}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return allStaff.data;
}

export async function updateState(
  id: number,
  token: string,
  desiredState: ApplicationState
) {
  const changeFetch = await fetch(`${API_URL}/api/staff-applications/${id}`, {
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
  const fetchUpdate = await fetch(`${API_URL}/api/staff-applications/${id}`, {
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

export async function updateApplication(
  token: string,
  application: StaffApplication
) {
  await axios.put(
    `${API_URL}/api/staff-applications/${application.id}`,
    {
      data: {
        arriveAt: application.arriveAt,
        stayUntil: application.stayUntil ?? undefined,
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
