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
} from "@fortawesome/free-solid-svg-icons";
import GoogleSpinner from "@/components/common/GoogleSpinner";
import AddressEdit from "@/components/user/AddressEdit";
import AuthContext from "@/context/AuthContext";
import NotAuthorized from "@/components/auth/NotAuthorized";
import { updateState, updateStep } from "lib/staffApplication";
import { updateMe } from "lib/user";
import ApplicationQuestions from "@/components/application/ApplicationQuestions";
import ReferenceForm from "@/components/application/ReferenceForm";
import ConfirmStep from "@/components/application/ConfirmStep";

export default function StaffApplicationPage({
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
  const [reference1Send, setReference1Send] = useState(
    application.reference1?.data?.attributes.emailSend ?? false
  );
  const [reference2Send, setReference2Send] = useState(
    application.reference2?.data?.attributes.emailSend ?? false
  );

  if (!application) {
    router.push("/404");
    return;
  }
  console.log(application.user);
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
      if (applicationEdit.state === "created") {
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
          if (!reference1Send || !reference2Send) {
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
    toast.success("User data successfully updated");
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
      <h1>Staff Application</h1>
      <p>
        This is your staff application, if you have any questions, please
        contact us.
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
              disabled={applicationEdit.state !== "created"}
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
            <ReferenceForm
              application={application}
              user={user}
              token={token}
              reference1Send={setReference1Send}
              reference2Send={setReference2Send}
            />
          </div>
          <div
            className={`step-content has-text-centered ${
              applicationEdit.step === 3 ? "is-active" : ""
            }`}
          >
            <ConfirmStep
              applicationState={applicationEdit.state}
              submitApplication={handleSubmitApplication}
              submitLoading={submitLoading}
            />
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

export async function getServerSideProps({ req, params: { id } }) {
  let query = qs.stringify({
    populate: ["answers", "user", "reference1", "reference2"],
  });

  const { token } = parseCookie(req);

  const res = await fetch(`${API_URL}/api/staff-applications/${id}?${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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
      staff_application: {
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
