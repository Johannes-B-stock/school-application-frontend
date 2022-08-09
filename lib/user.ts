import { API_URL } from "../config";
import qs from "qs";
import axios from "axios";
import { User, UsersResponse } from "definitions/backend";

export async function getMyDetails(token: string) {
  const query = qs.stringify({
    populate: [
      "role",
      "schools",
      "school_applications",
      "picture",
      "address",
      "details",
      "emergency_address",
    ],
  });
  const strapiRes = await axios.get(`${API_URL}/api/users/me?${query}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return strapiRes.data;
}

export async function updateMyPassword(
  currentPassword: string,
  newPassword: string,
  token: string
) {
  const userResult = await axios.put<User>(
    `${API_URL}/api/users/change-password`,
    {
      currentPassword,
      newPassword,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return userResult;
}

export async function updateMe(user: User, token: string) {
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
        middle_names: user.middle_names,
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

export async function findUsersWithName(
  nameFilter: string[],
  token: string,
  populate: string[],
  filters: { [key: string]: any }
) {
  const queryObject = {
    populate,
    filters,
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
  const users = await axios.get<UsersResponse>(
    `${API_URL}/api/users?${query}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return users.data;
}

export async function getAllUsers(
  ids: string[],
  token: string,
  populate: string[]
) {
  if (ids.length === 0) {
    return [];
  }
  return await Promise.all(
    ids.map(async (userId) => {
      return await getUser(userId, token, populate);
    })
  );
}

export async function getUser(id: string, token: string, populate: string[]) {
  const userQuery = qs.stringify({
    populate,
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
