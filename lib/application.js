import { API_URL } from "../config";

export async function submitApplication(id, token) {
  const submitFetch = await fetch(`${API_URL}/api/school-applications/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: {
        state: "submitted",
      },
    }),
  });
  const result = await submitFetch.json();
  if (!submitFetch.ok) {
    throw new Error(result.error?.message ?? submitFetch.statusText);
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
