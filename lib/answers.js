import { API_URL } from "../config";

export async function submitAnswers(answers, token) {
  const requiredNotAnswered = answers.some(
    (answer) => answer.question.required && !answer.answer
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
            answer: answer.answer,
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
