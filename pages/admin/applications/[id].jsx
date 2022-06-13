import DashboardLayout from "@/components/DashboardLayout";
import { parseCookie } from "@/helpers/index";
import {
  faAngleDown,
  faAngleUp,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getApplicationDetails } from "lib/application";
import { useState } from "react";
import { toast } from "react-toastify";
import GoogleSpinner from "@/components/GoogleSpinner";
import { getReferenceAnswers } from "lib/references";

export default function ApplicationAdminView({ application, token }) {
  const [showReference1, setShowReference1] = useState(false);
  const [showReference2, setShowReference2] = useState(false);
  const [loadReference1Answers, setLoadReference1Answers] = useState(false);
  const [loadReference2Answers, setLoadReference2Answers] = useState(false);
  const [answers1, setAnswers1] = useState(null);
  const [answers2, setAnswers2] = useState(null);

  const toggleShowReference1 = () => {
    setShowReference1(!showReference1);
  };

  const toggleShowReference2 = () => {
    setShowReference2(!showReference2);
  };

  const reference1 = application.attributes.reference1.data;
  const reference2 = application.attributes.reference2.data;

  const loadAnswers = async (referenceId, token) => {
    try {
      referenceId === reference1.id && setLoadReference1Answers(true);
      referenceId === reference2.id && setLoadReference2Answers(true);
      const answerDetails = await getReferenceAnswers(referenceId, token);
      referenceId === reference1.id && setAnswers1(answerDetails);
      referenceId === reference2.id && setAnswers2(answerDetails);
    } catch (error) {
      toast.error(error.message ?? error);
    } finally {
      referenceId === reference1.id && setLoadReference1Answers(false);
      referenceId === reference2.id && setLoadReference2Answers(false);
    }
  };

  return (
    <section className="section has-background-light">
      <h3 className="title is-3">
        Application for School{" "}
        {application.attributes.school.data.attributes.name}
      </h3>
      <div className="columns">
        <div className="column is-7">
          <div className="card my-5">
            <header className="card-header">
              <p className="card-header-title has-background-primary-light">
                User
              </p>
            </header>
            <div className="card-content">
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">
                  User name:
                </div>
                <div className="column">
                  {application.attributes.user.data.attributes.username}
                </div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">
                  First name:
                </div>
                <div className="column">
                  {application.attributes.user.data.attributes.firstname}
                </div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">
                  Last name:
                </div>
                <div className="column">
                  {application.attributes.user.data.attributes.lastname}
                </div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">Gender:</div>
                <div className="column">
                  {application.attributes.user.data.attributes.gender}
                </div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">
                  Birthday:
                </div>
                <div className="column">
                  {new Date(
                    application.attributes.user.data.attributes.birthday
                  ).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <div className="card my-5">
            <header className="card-header">
              <p className="card-header-title has-background-primary-light">
                Address
              </p>
            </header>
            <div className="card-content"></div>
          </div>
        </div>
        <div className="column">
          <div className="card my-5">
            <header className="card-header has-background-info-light">
              <p className="card-header-title">Reference 1</p>
              <button
                className="card-header-icon"
                aria-label="more options"
                onClick={toggleShowReference1}
              >
                <span className="icon">
                  {showReference1 ? (
                    <FontAwesomeIcon icon={faAngleUp} />
                  ) : (
                    <FontAwesomeIcon icon={faAngleDown} />
                  )}
                </span>
              </button>
            </header>
            <div
              className={`card-content is-collapsible ${
                showReference1 ? "" : "is-collapsed"
              }`}
              aria-expanded={showReference1 ? "true" : "false"}
            >
              {reference1 === null ? (
                <p>Reference has not been created yet</p>
              ) : (
                <>
                  <div className="columns is-mobile">
                    <div className="column is-4 has-text-weight-bold">
                      Name:
                    </div>
                    <div className="column">{reference1.attributes.name}</div>
                  </div>
                  <div className="columns is-mobile">
                    <div className="column is-4 has-text-weight-bold">
                      Relation:
                    </div>
                    <div className="column">
                      {reference1.attributes.relation}
                    </div>
                  </div>
                  <div className="columns is-mobile">
                    <div className="column is-4 has-text-weight-bold">
                      Email:
                    </div>
                    <div className="column">{reference1.attributes.email}</div>
                  </div>
                  <div className="columns is-mobile">
                    <div className="column is-4 has-text-weight-bold">
                      Email send:
                    </div>
                    <div className="column">
                      {reference1.attributes.emailSend ? (
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
                    <div className="column is-4 has-text-weight-bold">
                      Submitted:
                    </div>
                    <div className="column">
                      {reference1.attributes.submitted ? (
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
                    <div className="column is-4 has-text-weight-bold">
                      Created:
                    </div>
                    <div className="column">
                      {new Date(
                        reference1.attributes.createdAt
                      ).toLocaleDateString()}
                    </div>
                  </div>
                  <hr />
                  <h3 className="subtitle is-4">Questionary</h3>

                  {!answers1 && (
                    <div
                      className="button is-primary mb-5"
                      onClick={() => loadAnswers(reference1.id, token)}
                    >
                      Load questions and answers
                    </div>
                  )}
                  {loadReference1Answers && <GoogleSpinner />}
                  {answers1 &&
                    answers1.map((answer) => (
                      <>
                        {" "}
                        <p className="has-text-weight-bold">
                          {
                            answer.data.attributes.question.data.attributes
                              .question
                          }
                          :
                        </p>
                        <p className="column">
                          {answer.data.attributes.answer}
                        </p>
                        <br />
                      </>
                    ))}
                </>
              )}
            </div>
          </div>
          <div className="card my-5">
            <header
              className="card-header has-background-info-light"
              onClick={toggleShowReference2}
            >
              <p className="card-header-title">Reference 2</p>
              <button
                className="card-header-icon"
                aria-label="more options"
                onClick={toggleShowReference2}
              >
                <span className="icon">
                  {showReference2 ? (
                    <FontAwesomeIcon icon={faAngleUp} />
                  ) : (
                    <FontAwesomeIcon icon={faAngleDown} />
                  )}
                </span>
              </button>
            </header>
            <div
              className={`card-content is-collapsible ${
                showReference2 ? "" : "is-collapsed"
              }`}
              aria-expanded={showReference2 ? "true" : "false"}
            >
              {reference2 === null ? (
                <p>Reference has not been created yet</p>
              ) : (
                <>
                  <div className="columns is-mobile">
                    <div className="column is-4 has-text-weight-bold">
                      Name:
                    </div>
                    <div className="column">{reference2.attributes.name}</div>
                  </div>
                  <div className="columns is-mobile">
                    <div className="column is-4 has-text-weight-bold">
                      Relation:
                    </div>
                    <div className="column">
                      {reference2.attributes.relation}
                    </div>
                  </div>
                  <div className="columns is-mobile">
                    <div className="column is-4 has-text-weight-bold">
                      Email:
                    </div>
                    <div className="column">{reference2.attributes.email}</div>
                  </div>
                  <div className="columns is-mobile">
                    <div className="column is-4 has-text-weight-bold">
                      Email send:
                    </div>
                    <div className="column">
                      {reference2.attributes.emailSend ? (
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
                    <div className="column is-4 has-text-weight-bold">
                      Submitted:
                    </div>
                    <div className="column">
                      {reference2.attributes.submitted ? (
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
                    <div className="column is-4 has-text-weight-bold">
                      Created:
                    </div>
                    <div className="column">
                      {new Date(
                        reference2.attributes.createdAt
                      ).toLocaleDateString()}
                    </div>
                  </div>
                  <hr />
                  <h3 className="subtitle is-4">Questionary</h3>
                  {!answers2 && (
                    <div
                      className="button is-primary mb-5"
                      onClick={() => loadAnswers(reference2.id, token)}
                    >
                      Load questions and answers
                    </div>
                  )}
                  {loadReference2Answers && <GoogleSpinner />}
                  {answers2 &&
                    answers2.map((answer) => (
                      <>
                        <p className="has-text-weight-bold">
                          {
                            answer.data.attributes.question.data.attributes
                              .question
                          }
                          :
                        </p>
                        <p className="column">
                          {answer.data.attributes.answer}
                        </p>
                        <br />
                      </>
                    ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

ApplicationAdminView.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export async function getServerSideProps({ req, params: { id } }) {
  const { token } = parseCookie(req);
  const application = await getApplicationDetails(id, token, [
    "answers",
    "school",
    "reference1",
    "reference2",
    "user",
  ]);

  return {
    props: {
      application: application.data,
      token,
    },
  };
}
