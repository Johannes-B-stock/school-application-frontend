import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Answer, Reference } from "api-definitions/backend";
import { getReferenceAnswers } from "lib/references";
import { useState } from "react";
import { toast } from "react-toastify";
import GoogleSpinner from "../common/GoogleSpinner";

export default function AdminReference({
  reference,
  token,
}: {
  reference: Reference;
  token: string;
}) {
  const [loadReferenceAnswers, setLoadReferenceAnswers] = useState(false);
  const [answers, setAnswers] = useState<Answer[] | undefined>(undefined);

  const loadAnswers = async (referenceId: number) => {
    if (!token) {
      return;
    }
    try {
      setLoadReferenceAnswers(true);
      const answerDetails = await getReferenceAnswers(referenceId, token);
      setAnswers(answerDetails);
    } catch (error: any) {
      toast.error(error.message ?? error);
    } finally {
      setLoadReferenceAnswers(false);
    }
  };

  return (
    <>
      <div className="columns is-mobile">
        <div className="column is-4 has-text-weight-bold">Name:</div>
        <div className="column">{reference.name}</div>
      </div>
      <div className="columns is-mobile">
        <div className="column is-4 has-text-weight-bold">Relation:</div>
        <div className="column">{reference.relation}</div>
      </div>
      <div className="columns is-mobile">
        <div className="column is-4 has-text-weight-bold">Email:</div>
        <div className="column">{reference.email}</div>
      </div>
      <div className="columns is-mobile">
        <div className="column is-4 has-text-weight-bold">Email send:</div>
        <div className="column">
          {reference.emailSend ? (
            <span className="has-text-success">
              <FontAwesomeIcon icon={faCheck} />
            </span>
          ) : (
            <span className="has-text-danger">
              <FontAwesomeIcon icon={faXmark} />
            </span>
          )}
        </div>
      </div>
      <div className="columns is-mobile">
        <div className="column is-4 has-text-weight-bold">Submitted:</div>
        <div className="column">
          {reference.submitted ? (
            <span className="has-text-success">
              <FontAwesomeIcon icon={faCheck} />
            </span>
          ) : (
            <span className="has-text-danger">
              <FontAwesomeIcon icon={faXmark} />
            </span>
          )}
        </div>
      </div>
      <div className="columns is-mobile">
        <div className="column is-4 has-text-weight-bold">Created:</div>
        <div className="column">
          {new Date(reference.createdAt).toLocaleDateString()}
        </div>
      </div>
      <hr />
      <h3 className="subtitle is-4">Questionary</h3>
      {!answers && (
        <div
          className="button is-primary mb-5"
          onClick={() => loadAnswers(reference.id)}
        >
          Show Questionary
        </div>
      )}
      {loadReferenceAnswers && <GoogleSpinner />}
      {answers &&
        answers.map((answer) => (
          <div key={answer.id}>
            <p className="has-text-weight-bold">{answer.question.question}:</p>
            <p className="column">{answer.answer}</p>
            <br />
          </div>
        ))}
    </>
  );
}
