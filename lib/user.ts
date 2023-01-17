import { API_URL } from "../config";
import qs from "qs";
import axios from "axios";
import { User } from "api-definitions/backend";

export async function getMyDetails(token: string): Promise<User> {
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
  const strapiRes = await axios.get<User>(`${API_URL}/api/users/me?${query}`, {
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
  await axios.post(
    `${API_URL}/api/auth/change-password`,
    {
      currentPassword,
      password: newPassword,
      passwordConfirmation: newPassword,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
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

  (await userFetch.json()) as User;

  if (!userFetch.ok) {
    throw new Error(userFetch.statusText);
  }
}

export async function findUsersWithName(
  nameFilter: string[],
  token: string,
  populate: string[],
  filters: { [key: string]: any }
): Promise<User[]> {
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
  const users = await axios.get<User[]>(`${API_URL}/api/users?${query}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return users.data;
}

export async function getAllUsers(
  ids: number[],
  token: string,
  populate: string[]
) {
  if (ids.length === 0) {
    return [];
  }
  return Promise.all(
    ids.map(async (userId) => await getUser(userId, token, populate))
  );
}

export async function getUser(
  id: number,
  token: string,
  populate: string[]
): Promise<User> {
  const userQuery = qs.stringify({
    populate,
  });
  const userResult = await axios.get<User>(
    `${API_URL}/api/users/${id}?${userQuery}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (userResult.status !== 200) {
    throw new ApiError(
      userResult.status,
      `User can not be found because ${userResult.status} - ${userResult.statusText}`
    );
  }
  return userResult.data;
}

export class ApiError extends Error {
  /**
   *
   */
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}
