import axios from "axios";
import { API_URL } from "../config";

export async function getEnabledProviders() {
  const result = await axios.get<string[]>(
    `${API_URL}/api/auth/enabled-providers`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (result.status !== 200) {
    throw new Error(result.statusText);
  }

  return result.data ?? [];
}
