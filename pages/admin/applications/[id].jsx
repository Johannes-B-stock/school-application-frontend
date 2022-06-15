import DashboardLayout from "@/components/DashboardLayout";
import { parseCookie } from "@/helpers/index";
import {
  faAngleDown,
  faAngleUp,
  faCheck,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getApplicationDetails, updateState } from "lib/application";
import { useState } from "react";
import { toast } from "react-toastify";
import GoogleSpinner from "@/components/GoogleSpinner";
import { getReferenceAnswers } from "lib/references";
import { getUser } from "lib/user";
import Image from "next/image";
import countries from "i18n-iso-countries";
import Link from "next/link";
import { useRouter } from "next/router";
import { addStudentToSchool } from "lib/school";

export default function ApplicationAdminView({ application, token, user }) {
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

  console.log(user);

  const router = useRouter();
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

  const deleteApplication = async (id) => {
    if (
      !confirm(
        "Do you really want to delete this application? There is no going back..."
      )
    )
      return;
    const deleteFetch = await fetch(
      `${API_URL}/api/school-applications/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (deleteFetch.ok) {
      toast.success("Application was successful deleted");
      router.push("admin/dashboard");
    } else {
      const result = await deleteFetch.json();
      toast.error("Error while deleting application: " + result.error.message);
    }
  };

  const revokeApplication = async (application) => {
    if (application.attributes.state === "revoked") {
      return;
    }
    await changeState(application, "revoked");
  };

  const approveApplication = async (application) => {
    try {
      if (application.attributes.state === "approved") {
        return;
      }
      await changeState(application, "approved");
      await addStudentToSchool(application, token);
    } catch (error) {
      toast.error(error.message ?? error);
    }
  };

  async function changeState(application, desiredState) {
    try {
      await updateState(application.id, token, desiredState);
      toast.success(`Application was successful ${desiredState}`);
      router.reload();
    } catch (err) {
      toast.error(
        "Error while changing state of application: " + err?.message ?? err
      );
    }
  }

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
              <p className="card-header-title has-background-danger-light">
                General
              </p>
            </header>
            <div className="card-content">
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">
                  Applied For:
                </div>
                <div className="column">
                  <Link
                    href={`/admin/schools/${application.attributes.school.data.id}`}
                  >
                    {application.attributes.school.data.attributes.name}
                  </Link>
                </div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">Status:</div>
                <div className="column">{application.attributes.state}</div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">
                  Progress:
                </div>
                <div className="column is-7 has-text-weight-bold">
                  <progress
                    className="progress is-primary my-2"
                    value={application.attributes.step}
                    max="3"
                  >
                    {application.attributes.step} / 3
                  </progress>
                </div>
              </div>
              <div className="columns-is-mobile">
                <div className="column">
                  <div
                    className={`button mx-1 is-success`}
                    title="Approve"
                    disabled={application.attributes.state === "approved"}
                    onClick={() => approveApplication(application)}
                  >
                    <span className="icon">
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                  </div>
                  <div
                    className="button mx-1 is-warning"
                    title="Revoke"
                    disabled={application.attributes.state === "revoked"}
                    onClick={() => revokeApplication(application)}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </div>

                  <div
                    className="button mx-1 is-danger"
                    title="Delete"
                    onClick={() => deleteApplication(application.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card my-5">
            <header className="card-header">
              <p className="card-header-title has-background-primary-light">
                User
              </p>
            </header>
            <div className="card-content">
              <div className="columns is-mobile">
                <div className="column is-6 has-text-centered is-centered">
                  <figure className="image is-128x128 is-rounded">
                    <Image
                      className="image is-128x128 is-rounded"
                      alt="Profile"
                      src={
                        user.picture?.formats.small.url ??
                        "/images/defaultAvatar.png"
                      }
                      layout="fill"
                      objectFit="cover"
                    />
                  </figure>
                </div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">
                  User name:
                </div>
                <div className="column">{user.username}</div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">
                  First name:
                </div>
                <div className="column">{user.firstname}</div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">
                  Last name:
                </div>
                <div className="column">{user.lastname}</div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">Gender:</div>
                <div className="column">{user.gender}</div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">
                  Birthday:
                </div>
                <div className="column">
                  {new Date(user.birthday).toLocaleDateString()}
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
            <div className="card-content">
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-semibold">
                  Street:
                </div>
                <div className="column is-5">{user.address?.street}</div>
                <div className="column is-2">{user.address?.number}</div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-semibold">
                  City:
                </div>
                <div className="column">{user.address?.city}</div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-semibold">
                  Postal Code:
                </div>
                <div className="column">{user.address?.postalCode}</div>
              </div>

              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-semibold">
                  Country:
                </div>
                <div className="column">
                  {countries.getName(
                    user.address?.country,
                    router.locale.split("-")[0]
                  )}
                </div>
              </div>
            </div>
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

  const user = await getUser(application.data.attributes.user.data.id, token, [
    "address",
    "picture",
    "emergency_address",
    "schools",
  ]);
  console.log(user);
  return {
    props: {
      application: application.data,
      user: user,
      token,
    },
  };
}
