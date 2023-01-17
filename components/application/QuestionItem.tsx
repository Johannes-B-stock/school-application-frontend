import { general } from "@/i18n";
import { Answer } from "api-definitions/backend";
import { useLocale } from "i18n/useLocale";
import { ChangeEventHandler } from "react";

export default function QuestionItem({
  answer,
  disabled = false,
  onAnswered,
}: {
  answer: Answer;
  disabled: boolean;
  onAnswered: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}) {
  const locale = useLocale();
  const question = answer.question;
  let questionText = question.question;
  if (question.locale !== locale && question.localizations) {
    const localeQuestion = question.localizations.find(
      (localizedQuestion) => localizedQuestion.locale === locale
    );
    if (localeQuestion) {
      questionText = localeQuestion.question;
    }
  }

  return (
    <div className="field">
      <label htmlFor={answer.id.toString()} className="label">
        {questionText} {question.required ? "*" : ""}
      </label>
      <div className="control">
        {(question.inputType === "text" || question.inputType == undefined) && (
          <input
            type="text"
            name={answer.id.toString()}
            className={`input ${
              question.required && answer.answer == "" && "is-danger"
            }`}
            value={answer.answer}
            onChange={onAnswered}
            disabled={disabled}
          />
        )}
        {question.inputType === "longtext" && (
          <textarea
            name={answer.id.toString()}
            className={`textarea ${
              question.required && answer.answer == "" && "is-danger"
            }`}
            value={answer.answer}
            disabled={disabled}
            onChange={onAnswered}
          />
        )}
        {question.inputType === "bool" && (
          <>
            <label className="radio">
              <input
                type="radio"
                name={answer.id.toString()}
                value={"true"}
                onChange={onAnswered}
                checked={answer.answer === "true"}
                disabled={disabled}
              />
              {general.buttons[locale].yes}
            </label>
            <label className="radio">
              <input
                type="radio"
                name={answer.id.toString()}
                value={"false"}
                onChange={onAnswered}
                checked={answer.answer === "false"}
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
