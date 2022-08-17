import QuestionItem from "@/components/application/QuestionItem";
import GoogleSpinner from "@/components/common/GoogleSpinner";
import NotFound from "@/components/common/NotFound";
import { API_URL } from "@/config/index";
import { general, references } from "@/i18n";
import { Data, Reference } from "definitions/backend";
import { GetServerSideProps } from "next";
import qs from "qs";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";

export default function ReferencePage({
  reference,
  errorCode,
  locale,
}: {
  reference: Data<Reference>;
  errorCode: number;
  locale: string;
}) {
  const [answers, setAnswers] = useState(reference?.attributes.answers.data);
  const [isLoading, setIsLoading] = useState(false);

  console.log(reference);

  const onAnswered = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
    if (isLoading) {
      return;
    }
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
    if (isLoading) {
      return;
    }
    try {
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
      );
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
    } catch (err) {
      toast.error(
        "There was an error when trying to submit reference: " + err.message ??
          err
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!reference && errorCode === 404) {
    return <NotFound />;
  }

  return (
    <>
      <div className="title is-4">{references[locale].reference}</div>
      <br />
      <div className="subtitle is-5">
        {references[locale].hello} {reference.attributes.name}
      </div>
      <p>
        {(references[locale].referenceDescription as string)
          .replaceAll("{0}", reference.attributes.relation)
          .replaceAll("{1}", reference.attributes.applicant)}
      </p>
      <br />
      <form className="form">
        {reference.attributes.answers?.data?.map((answer) => (
          <QuestionItem
            key={answer.id}
            answer={answer}
            disabled={reference.attributes.submitted}
            onAnswered={onAnswered}
          />
        ))}
        <br />
        <div className="field is-grouped">
          {isLoading ? (
            <GoogleSpinner />
          ) : (
            <>
              <div className="control">
                <button
                  className="button is-light"
                  onClick={handleSave}
                  disabled={reference.attributes.submitted}
                >
                  {general.buttons[locale].save}
                </button>
              </div>
              <div className="control">
                <button
                  className="button is-primary"
                  onClick={handleSubmit}
                  disabled={reference.attributes.submitted}
                >
                  {general.buttons[locale].submit}
                </button>
              </div>
            </>
          )}
        </div>
      </form>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params: { uid },
  locale,
}) => {
  const query = qs.stringify({
    populate: {
      answers: {
        populate: {
          question: {
            sort: ["order:asc"],
            populate: ["type.localizations", "localizations"],
          },
        },
      },
    },
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
  if (!reference) {
    return {
      props: {
        errorCode: 404,
        locale,
      },
    };
  }
  return {
    props: {
      reference: reference,
      locale,
    },
  };
};
