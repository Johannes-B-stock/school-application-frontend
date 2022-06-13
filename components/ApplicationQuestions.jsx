import { submitAnswers } from "lib/answers";
import { useState } from "react";

export default function ApplicationQuestions({
  answerDetails,
  token,
  disabled = false,
  bindSave,
}) {
  const [answers, setAnswers] = useState(answerDetails);

  const onAnswered = (e) => {
    const updatedAnswer = answers.find(
      (answer) => answer.id.toString() === e.target.name
    );
    const index = answers.indexOf(updatedAnswer);
    updatedAnswer.answer = e.target.value;
    const newAnswers = [...answers];
    newAnswers[index] = updatedAnswer;
    setAnswers(newAnswers);
  };

  const handleSubmitAnswers = async () => {
    await submitAnswers(answers, token);
  };

  bindSave && bindSave(handleSubmitAnswers);

  function groupByQuestionType(answers) {
    return answers.reduce((prev, curr) => {
      const key = curr.question.type.name ?? "";
      if (!prev[key]) {
        prev[key] = [];
      }
      prev[key].push(curr);
      return prev;
    }, {});
  }

  return (
    <form className={`form`}>
      {Object.entries(groupByQuestionType(answers))
        .sort()
        .map(([type, questions]) => [
          type,
          questions.sort((q1, q2) => q1.question.order - q2.question.order),
        ])
        .map(([type, questions]) => (
          <>
            <h3 className="title">{type}</h3>
            <h6 className="subtitle is-6">
              {questions[0].question.type?.description ?? ""}
            </h6>
            {questions.map((answer) => (
              <div key={answer.id} className="field">
                <label htmlFor={answer.id} className="label">
                  {answer.question?.question}{" "}
                  {answer.question.required ? "*" : ""}
                </label>
                <div className="control">
                  {(answer.question.inputType === "text" ||
                    answer.question.inputType == undefined) && (
                    <input
                      type="text"
                      name={answer.id}
                      className={`input ${
                        answer.question.required &&
                        answer.answer == "" &&
                        "is-danger"
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
                        answer.question.required &&
                        answer.answer == "" &&
                        "is-danger"
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
            ))}
            <br />
          </>
        ))}
    </form>
  );
}
