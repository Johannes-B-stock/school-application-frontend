import { API_URL, NEXT_URL } from "../config";
import axios from "axios";
import qs from "qs";
import {
  StaffApplication,
  StaffApplicationSetting,
} from "api-definitions/backend";
import {
  ArrayDataResponse,
  SingleDataResponse,
} from "api-definitions/strapiBaseTypes";
import { createHeaders } from "./common";

export async function getStaffApplicationDetails(
  id: string,
  token: string,
  query?: object | string
) {
  let queryString = query === undefined ? "" : "?";
  if (typeof query === "object") {
    queryString += qs.stringify(query, { encodeValuesOnly: true });
  } else {
    queryString += query ? query : "";
  }
  const result = await axios.get<SingleDataResponse<StaffApplication>>(
    `${API_URL}/api/staff-applications/${id}${queryString}`,
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

export async function updateApplicationDates(
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

export async function getStaffApplicationSettings(options?: {
  token?: string;
  query?: string;
}) {
  const headers = createHeaders(options?.token);

  const result = await axios.get<SingleDataResponse<StaffApplicationSetting>>(
    `${API_URL}/api/staff-application-setting${
      options?.query ? "?" + options?.query : ""
    }`,
    {
      headers: headers,
    }
  );
  return result.data;
}

export async function createApplication(
  userId: number,
  questionCollectionId: number
) {
  const application = await axios.post<StaffApplication>(
    `${NEXT_URL}/api/application/create-staff-application`,
    {
      questionCollectionId: questionCollectionId,
      userId,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return application.data;
}
