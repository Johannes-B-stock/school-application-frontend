import { Question } from "api-definitions/backend";
import { ArrayDataResponse } from "api-definitions/strapiBaseTypes";
import axios from "axios";
import { API_URL } from "../config";

export async function getQuestionsFromAPI(token: string, query?: string) {
  const result = await axios.get<ArrayDataResponse<Question>>(
    `${API_URL}/api/questions${query ? "?" + query : ""}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data;
}
