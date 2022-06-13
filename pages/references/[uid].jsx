import GoogleSpinner from "@/components/GoogleSpinner";
import { API_URL } from "@/config/index";
import * as qs from "qs";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ReferencePage({ reference }) {
  const [answers, setAnswers] = useState(reference.attributes.answers);
  const [isLoading, setIsLoading] = useState(false);

  const onAnswered = (e) => {
    const updatedAnswer = answers.find(
      (answer) => answer.id.toString() === e.target.name
    );
    const index = answers.indexOf(updatedAnswer);
    updatedAnswer.attributes.answer = e.target.value;
    const newAnswers = [...answers];
    newAnswers[index] = updatedAnswer;
    setAnswers(newAnswers);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await Promise.all(
      answers.map(async (answer) => {
        const updateAnswerFetch = await fetch(
          `${API_URL}/api/answers/${answer.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: {
                answer: answer.attributes.answer,
              },
            }),
          }
        );

        const updateResult = await updateAnswerFetch.json();

        if (!updateAnswerFetch.ok) {
          throw new Error(
            updateResult.error?.message ?? updateAnswerFetch.statusText
          );
        }
      })
    )
      .then(() => toast.success("All questions successfully saved!"))
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const updateAnswerFetch = await fetch(
        `${API_URL}/api/references/${reference.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              submitted: true,
            },
          }),
        }
      );
      if (updateAnswerFetch.ok) {
        toast.success("Reference sucessfully submitted");
      } else {
        toast.error(
          "There was an error when trying to submit reference: " +
            updateAnswerFetch.statusText
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="title is-4">Reference</div>
      <br />
      <div className="subtitle is-5">Hello {reference.attributes.name}</div>
      <p>
        You have been selected to be a reference. Please answer all questions
        honestly.
      </p>
      <br />
      <form className="form">
        {reference.attributes.answers.map((answer) => (
          <div key={answer.id} className="field">
            <label htmlFor={answer.id} className="label">
              {answer.attributes.question?.data.attributes.question}{" "}
              {answer.attributes.question?.data.attributes.required ? "*" : ""}
            </label>
            <div className="control">
              <input
                type="text"
                name={answer.id}
                className="input"
                value={answer.attributes.answer}
                onChange={onAnswered}
                disabled={reference.attributes.submitted}
              />
            </div>
          </div>
        ))}
        <br />
        <div className="field is-grouped">
          {isLoading ? (
            <GoogleSpinner />
          ) : (
            <>
              <div className="control">
                <div
                  className="button is-light"
                  onClick={handleSave}
                  disabled={reference.attributes.submitted}
                >
                  Save
                </div>
              </div>
              <div className="control">
                <div
                  className="button is-primary"
                  onClick={handleSubmit}
                  disabled={reference.attributes.submitted}
                >
                  Submit
                </div>
              </div>
            </>
          )}
        </div>
      </form>
    </>
  );
}

export async function getServerSideProps({ params: { uid }, req }) {
  const query = qs.stringify({
    populate: ["answers"],
    filters: {
      uid: {
        $eq: uid,
      },
    },
  });
  const referenceFetch = await fetch(`${API_URL}/api/references?${query}`, {
    method: "GET",
  });

  const referenceJson = await referenceFetch.json();

  const reference = referenceJson.data?.[0] ?? null;

  const answers = [];

  await Promise.all(
    reference.attributes.answers.data.map(async (answer) => {
      const answerQuery = qs.stringify({
        populate: ["question"],
      });
      const answerFetch = await fetch(
        `${API_URL}/api/answers/${answer.id}?${answerQuery}`
      );
      const answerRes = await answerFetch.json();
      answers.push(answerRes.data);
    })
  );

  reference.attributes.answers = answers;

  return {
    props: {
      reference: reference,
    },
  };
}
