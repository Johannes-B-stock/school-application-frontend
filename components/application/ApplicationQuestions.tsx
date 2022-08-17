import { Answer, Data, QuestionType } from "definitions/backend";
import { submitAnswers } from "lib/answers";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import QuestionItem from "./QuestionItem";

export default function ApplicationQuestions({
  answerDetails,
  token,
  disabled = false,
  bindSave,
}: {
  answerDetails: Data<Answer>[];
  token: string;
  disabled: boolean;
  bindSave: (func: () => Promise<void>) => void;
}) {
  const [answers, setAnswers] = useState(answerDetails);
  const { locale } = useRouter();
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

  const handleSubmitAnswers = async () => {
    await submitAnswers(answers, token);
    toast.success("Updated answers successfully");
  };

  bindSave && bindSave(handleSubmitAnswers);

  return (
    <form className={`form`}>
      {Object.entries(groupByQuestionType(answers, locale))
        .sort()
        .map(([type, questions]) => {
          return [
            type,
            questions.sort(
              (q1, q2) =>
                q1.attributes.question.data.attributes.order -
                q2.attributes.question.data.attributes.order
            ),
          ];
        })
        .map(([type, questions]: [type: string, questions: Data<Answer>[]]) => (
          <div key={type}>
            <h3 className="title">{type}</h3>
            <h6 className="subtitle is-6">
              {extractLocalizedType(questions, locale)?.description}
            </h6>
            {questions.map((answer) => (
              <QuestionItem
                key={answer.id}
                answer={answer}
                disabled={disabled}
                onAnswered={onAnswered}
              />
            ))}
            <br />
          </div>
        ))}
    </form>
  );
}

function extractLocalizedType(
  questions: Data<Answer>[],
  locale: string
): QuestionType | undefined {
  const type =
    questions[0].attributes.question.data.attributes.type?.data?.attributes;

  if (!locale || !type || type?.locale === locale) {
    return type;
  }
  const localeType = type.localizations?.data.find(
    (localized) => localized.attributes.locale === locale
  );
  return localeType?.attributes ?? type;
}

function groupByQuestionType(
  answers: Data<Answer>[],
  locale: string
): {
  [key: string]: Data<Answer>[];
} {
  return answers.reduce(
    (prev: { [key: string]: Data<Answer>[] }, curr: Data<Answer>) => {
      const questionType =
        curr.attributes.question.data.attributes.type.data?.attributes;
      const key =
        (questionType?.locale !== locale
          ? questionType?.localizations?.data.find(
              (localized) => localized.attributes.locale === locale
            )?.attributes.name ?? questionType?.name
          : questionType?.name) ?? "";
      if (!prev[key]) {
        prev[key] = [];
      }
      prev[key].push(curr);
      return prev;
    },
    {}
  );
}
