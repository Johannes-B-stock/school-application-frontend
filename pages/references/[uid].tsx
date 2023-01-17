import QuestionItem from "@/components/application/QuestionItem";
import GoogleSpinner from "@/components/common/GoogleSpinner";
import NotFound from "@/components/common/NotFound";
import { API_URL } from "@/config/index";
import { general, references } from "@/i18n";
import { Answer, Reference } from "api-definitions/backend";
import { ArrayDataResponse } from "api-definitions/strapiBaseTypes";
import { useLocale } from "i18n/useLocale";
import { GetServerSideProps } from "next";
import qs from "qs";
import { ChangeEvent, MouseEvent, useState } from "react";
import { toast } from "react-toastify";

export default function ReferencePage({
  reference,
  errorCode,
}: {
  reference: Reference;
  errorCode: number;
}) {
  const [answers, setAnswers] = useState(reference.answers);
  const [referenceEdit, setReferenceEdit] = useState(reference);
  const [isLoading, setIsLoading] = useState(false);
  const locale = useLocale();

  const onAnswered = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!answers) {
      throw new Error("No Answers given");
    }
    const updatedAnswer = answers.find(
      (answer) => answer.id.toString() === e.target.name
    );
    if (!updatedAnswer) {
      throw new Error("Could not find Answer to update");
    }
    const index = answers.indexOf(updatedAnswer);
    updatedAnswer.answer = e.target.value;

    const newAnswers = [...answers];
    newAnswers[index] = updatedAnswer;
    setAnswers(newAnswers);
  };

  const handleSave = async (e: MouseEvent) => {
    e.preventDefault();
    if (isLoading || !answers) {
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
                answer: answer.answer,
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

  const handleSubmit = async (e: MouseEvent) => {
    e.preventDefault();
    if (isLoading || !answers) {
      return;
    }

    try {
      setIsLoading(true);

      if (notAllRequiredQuestionsHaveBeenAnswered(answers)) {
        toast.error(references[locale].answerRequired);
        return;
      }
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
                  answer: answer.answer,
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
        setReferenceEdit({ ...referenceEdit, submitted: true });
        toast.success("Reference sucessfully submitted");
      } else {
        toast.error(
          "There was an error when trying to submit reference: " +
            updateAnswerFetch.statusText
        );
      }
    } catch (err: any) {
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
        {references[locale].hello} {reference.name}
      </div>
      <p>
        {(references[locale].referenceDescription as string)
          .replaceAll("{0}", reference.relation)
          .replaceAll("{1}", reference.applicant)}
      </p>
      <br />
      <form className="form">
        {answers?.map((answer) => (
          <QuestionItem
            key={answer.id}
            answer={answer}
            disabled={referenceEdit.submitted}
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
                  disabled={referenceEdit.submitted}
                >
                  {general.buttons[locale].save}
                </button>
              </div>
              <div className="control">
                <button
                  className="button is-primary"
                  onClick={handleSubmit}
                  disabled={referenceEdit.submitted}
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const uid = params?.uid;
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
  const referenceJson =
    (await referenceFetch.json()) as ArrayDataResponse<Reference>;
  const reference = referenceJson.data?.[0];
  if (!reference) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      reference: reference,
    },
  };
};
function notAllRequiredQuestionsHaveBeenAnswered(answers: Answer[]) {
  return answers.some(
    (answer) =>
      answer.question.required &&
      (answer.answer == undefined || answer.answer?.trim() === "")
  );
}
