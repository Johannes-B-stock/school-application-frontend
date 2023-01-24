import { general } from "@/i18n";
import { Answer, Question } from "api-definitions/backend";
import { useLocale } from "i18n/useLocale";
import { ChangeEvent, useState } from "react";

export default function QuestionItem({
  question,
  answer,
  disabled = false,
  onAnswered,
}: {
  question: Question;
  answer?: Answer;
  disabled: boolean;
  onAnswered: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    question: Question,
    answer?: Answer
  ) => any;
}) {
  const [answerEdit, setAnswerEdit] = useState(answer?.answer);
  const locale = useLocale();
  let questionText = question.question;
  if (question.locale !== locale && question.localizations) {
    const localeQuestion = question.localizations.find(
      (localizedQuestion) => localizedQuestion.locale === locale
    );
    if (localeQuestion) {
      questionText = localeQuestion.question;
    }
  }

  const handleAnswered = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAnswerEdit(e.target.value);
    onAnswered(e, question, answer);
  };

  return (
    <div className="field">
      <label htmlFor={answer?.id.toString()} className="label">
        {questionText} {question.required ? "*" : ""}
      </label>
      <div className="control">
        {(question.inputType === "text" || question.inputType == undefined) && (
          <input
            type="text"
            name={answer?.id.toString()}
            className={`input ${
              question.required && answerEdit == "" && "is-danger"
            }`}
            value={answerEdit}
            onChange={handleAnswered}
            disabled={disabled}
          />
        )}
        {question.inputType === "longtext" && (
          <textarea
            name={answer?.id.toString()}
            className={`textarea ${
              question.required && answerEdit == "" && "is-danger"
            }`}
            value={answerEdit}
            disabled={disabled}
            onChange={handleAnswered}
          />
        )}
        {question.inputType === "bool" && (
          <>
            <label className="radio">
              <input
                type="radio"
                name={answer?.id.toString()}
                value={"true"}
                onChange={handleAnswered}
                checked={answerEdit === "true"}
                disabled={disabled}
              />
              {general.buttons[locale].yes}
            </label>
            <label className="radio">
              <input
                type="radio"
                name={answer?.id.toString()}
                value={"false"}
                onChange={handleAnswered}
                checked={answerEdit === "false"}
                disabled={disabled}
              />
              {general.buttons[locale].no}
            </label>
          </>
        )}
      </div>
    </div>
  );
}
