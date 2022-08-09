export default function QuestionItem({ answer, disabled = false, onAnswered }) {
  const question = answer.attributes.question?.data?.attributes;

  return (
    <div className="field">
      <label htmlFor={answer.id} className="label">
        {question.question} {question.required ? "*" : ""}
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
              Yes
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
              No
            </label>
          </>
        )}
      </div>
    </div>
  );
}
