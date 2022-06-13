import { API_URL } from "../config";
import qs from "qs";

export async function updateMe(user, token) {
  const userFetch = await fetch(`${API_URL}/api/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: {
        firstname: user.firstname,
        lastname: user.lastname,
        gender: user.gender,
        birthday: user.birthday,
      },
    }),
  });

  const result = await userFetch.json();

  if (!userFetch.ok) {
    throw new Error(result.error?.message ?? userFetch.statusText);
  }
}

export async function getUser(id, token, populate) {
  const userQuery = qs.stringify({
    populate: populate,
  });
  return await fetch(`${API_URL}/api/users/${id}?${userQuery}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
