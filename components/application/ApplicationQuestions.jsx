import { submitAnswers } from "lib/answers";
import { useState } from "react";
import { toast } from "react-toastify";
import QuestionItem from "./QuestionItem";

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

  function groupByQuestionType(answers) {
    return answers.reduce((prev, curr) => {
      const key =
        curr.attributes.question.data.attributes.type?.data?.attributes?.name ??
        "";
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
          questions.sort(
            (q1, q2) =>
              q1.attributes.question.data.attributes.order -
              q2.attributes.question.data.attributes.order
          ),
        ])
        .map(([type, questions]) => (
          <div key={type}>
            <h3 className="title">{type}</h3>
            <h6 className="subtitle is-6">
              {questions[0].attributes.question.data.attributes.type?.data
                ?.attributes.description ?? ""}
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
