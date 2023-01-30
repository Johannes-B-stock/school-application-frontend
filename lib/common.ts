import { Role } from "api-definitions/backend";

export function createHeaders(token?: string | undefined) {
  let headers = {};
  if (token) {
    headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  } else
    headers = {
      "Content-Type": "application/json",
    };
  return headers;
}

export function isAdmin(role: Role | undefined) {
  return (
    role?.name.toLowerCase() === "admin" ||
    role?.name.toLowerCase() === "schooladmin"
  );
}
