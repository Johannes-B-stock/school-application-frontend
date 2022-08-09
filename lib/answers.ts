import { API_URL } from "../config";
import axios from "axios";
import qs from "qs";
import { Answer } from "definitions/backend";

export async function submitAnswers(answers: Answer[], token: string) {
  const requiredNotAnswered = answers.some(
    (answer) =>
      answer.attributes.question.data.attributes.required &&
      !answer.attributes.answer
  );

  if (requiredNotAnswered) {
    throw new Error("Please answer all required questions before continuing");
  }

  return Promise.all(
    answers.map(async (answer) => {
      const answerRes = await fetch(`${API_URL}/api/answers/${answer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            answer: answer.attributes.answer,
          },
        }),
      });
      const answerResult = await answerRes.json();

      if (!answerRes.ok) {
        const error = answerResult.error?.message ?? answerRes.statusText;
        throw new Error(error);
      }
    })
  );
}

export async function getSchoolApplicationAnswerDetails(
  answers: Answer[],
  token: string
) {
  const query = qs.stringify({
    populate: ["question"],
  });

  if (!answers) {
    throw new Error("Answers not defined!");
  }

  const questions = await Promise.all(
    answers.map(async (answer) => {
      const answerDetails = await axios.get(
        `${API_URL}/api/answers/${answer.id}?${query}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return answerDetails.data;
    })
  );
  return questions;
}
