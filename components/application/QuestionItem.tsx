import { general } from "@/i18n";
import { Answer, Data } from "definitions/backend";
import { useRouter } from "next/router";
import { ChangeEventHandler } from "react";

export default function QuestionItem({
  answer,
  disabled = false,
  onAnswered,
}: {
  answer: Data<Answer>;
  disabled: boolean;
  onAnswered: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}) {
  const { locale } = useRouter();
  const question = answer.attributes.question?.data?.attributes;
  let questionText = question.question;
  if (question.locale !== locale && question.localizations) {
    const localeQuestion = question.localizations.data.find(
      (localizedQuestion) => localizedQuestion.attributes.locale === locale
    );
    if (localeQuestion) {
      questionText = localeQuestion.attributes.question;
    }
  }

  return (
    <div className="field">
      <label htmlFor={answer.id} className="label">
        {questionText} {question.required ? "*" : ""}
      </label>
      <div className="control">
        {(question.inputType === "text" || question.inputType == undefined) && (
          <input
            type="text"
            name={answer.id}
            className={`input ${
              question.required && answer.attributes.answer == "" && "is-danger"
            }`}
            value={answer.attributes.answer}
            onChange={onAnswered}
            disabled={disabled}
          />
        )}
        {question.inputType === "longtext" && (
          <textarea
            name={answer.id}
            className={`textarea ${
              question.required && answer.attributes.answer == "" && "is-danger"
            }`}
            value={answer.attributes.answer}
            disabled={disabled}
            onChange={onAnswered}
          />
        )}
        {question.inputType === "bool" && (
          <>
            <label className="radio">
              <input
                type="radio"
                name={answer.id}
                value={"true"}
                onChange={onAnswered}
                checked={answer.attributes.answer === "true"}
                disabled={disabled}
              />
              {general.buttons[locale].yes}
            </label>
            <label className="radio">
              <input
                type="radio"
                name={answer.id}
                value={"false"}
                onChange={onAnswered}
                checked={answer.attributes.answer === "false"}
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
