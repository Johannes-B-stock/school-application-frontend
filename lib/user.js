import { API_URL } from "../config";
import qs from "qs";
import axios from "axios";

export async function getMyDetails(token) {
  const query = qs.stringify({
    populate: ["role", "schools", "school_applications", "picture", "address"],
  });
  const strapiRes = await axios.get(`${API_URL}/api/users/me?${query}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return strapiRes.data;
}

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

export async function findUsersWithName(nameFilter, token, populate, filters) {
  const queryObject = {
    populate,
    filters: filters,
  };
  if (nameFilter?.length > 0) {
    queryObject.filters = {
      $and: [
        {
          ...queryObject.filters,
        },
        {
          $or: [
            {
              username: {
                $containsi: nameFilter,
              },
            },
            {
              firstname: {
                $containsi: nameFilter,
              },
            },
            {
              lastname: {
                $containsi: nameFilter,
              },
            },
          ],
        },
      ],
    };
  }
  const query = qs.stringify(queryObject);
  const users = await axios.get(`${API_URL}/api/users?${query}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return users.data;
}

export async function getAllUsers(ids, token, populate) {
  if (ids.length === 0) {
    return [];
  }
  return await Promise.all(
    ids.map(async (userId) => {
      return await getUser(userId, token, populate);
    })
  );
}

export async function getUser(id, token, populate) {
  const userQuery = qs.stringify({
    populate: populate,
  });
  const userResult = await axios.get(
    `${API_URL}/api/users/${id}?${userQuery}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return userResult.data;
}
