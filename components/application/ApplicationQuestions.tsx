import {
  Answer,
  Question,
  QuestionType,
  SchoolApplication,
  StaffApplication,
} from "api-definitions/backend";
import { useLocale } from "i18n/useLocale";
import { createAnswer, updateAnswers } from "lib/answers";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import QuestionItem from "./QuestionItem";

export default function ApplicationQuestions({
  application,
  questionCollection,
  answerDetails,
  token,
  disabled = false,
  bindSave,
}: {
  application: SchoolApplication | StaffApplication;
  questionCollection: Question[];
  answerDetails: Answer[];
  token: string;
  disabled: boolean;
  bindSave: (func: () => Promise<void>) => void;
}) {
  const [answers, setAnswers] = useState(answerDetails);
  const locale = useLocale();

  const onAnswered = async (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    question: Question,
    answer?: Answer
  ) => {
    try {
      const answerText = e.target.value;
      let updatedAnswer = answers.find((a) => a.id === answer?.id);
      const newAnswers = [...answers];

      if (!updatedAnswer) {
        updatedAnswer = await createAnswer(
          question,
          application,
          answerText,
          token
        );
        newAnswers.push(updatedAnswer);
        return;
      } else {
        updatedAnswer.answer = answerText;
      }
      const index = answers.indexOf(updatedAnswer);
      newAnswers[index] = updatedAnswer;
      setAnswers(newAnswers);
    } catch (error: any) {
      toast.error(error?.message ?? error);
    }
  };

  const handleSubmitAnswers = async () => {
    await updateAnswers(answers, token);
    toast.success("Updated answers successfully");
  };

  bindSave && bindSave(handleSubmitAnswers);

  return (
    <form className={`form`}>
      {Object.entries(groupByQuestionType(questionCollection ?? [], locale))
        .sort()
        .map(([type, questions]) => {
          return {
            type,
            questions: questions.sort((a1, a2) => a1.order - a2.order),
          };
        })
        .map((value) => (
          <div key={value.type}>
            <h3 className="title">{value.type}</h3>
            <h6 className="subtitle is-6">
              {extractLocalizedType(value.questions, locale)?.description}
            </h6>
            {value.questions.map((question) => (
              <QuestionItem
                key={question.id}
                question={question}
                answer={answers.find(
                  (answer) => answer.question.id === question.id
                )}
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
  answers: Question[],
  locale: string
): QuestionType | undefined {
  const type = answers[0]?.type;

  if (!locale || !type || type?.locale === locale) {
    return type;
  }
  const localeType = type.localizations?.find(
    (localized) => localized.locale === locale
  );
  return localeType ?? type;
}

function groupByQuestionType(
  questions: Question[],
  locale: string
): {
  [key: string]: Question[];
} {
  return questions.reduce(
    (prev: { [key: string]: Question[] }, curr: Question) => {
      const questionType = curr.type;
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
    },
    {}
  );
}
