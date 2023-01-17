import { Answer, QuestionType } from "api-definitions/backend";
import { useLocale } from "i18n/useLocale";
import { submitAnswers } from "lib/answers";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import QuestionItem from "./QuestionItem";

export default function ApplicationQuestions({
  answerDetails,
  token,
  disabled = false,
  bindSave,
}: {
  answerDetails: Answer[];
  token: string;
  disabled: boolean;
  bindSave: (func: () => Promise<void>) => void;
}) {
  const [answers, setAnswers] = useState(answerDetails);
  const locale = useLocale();

  const onAnswered = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updatedAnswer = answers.find(
      (answer) => answer.id.toString() === e.target.name
    );
    if (!updatedAnswer) {
      return;
    }
    const index = answers.indexOf(updatedAnswer);
    updatedAnswer.answer = e.target.value;
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
        .map(([type, answers]) => {
          return {
            type,
            answers: answers.sort(
              (a1, a2) => a1.question.order - a2.question.order
            ),
          };
        })
        .map((value) => (
          <div key={value.type}>
            <h3 className="title">{value.type}</h3>
            <h6 className="subtitle is-6">
              {extractLocalizedType(value.answers, locale)?.description}
            </h6>
            {value.answers.map((answer) => (
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
  answers: Answer[],
  locale: string
): QuestionType | undefined {
  const type = answers[0].question.type;

  if (!locale || !type || type?.locale === locale) {
    return type;
  }
  const localeType = type.localizations?.find(
    (localized) => localized.locale === locale
  );
  return localeType ?? type;
}

function groupByQuestionType(
  answers: Answer[],
  locale: string
): {
  [key: string]: Answer[];
} {
  return answers.reduce((prev: { [key: string]: Answer[] }, curr: Answer) => {
    const questionType = curr.question.type;
    const key =
      (questionType?.locale !== locale
        ? questionType?.localizations?.find(
            (localized) => localized.locale === locale
          )?.name ?? questionType?.name
        : questionType?.name) ?? "";
    if (!prev[key]) {
      prev[key] = [];
    }
    prev[key].push(curr);
    return prev;
  }, {});
}
