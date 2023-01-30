import { API_URL } from "../config";
import {
  Answer,
  Question,
  Reference,
  SchoolApplication,
  StaffApplication,
} from "api-definitions/backend";
import axios from "axios";
import { SingleDataResponse } from "api-definitions/strapiBaseTypes";
import { createHeaders } from "./common";

export async function createAnswer(
  question: Question,
  application: SchoolApplication | StaffApplication,
  answer: string,
  token: string,
  applicationType?: "school" | "staff"
): Promise<Answer> {
  const field = applicationType
    ? applicationType
    : "school" in application
    ? "school"
    : "staff";
  const data: any = {
    question: question.id,
    answer: answer,
  };
  data[`${field}_application`] = application.id;

  const answerRes = await axios.post<SingleDataResponse<Answer>>(
    `${API_URL}/api/answers`,
    {
      data,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (answerRes.status !== 200 || !answerRes.data.data) {
    throw new Error(answerRes.data?.error?.message ?? answerRes.statusText);
  }

  return answerRes.data.data;
}

export async function updateAnswers(
  answers: Answer[],
  token?: string,
  reference?: Reference
) {
  const requiredNotAnswered = answers.some(
    (answer) => answer.question.required && !answer.answer
  );

  if (requiredNotAnswered) {
    throw new Error("Please answer all required questions before continuing");
  }

  await Promise.all(
    answers.map(async (answer) => {
      await updateAnswer(
        { answer: answer.answer, id: answer.id },
        token,
        reference
      );
    })
  );
}

/**
 *
 * @param answer
 * @param token
 * @param reference is needed in case a reference needs to be updated
 */
export async function updateAnswer(
  answer: Partial<Answer>,
  token?: string,
  reference?: Reference
) {
  const headers = createHeaders(token);

  const answerRes = await fetch(
    `${API_URL}/api/answers/${answer.id}${
      reference ? `?uid=${reference.uid}` : ""
    }`,
    {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        data: answer,
      }),
    }
  );
  const answerResult = (await answerRes.json()) as SingleDataResponse<Answer>;

  if (!answerRes.ok) {
    const error = answerResult.error?.message ?? answerRes.statusText;
    throw new Error(error);
  }
}
