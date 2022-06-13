import Link from "next/link";
import { useRouter } from "next/router";
import qs from "qs";
import { API_URL } from "@/config/index";
import { useState, useEffect, useContext, useRef } from "react";
import styles from "@/styles/Application.module.css";
import { parseCookie } from "@/helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { faAddressCard } from "@fortawesome/free-regular-svg-icons";
import {
  faCheck,
  faMailBulk,
  faQuestion,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import GoogleSpinner from "@/components/GoogleSpinner";
import AddressEdit from "@/components/AddressEdit";
import AuthContext from "@/context/AuthContext";
import NotAuthorized from "@/components/NotAuthorized";
import { sendReference } from "lib/references";
import { submitApplication, updateState, updateStep } from "lib/application";
import { updateMe } from "lib/user";
import ApplicationQuestions from "@/components/ApplicationQuestions";

export default function ApplicationPage({
  application,
  answerDetails,
  error,
  token,
  address,
}) {
  const router = useRouter();
  useEffect(() => {
    if (error) {
      toast.error(`${error.status} - ${error.message}`);
    }
  }, [router, error]);
  const { user } = useContext(AuthContext);
  const [applicationEdit, setApplicationEdit] = useState(application);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [isLoadingBack, setIsLoadingBack] = useState(false);
  const [userEdit, setUserEdit] = useState(user);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [reference1, setReference1] = useState(
    application?.reference1?.data
      ? {
          id: application?.reference1?.data.id,
          ...application?.reference1?.data.attributes,
        }
      : {}
  );
  const [reference2, setReference2] = useState(
    application?.reference2?.data
      ? {
          id: application?.reference2?.data.id,
          ...application?.reference2?.data.attributes,
        }
      : {}
  );

  if (!application) {
    router.push("/404");
    return;
  }
  console.log(application);
  console.log(user);
  if (application.user.data.id !== user?.id) {
    return <NotAuthorized />;
  }

  let addressSaveFunction = undefined;

  function bindAddressSave(saveFunction) {
    addressSaveFunction = saveFunction;
  }
  let questionSaveFunction = undefined;
  function bindQuestionSave(saveFunction) {
    questionSaveFunction = saveFunction;
  }
  const onReference1ValueChanged = (e) => {
    const { name, value } = e.target;
    setReference1({ ...reference1, [name]: value });
  };

  const onReference2ValueChanged = (e) => {
    const { name, value } = e.target;
    setReference2({ ...reference2, [name]: value });
  };

  const goBack = async () => {
    if (applicationEdit.step === 0 || isLoadingBack || isLoadingNext) {
      return;
    }
    setIsLoadingBack(true);
    const nextStep = applicationEdit.step - 1;
    await handleStepUpdate(nextStep);
    setIsLoadingBack(false);
  };

  const goNext = async () => {
    if (applicationEdit.step >= 3 || isLoadingBack || isLoadingNext) {
      return;
    }

    try {
      setIsLoadingNext(true);
      if (applicationEdit.step === application.step) {
        if (applicationEdit.step === 0) {
          await saveUserEdit();
          if (!addressSaveFunction) {
            throw new Error("can not save address!");
          }
          await addressSaveFunction();
        }
        if (applicationEdit.step === 1) {
          if (!questionSaveFunction) {
            throw new Error("can not save questions!");
          }
          await questionSaveFunction();
        }
        if (applicationEdit.step === 2) {
          if (!reference1.emailSend || !reference2.emailSend) {
            throw new Error(
              "You have to send out both reference emails before continuing!"
            );
          }
        }
      }
      const nextStep = applicationEdit.step + 1;
      await handleStepUpdate(nextStep);
      if (nextStep > application.step) {
        application.step = nextStep;
      }
    } catch (error) {
      toast.error(error.message ?? error);
    } finally {
      setIsLoadingNext(false);
    }
  };

  async function handleStepUpdate(nextStep) {
    if (nextStep > applicationEdit.step) {
      const updateStepResult = await updateStep(
        application.id,
        nextStep,
        token
      );
      if (updateStepResult.ok) {
        setApplicationEdit({
          ...applicationEdit,
          step: nextStep,
        });
      } else {
        toast.error(updateStepResult);
      }
    } else {
      setApplicationEdit({
        ...applicationEdit,
        step: nextStep,
      });
    }
  }

  const sendReference1 = async () => {
    const allInfoSet =
      reference1.email && reference1.relation && reference1.name;

    if (!allInfoSet) {
      toast.error("Please fill in all fields for reference 1.");
      return;
    }

    try {
      await sendReference("reference1", application, reference1, user, token);
      setReference1({ ...reference1, emailSend: true });
      toast.success("email send successfully");
    } catch (error) {
      toast.error(`Failed to send reference because ${error.message}`);
    }
  };

  const sendReference2 = async () => {
    const allInfoSet =
      reference2.email && reference2.relation && reference2.name;

    if (!allInfoSet) {
      toast.error("Please fill in all fields for reference 2.");
      return;
    }

    try {
      await sendReference("reference2", application, reference2, user, token);
      setReference2({ ...reference2, emailSend: true });
      toast.success("email send successfully");
    } catch (error) {
      toast.error(`Failed to send reference because ${error.message}`);
    }
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserEdit({ ...userEdit, [name]: value });
  };

  async function saveUserEdit() {
    if (!userEdit.firstname) {
      throw new Error("Please fill in your first name");
    }
    if (!userEdit.lastname) {
      throw new Error("Please fill in your last name");
    }
    if (!userEdit.gender) {
      throw new Error("Please fill in your gender");
    }
    if (!userEdit.birthday) {
      throw new Error("Please fill in your birthday");
    }
    await updateMe(userEdit, token);
  }

  const handleSubmitApplication = async () => {
    if (submitLoading) {
      return;
    }
    try {
      setSubmitLoading(true);
      await updateState(application.id, token, "submitted");
      setApplicationEdit({ ...applicationEdit, state: "submitted" });

      toast.success("Successfully submitted!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="content has-text-centered">
      <h1>Application for School {application?.school.data.attributes.name}</h1>
      <p>
        This is your application for the school{" "}
        {application?.school.data.attributes.name}
      </p>
      <p>
        You have to pay an application fee of{" "}
        {application?.school.data.attributes.applicationFee}&euro; for the
        application to be processed.
      </p>
      <p>
        Further details about the school can be found
        <Link href={`/schools/${application?.school.data.attributes.id}`}>
          <a> here</a>
        </Link>
      </p>
      <br />
      <br />

      <div className="steps" id="stepsDemo">
        <div
          className={`step-item ${
            applicationEdit.step === 0 ? "is-active" : "is-completed"
          }`}
        >
          <div className="step-marker">
            <span className="icon">
              <FontAwesomeIcon icon={faAddressCard} />
            </span>
          </div>
          <div className="step-details">
            <p className="step-title">User</p>
            <p>
              Please put in your private information like your personal address
              and name.
            </p>
          </div>
        </div>
        <div
          className={`step-item ${
            applicationEdit.step === 1 ? "is-active" : ""
          } ${application.step > 1 ? "is-completed" : ""}`}
        >
          <div className="step-marker">
            <FontAwesomeIcon icon={faQuestion} />
          </div>
          <div className="step-details">
            <p className="step-title">Questions</p>
            <p>Please answer all questions honestly.</p>
          </div>
        </div>
        <div
          className={`step-item ${
            applicationEdit.step === 2 ? "is-active" : ""
          } ${application.step > 2 ? "is-completed" : ""}`}
        >
          <div className="step-marker">
            <FontAwesomeIcon icon={faMailBulk} />
          </div>
          <div className="step-details">
            <p className="step-title">References</p>

            <p>Send out reference requests.</p>
          </div>
        </div>
        <div
          className={`step-item ${
            applicationEdit.step === 3 ? "is-active" : ""
          } ${
            application.step >= 3 && applicationEdit.state !== "created"
              ? "is-completed"
              : ""
          }`}
        >
          <div className="step-marker">
            <span className="icon">
              <FontAwesomeIcon icon={faCheck} />
            </span>
          </div>
          <div className="step-details">
            <p className="step-title">Confirm</p>
            <p>
              Final step. You have completed all the previous steps and end the
              process.
            </p>
          </div>
        </div>

        <div className={`steps-content ${styles.stepContent}`}>
          <div
            className={`step-content has-text-centered ${
              isLoadingBack || isLoadingNext ? "is-active" : ""
            }`}
          >
            <GoogleSpinner />
          </div>
          <div
            className={`step-content has-text-centered ${
              applicationEdit.step === 0 && !(isLoadingBack || isLoadingNext)
                ? "is-active"
                : ""
            }`}
          >
            <h1 className="title is-4">Personal Information</h1>
            <form className="has-text-left">
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">First name:</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <input
                        type="text"
                        placeholder="first name"
                        name="firstname"
                        id="firstname"
                        className="input"
                        value={userEdit?.firstname}
                        onChange={handleUserInputChange}
                      />
                    </p>
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">Last name:</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <div className="control">
                      <input
                        type="text"
                        placeholder="last name"
                        name="lastname"
                        className="input"
                        id="lastname"
                        value={userEdit?.lastname}
                        onChange={handleUserInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">Gender:</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <div className="control is-expanded">
                      <div className="select">
                        <select
                          name="gender"
                          id="gender"
                          value={userEdit?.gender}
                          onChange={handleUserInputChange}
                        >
                          <option value="null">unknown</option>
                          <option value="male">male</option>
                          <option value="female">female</option>
                          <option value="other">other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">Birthday:</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <input
                        className="input"
                        type="date"
                        name="birthday"
                        value={userEdit?.birthday}
                        onChange={handleUserInputChange}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </form>
            <h1 className="title is-4">Address</h1>
            <AddressEdit
              token={token}
              user={userEdit}
              address={address}
              alwaysEdit={true}
              noButtons={true}
              bindSave={bindAddressSave}
            />
          </div>
          <div
            className={`step-content has-text-centered ${
              applicationEdit.step === 1 && !(isLoadingBack || isLoadingNext)
                ? "is-active"
                : ""
            }`}
          >
            <ApplicationQuestions
              answerDetails={answerDetails}
              bindSave={bindQuestionSave}
              disabled={application.step > applicationEdit.step}
              token={token}
            />
          </div>
          <div
            className={`step-content has-text-centered ${
              applicationEdit.step === 2 && !(isLoadingBack || isLoadingNext)
                ? "is-active"
                : ""
            }`}
          >
            <h1 className="title is-4">Pick your References</h1>
            <br />

            <form className="form">
              <div className="columns has-text-left">
                <div className="column is-half">
                  <h4>Reference Person 1</h4>

                  {reference1?.emailSend ? (
                    <>
                      <h6 className="subtitle is-6">Name</h6>
                      <p>{reference1.name}</p>
                      <h6 className="subtitle is-6">Relation</h6>
                      <p>{reference1.relation}</p>
                      <h6 className="subtitle is-6">Email</h6>
                      <p>{reference1.email}</p>
                      <h6 className="subtitle is-6">Status</h6>
                      <p>
                        {reference1.submitted ? (
                          <div>
                            <span className="icon">
                              <FontAwesomeIcon
                                icon={faCheck}
                                className="has-text-success"
                              />
                            </span>
                            Reference has been submitted
                          </div>
                        ) : (
                          <div>
                            <span className="icon">
                              <FontAwesomeIcon
                                icon={faXmark}
                                className="has-text-danger"
                              />
                            </span>
                            Reference has not yet been submitted
                          </div>
                        )}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="field">
                        <label className="label">Name</label>
                        <div className="control">
                          <input
                            type="text"
                            name="name"
                            className="input"
                            value={reference1.name}
                            onChange={onReference1ValueChanged}
                          />
                        </div>
                      </div>
                      <div className="field">
                        <label className="label">Relation</label>
                        <div className="control">
                          <input
                            type="text"
                            name="relation"
                            className="input"
                            value={reference1.relation}
                            onChange={onReference1ValueChanged}
                          />
                        </div>
                      </div>
                      <div className="field">
                        <label className="label">Email</label>
                        <div className="control">
                          <input
                            type="email"
                            name="email"
                            className="input"
                            value={reference1.email}
                            onChange={onReference1ValueChanged}
                          />
                        </div>
                      </div>

                      <div className="button is-link" onClick={sendReference1}>
                        Send Email
                      </div>
                    </>
                  )}
                </div>
                <div className="column is-half">
                  <h4>Reference Person 2</h4>

                  {reference2?.emailSend ? (
                    <>
                      <h5 className="subtitle is-6">Name</h5>
                      <p>{reference2.name}</p>
                      <h5 className="subtitle is-6">Relation</h5>
                      <p>{reference2.relation}</p>
                      <h5 className="subtitle is-6">Email</h5>
                      <p>{reference2.email}</p>
                      <h6 className="subtitle is-6">Status</h6>
                      <p>
                        {reference2.submitted ? (
                          <div>
                            <span className="icon has-text-success">
                              <FontAwesomeIcon icon={faCheck} />
                            </span>
                            Reference has been submitted
                          </div>
                        ) : (
                          <div>
                            <span className="icon has-text-danger">
                              <FontAwesomeIcon icon={faXmark} />
                            </span>
                            Reference has not yet been submitted
                          </div>
                        )}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="field">
                        <label className="label">Name</label>
                        <div className="control">
                          <input
                            type="text"
                            name="name"
                            className="input"
                            value={reference2.name}
                            onChange={onReference2ValueChanged}
                          />
                        </div>
                      </div>
                      <div className="field">
                        <label className="label">Relation</label>
                        <div className="control">
                          <input
                            type="text"
                            name="relation"
                            className="input"
                            value={reference2.relation}
                            onChange={onReference2ValueChanged}
                          />
                        </div>
                      </div>
                      <div className="field">
                        <label className="label">Email</label>
                        <div className="control">
                          <input
                            type="email"
                            name="email"
                            className="input"
                            value={reference2.email}
                            onChange={onReference2ValueChanged}
                          />
                        </div>
                      </div>

                      <div className="button is-link" onClick={sendReference2}>
                        Send Email
                      </div>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
          <div
            className={`step-content has-text-centered ${
              applicationEdit.step === 3 ? "is-active" : ""
            }`}
          >
            <h1 className="title is-4">Confirm</h1>
            {applicationEdit.state === "created" && (
              <>
                <p>
                  I hereby confirm that I answered all questions to my best
                  knowledge and that I want to apply.
                </p>

                <div
                  className={`button is-primary ${
                    submitLoading && "is-loading"
                  }`}
                  onClick={handleSubmitApplication}
                >
                  Submit
                </div>
              </>
            )}
            {applicationEdit.state === "submitted" && (
              <>
                <p>
                  Your application has been submitted already and is now in
                  review.
                </p>
              </>
            )}
            {applicationEdit.state === "reviewed" && (
              <>
                <p>
                  Your application has been reviewed. You will soon know if it
                  has been approved or revoked.
                </p>
              </>
            )}
            {applicationEdit.state === "approved" && (
              <>
                <p>Congratulations, your application has been approved!</p>
              </>
            )}
            {applicationEdit.state === "revoked" && (
              <>
                <p>Unfortunately, your application has been revoked!</p>
              </>
            )}
          </div>
        </div>
        <div className="steps-actions">
          <div className="steps-action">
            <a
              data-nav="previous"
              onClick={goBack}
              className={`button is-light ${isLoadingBack ? "is-loading" : ""}`}
              disabled={applicationEdit.step === 0 ? true : false}
            >
              Previous
            </a>
          </div>
          <div className="steps-action">
            <a
              data-nav="next"
              onClick={goNext}
              className={`button is-primary ${
                isLoadingNext ? "is-loading" : ""
              }`}
              disabled={applicationEdit.step > 2 ? true : false}
            >
              Next
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params: { id }, req }) {
  let query = qs.stringify({
    populate: ["answers", "school", "user", "reference1", "reference2"],
  });

  const { token } = parseCookie(req);

  const res = await fetch(`${API_URL}/api/school-applications/${id}?${query}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await res.json();
  if (!res.ok) {
    return {
      props: {
        error: result.error,
      },
    };
  }
  let application = {
    id: result.data.id,
    ...result.data.attributes,
  };

  query = qs.stringify({
    populate: ["question"],
    filters: {
      school_application: {
        id: {
          $eq: application.id,
        },
      },
    },
  });
  const answerDetails = [];
  const answerFetch = await fetch(`${API_URL}/api/answers?${query}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const allAnswers = await answerFetch.json();
  if (!answerFetch.ok) {
    throw allAnswers.error;
  }
  await Promise.all(
    allAnswers.data.map(async (answer) => {
      query = qs.stringify({
        populate: "type",
      });

      const questionFetch = await fetch(
        `${API_URL}/api/questions/${answer.attributes.question.data.id}?${query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const questionDetail = await questionFetch.json();
      if (!questionFetch.ok) {
        throw questionDetail.error;
      }
      answer.attributes.question = questionDetail;
      answerDetails.push({
        id: answer.id,
        question: {
          id: answer.attributes.question.data.id,
          ...answer.attributes.question.data.attributes,
          type: {
            id:
              answer.attributes.question.data.attributes.type?.data?.id ?? null,
            ...(answer.attributes.question.data.attributes.type?.data
              ?.attributes ?? null),
          },
        },
        answer: answer.attributes.answer,
      });
    })
  ).catch((error) => {
    return {
      props: {
        error,
      },
    };
  });
  // get Address
  query = qs.stringify(
    {
      filters: {
        user: {
          id: {
            $eq: application.user.data.id,
          },
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  );
  const addressFetch = await fetch(`${API_URL}/api/addresses?${query}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const addressResult = await addressFetch.json();
  const address = addressFetch.ok ? addressResult.data.pop() : null;

  return {
    props: {
      application,
      answerDetails,
      token,
      address: address ? { id: address.id, ...address.attributes } : null,
    },
  };
}
