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
  faCalendar,
  faCheck,
  faMailBulk,
  faQuestion,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import GoogleSpinner from "@/components/common/GoogleSpinner";
import AddressEdit from "@/components/user/AddressEdit";
import AuthContext from "@/context/AuthContext";
import NotAuthorized from "@/components/auth/NotAuthorized";
import { updateState, updateStep } from "lib/schoolApplication";
import { updateMe } from "lib/user";
import ApplicationQuestions from "@/components/application/ApplicationQuestions";
import ReferenceForm from "@/components/application/ReferenceForm";
import ConfirmStep from "@/components/application/ConfirmStep";
import GenderSelect from "@/components/common/GenderSelect";
import UserDetailsEdit from "@/components/user/UserDetailsEdit";
import { faStripe } from "@fortawesome/free-brands-svg-icons";
import { general, profile, schoolApplicationDetails } from "@/i18n";

export default function ApplicationPage({ application, error, token }) {
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
  const [reference1Send, setReference1Send] = useState<boolean>(
    application?.reference1?.data?.attributes.emailSend ?? false
  );
  const [reference2Send, setReference2Send] = useState<boolean>(
    application?.reference2?.data?.attributes.emailSend ?? false
  );

  if (!application) {
    router.push("/404");
    return;
  }
  if (application.user.data.id !== user?.id) {
    return <NotAuthorized />;
  }

  let addressSaveFunction = undefined;

  function bindAddressSave(saveFunction) {
    addressSaveFunction = saveFunction;
  }
  let questionSaveFunction: () => Promise<void> = undefined;
  function bindQuestionSave(saveFunction: () => Promise<void>) {
    questionSaveFunction = saveFunction;
  }
  let userDetailsSaveFunction: () => Promise<void> = undefined;
  function bindUserDetailsSave(saveFunction: () => Promise<void>) {
    userDetailsSaveFunction = saveFunction;
  }

  const goToStep = async (step) => {
    if (step == null || application.step < step || step < 0) {
      return;
    }
    if (applicationEdit.step < step) {
      setIsLoadingNext(true);
      await handleStepUpdate(step);
      setIsLoadingNext(false);
    } else {
      setIsLoadingBack(true);
      await handleStepUpdate(step);
      setIsLoadingBack(false);
    }
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
      if (applicationEdit.state === "created") {
        if (applicationEdit.step === 0) {
          await saveUserEdit();
          if (!addressSaveFunction) {
            throw new Error("can not save address!");
          }
          await addressSaveFunction();
          if (!userDetailsSaveFunction) {
            throw new Error("can not save user details!");
          }
          await userDetailsSaveFunction();
          toast.success("User data successfully updated");
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
        toast.error(updateStepResult.errorMessage);
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

  const handlePayment = async () => {
    const productId = application?.school.data.attributes.stripeAppFeeId;
    const getProductApi = API_URL + "/strapi-stripe/getProduct/" + productId;
    const checkoutSessionUrl =
      API_URL + "/strapi-stripe/createCheckoutSession/";

    await fetch(getProductApi, {
      method: "get",
      mode: "cors",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        await fetch(checkoutSessionUrl, {
          method: "post",
          body: JSON.stringify({
            stripePriceId: response.stripePriceId,
            stripePlanId: response.stripePlanId,
            isSubscription: response.isSubscription,
            productId: response.id,
            productName: response.title,
          }),
          mode: "cors",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
        })
          .then((response) => response.json())
          .then((response) => {
            router.push(response.url);
          });
      })
      .catch((err) => toast.error(err.message ?? err));
  };

  return (
    <div className="content has-text-centered">
      <h1>
        {schoolApplicationDetails[router.locale].title.replace(
          "{0}",
          application?.school.data.attributes.name
        )}
      </h1>
      <p>
        {schoolApplicationDetails[router.locale].subtitle1.replace(
          "{0}",
          application?.school.data.attributes.name
        )}
      </p>
      <p>
        {schoolApplicationDetails[router.locale].subtitle2.replace(
          "{0}",
          application?.school.data.attributes.applicationFee
        )}
      </p>
      {application?.school.data.attributes.stripeAppFeeId && (
        <div className="button is-link mb-2" onClick={handlePayment}>
          <FontAwesomeIcon icon={faStripe} className="icon mr-3" />
          {schoolApplicationDetails[router.locale].feeButton}
        </div>
      )}
      <div>
        {schoolApplicationDetails[router.locale].subtitle3.split("{0}")[0]}
        <Link href={`/schools/${application?.school.data.id}`}>
          <a>{schoolApplicationDetails[router.locale].here}</a>
        </Link>
        {schoolApplicationDetails[router.locale].subtitle3.split("{0}")[1] ??
          ""}
      </div>
      <br />
      <br />

      <div className="steps" id="stepsDemo">
        <div
          className={`step-item ${
            applicationEdit.step === 0
              ? "is-active"
              : "is-completed is-clickable"
          }`}
          onClick={() => goToStep(0)}
        >
          <div className="step-marker">
            <span className="icon">
              <FontAwesomeIcon icon={faAddressCard} />
            </span>
          </div>
          <div className="step-details">
            <p className="step-title is-hidden-mobile">
              {schoolApplicationDetails[router.locale].step1Title}
            </p>
            <p className="is-hidden-mobile">
              {schoolApplicationDetails[router.locale].step1Desc}
            </p>
          </div>
        </div>
        <div
          className={`step-item ${
            applicationEdit.step === 1 ? "is-active" : ""
          } ${application.step > 1 ? "is-completed" : ""} ${
            application.step >= 1 ? "is-clickable" : ""
          }`}
          onClick={() => goToStep(1)}
        >
          <div className="step-marker">
            <FontAwesomeIcon icon={faQuestion} />
          </div>
          <div className="step-details">
            <p className="step-title is-hidden-mobile">
              {schoolApplicationDetails[router.locale].step2Title}
            </p>
            <p className="is-hidden-mobile">
              {schoolApplicationDetails[router.locale].step2Desc}
            </p>
          </div>
        </div>
        <div
          className={`step-item ${
            applicationEdit.step === 2 ? "is-active" : ""
          } ${application.step > 2 ? "is-completed" : ""} ${
            application.step >= 2 ? "is-clickable" : ""
          }`}
          onClick={() => goToStep(2)}
        >
          <div className="step-marker">
            <FontAwesomeIcon icon={faMailBulk} />
          </div>
          <div className="step-details">
            <p className="step-title is-hidden-mobile">
              {schoolApplicationDetails[router.locale].step3Title}
            </p>

            <p className="is-hidden-mobile">
              {schoolApplicationDetails[router.locale].step3Desc}
            </p>
          </div>
        </div>
        <div
          className={`step-item ${
            applicationEdit.step === 3 ? "is-active" : ""
          } ${
            application.step >= 3 && applicationEdit.state !== "created"
              ? "is-completed"
              : ""
          } ${application.step >= 3 ? "is-clickable" : ""}`}
          onClick={() => goToStep(3)}
        >
          <div className="step-marker">
            <span className="icon">
              <FontAwesomeIcon icon={faCheck} />
            </span>
          </div>
          <div className="step-details">
            <p className="step-title is-hidden-mobile">
              {schoolApplicationDetails[router.locale].step4Title}
            </p>
            <p className="is-hidden-mobile">
              {schoolApplicationDetails[router.locale].step4Desc}
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
            <h1 className="title is-4 has-text-left">
              {profile[router.locale].personal}
            </h1>
            <form className="has-text-left longer-form-labels">
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">
                    {profile[router.locale].name}*:
                  </label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <div className="control has-icons-left">
                      <input
                        type="text"
                        placeholder="First Name"
                        name="firstname"
                        id="firstname"
                        className="input"
                        value={userEdit?.firstname}
                        onChange={handleUserInputChange}
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faUser} />
                      </span>
                    </div>
                  </div>
                  <div className="field">
                    <div className="control">
                      <input
                        type="text"
                        placeholder="Middle Name(s)"
                        name="middle_names"
                        className="input"
                        id="middle_names"
                        value={userEdit?.middle_names}
                        onChange={handleUserInputChange}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <div className="control">
                      <input
                        type="text"
                        placeholder="Last Name"
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
                  <label className="label">
                    {profile[router.locale].gender}*:
                  </label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <GenderSelect
                      value={userEdit?.gender}
                      onInputChange={handleUserInputChange}
                      locale={router.locale}
                    />
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">
                    {profile[router.locale].birthdate}*:
                  </label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="date"
                        name="birthday"
                        value={userEdit?.birthday}
                        onChange={handleUserInputChange}
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faCalendar} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <br />
            <UserDetailsEdit
              userDetails={user.details}
              token={token}
              allowEdit={true}
              showSave={false}
              setSaveFunction={bindUserDetailsSave}
            />
            <h1 className="title is-4 has-text-left my-6">
              {profile[router.locale].address}
            </h1>
            <AddressEdit
              token={token}
              user={userEdit}
              address={application.user.data.attributes.address.data}
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
              answerDetails={application.answers.data}
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
            <h1 className="title is-4">
              {schoolApplicationDetails[router.locale].pickReferences}
            </h1>
            <br />
            <ReferenceForm
              application={application}
              user={user}
              token={token}
              reference1Send={setReference1Send}
              reference2Send={setReference2Send}
              schoolReference={true}
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
            <button
              data-nav="previous"
              onClick={goBack}
              className={`button is-light ${isLoadingBack ? "is-loading" : ""}`}
              disabled={applicationEdit.step === 0 ? true : false}
            >
              {general.buttons[router.locale].previous}
            </button>
          </div>
          <div className="steps-action">
            <button
              data-nav="next"
              onClick={goNext}
              className={`button is-primary ${
                isLoadingNext ? "is-loading" : ""
              }`}
              disabled={applicationEdit.step > 2 ? true : false}
            >
              {general.buttons[router.locale].next}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params: { id }, req }) {
  let query = qs.stringify({
    populate: {
      answers: {
        populate: {
          question: {
            populate: ["type.localizations", "localizations"],
          },
        },
      },
      user: {
        populate: ["address"],
      },
      school: { populate: "*" },
      reference1: { populate: "*" },
      reference2: { populate: "*" },
    },
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

  return {
    props: {
      application,
      token,
    },
  };
}
