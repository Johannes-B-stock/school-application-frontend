import { Application, ApplicationState } from "api-definitions/backend";
import { SingleDataResponse } from "api-definitions/strapiBaseTypes";
import axios from "axios";
import { API_URL } from "../config";

export async function deleteApplicationRequest(
  id: number,
  token: string,
  type: "school" | "staff"
) {
  const deleteFetch = await axios.delete<SingleDataResponse<Application>>(
    `${API_URL}/api/${type}-applications/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (deleteFetch.status !== 200) {
    throw new Error(deleteFetch.data?.error?.message ?? deleteFetch.statusText);
  }
  return deleteFetch.data.data;
}

export async function updateState(
  applicationId: number,
  token: string,
  desiredState: ApplicationState,
  type: "school" | "staff"
) {
  const changeFetch = await fetch(
    `${API_URL}/api/${type}-applications/${applicationId}`,
    {
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
    }
  );
  if (!changeFetch.ok) {
    const result = await changeFetch.json();
    throw new Error(result.error?.message ?? changeFetch.statusText);
  }
}

export async function updateStep(
  id: number,
  step: number,
  token: string,
  type: "school" | "staff"
) {
  const fetchUpdate = await fetch(`${API_URL}/api/${type}-applications/${id}`, {
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
