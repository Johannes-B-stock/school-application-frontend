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
