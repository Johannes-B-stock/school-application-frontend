export default function QuestionItem({ answer, disabled = false, onAnswered }) {
  return (
    <div className="field">
      <label htmlFor={answer.id} className="label">
        {answer.question?.question} {answer.question.required ? "*" : ""}
      </label>
      <div className="control">
        {(answer.question.inputType === "text" ||
          answer.question.inputType == undefined) && (
          <input
            type="text"
            name={answer.id}
            className={`input ${
              answer.question.required && answer.answer == "" && "is-danger"
            }`}
            value={answer.answer}
            onChange={onAnswered}
            disabled={disabled}
          />
        )}
        {answer.question.inputType === "longtext" && (
          <textarea
            type="text"
            name={answer.id}
            className={`textarea ${
              answer.question.required && answer.answer == "" && "is-danger"
            }`}
            value={answer.answer}
            disabled={disabled}
            onChange={onAnswered}
          />
        )}
        {answer.question.inputType === "bool" && (
          <>
            <label className="radio">
              <input
                type="radio"
                name={answer.id}
                value={true}
                onChange={onAnswered}
                checked={answer.answer === "true"}
                disabled={disabled}
              />
              Yes
            </label>
            <label className="radio">
              <input
                type="radio"
                name={answer.id}
                value={false}
                onChange={onAnswered}
                checked={answer.answer === "false"}
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
