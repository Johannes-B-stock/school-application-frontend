import { useRouter } from "next/router";
import qs from "qs";
import { useState, useEffect, useContext, ChangeEvent } from "react";
import styles from "@/styles/Application.module.css";
import { parseCookie } from "lib/utils";
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
import {
  getStaffApplicationDetails,
  getStaffApplicationSettings,
  updateApplicationDates,
} from "lib/staffApplication";
import { updateMe } from "lib/user";
import ApplicationQuestions from "@/components/application/ApplicationQuestions";
import ReferenceForm from "@/components/application/ReferenceForm";
import ConfirmStep from "@/components/application/ConfirmStep";
import UserDetailsEdit from "@/components/user/UserDetailsEdit";
import GenderSelect from "@/components/common/GenderSelect";
import { GetServerSideProps } from "next";
import { general, profile, staffApplicationDetails } from "@/i18n";
import {
  ErrorResponse,
  Question,
  StaffApplication,
  StaffApplicationSetting,
} from "api-definitions/backend";
import { useLocale } from "i18n/useLocale";
import { getMainAddress } from "lib/address";
import { getQuestionsFromAPI } from "lib/questions";
import NotFound from "@/components/common/NotFound";
import { updateState, updateStep } from "lib/applications";

export default function StaffApplicationPage({
  application,
  applicationSettings,
  questionCollection,
  error,
  token,
}: {
  application?: StaffApplication;
  applicationSettings?: StaffApplicationSetting;
  questionCollection?: Question[];
  error: ErrorResponse;
  token: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const { user } = useContext(AuthContext);
  const [applicationEdit, setApplicationEdit] = useState(application);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [isLoadingBack, setIsLoadingBack] = useState(false);
  const [userEdit, setUserEdit] = useState(user);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [reference1Send, setReference1Send] = useState(
    application?.references?.find(() => true)?.emailSend ?? false
  );
  const [reference2Send, setReference2Send] = useState(
    application?.references?.find((_ref, index) => index === 1)?.emailSend ??
      false
  );

  useEffect(() => {
    if (error) {
      toast.error(`${error.status} - ${error.message}`);
    }
  }, [router, error]);

  if (!application) {
    router.push("/404");
    return;
  }
  if (application.user.id !== user?.id) {
    return <NotAuthorized />;
  }

  let addressSaveFunction: (() => Promise<void>) | undefined = undefined;

  function bindAddressSave(saveFunction: () => Promise<void>) {
    addressSaveFunction = saveFunction;
  }
  let questionSaveFunction: (() => Promise<void>) | undefined = undefined;
  function bindQuestionSave(saveFunction: () => Promise<void>) {
    questionSaveFunction = saveFunction;
  }
  let userDetailsSaveFunction: (() => Promise<void>) | undefined = undefined;
  function bindUserDetailsSave(saveFunction: () => Promise<void>) {
    userDetailsSaveFunction = saveFunction;
  }

  const goToStep = async (step: number) => {
    if (
      !applicationEdit ||
      step == null ||
      application.step < step ||
      step < 0
    ) {
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

  const saveApplicationEdit = async () => {
    if (!applicationEdit) {
      return;
    }
    if (!applicationEdit.arriveAt) {
      throw new Error("Please provide the date when you want to arrive");
    }
    await updateApplicationDates(token, applicationEdit);
  };

  const goBack = async () => {
    if (!applicationEdit) {
      return;
    }
    if (applicationEdit.step === 0 || isLoadingBack || isLoadingNext) {
      return;
    }
    setIsLoadingBack(true);
    const nextStep = applicationEdit.step - 1;
    await handleStepUpdate(nextStep);
    setIsLoadingBack(false);
  };

  const goNext = async () => {
    if (
      !applicationEdit ||
      applicationEdit.step >= 3 ||
      isLoadingBack ||
      isLoadingNext
    ) {
      return;
    }

    try {
      setIsLoadingNext(true);
      if (applicationEdit.state === "created") {
        if (applicationEdit.step === 0) {
          await saveUserEdit();
          await saveApplicationEdit();
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
    } catch (error: any) {
      toast.error(error.message ?? error);
    } finally {
      setIsLoadingNext(false);
    }
  };

  async function handleStepUpdate(nextStep: number) {
    if (!applicationEdit || !application) {
      return;
    }
    if (nextStep > applicationEdit.step) {
      const updateStepResult = await updateStep(
        application.id,
        nextStep,
        token,
        "staff"
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

  const handleUserInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!userEdit) {
      return;
    }
    setUserEdit({ ...userEdit, [name]: value });
  };

  const handleApplicationInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!applicationEdit) {
      return;
    }
    const { name, value } = e.target;
    setApplicationEdit({ ...applicationEdit, [name]: value });
  };

  async function saveUserEdit() {
    if (!userEdit?.firstname) {
      throw new Error("Please fill in your first name");
    }
    if (!userEdit?.lastname) {
      throw new Error("Please fill in your last name");
    }
    if (!userEdit?.gender) {
      throw new Error("Please fill in your gender");
    }
    if (!userEdit?.birthday) {
      throw new Error("Please fill in your birthday");
    }
    await updateMe(userEdit, token);
  }

  const handleSubmitApplication = async () => {
    if (submitLoading || !applicationEdit) {
      return;
    }
    try {
      setSubmitLoading(true);
      await updateState(application.id, token, "submitted", "staff");
      setApplicationEdit({ ...applicationEdit, state: "submitted" });

      toast.success("Successfully submitted!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!applicationEdit || !application) {
    return <NotFound />;
  }

  return (
    <div className="content has-text-centered">
      <h1>{staffApplicationDetails[locale].title}</h1>
      <div style={{ maxWidth: "590px", margin: "auto" }}>
        <p>{staffApplicationDetails[locale].subtitle}</p>
      </div>

      <br />
      <br />

      <div className="steps" id="stepsDemo">
        <div
          className={`step-item ${
            application.step === 0 ? "is-active" : "is-completed is-clickable"
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
              {staffApplicationDetails[locale].step1Title}
            </p>
            <p className="is-hidden-mobile">
              {staffApplicationDetails[locale].step1Desc}
            </p>
          </div>
        </div>
        <div
          className={`step-item ${
            applicationEdit?.step === 1 ? "is-active" : ""
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
              {staffApplicationDetails[locale].step2Title}
            </p>
            <p className="is-hidden-mobile">
              {staffApplicationDetails[locale].step2Desc}
            </p>
          </div>
        </div>
        <div
          className={`step-item ${
            applicationEdit?.step === 2 ? "is-active" : ""
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
              {staffApplicationDetails[locale].step3Title}
            </p>

            <p className="is-hidden-mobile">
              {staffApplicationDetails[locale].step3Desc}
            </p>
          </div>
        </div>
        <div
          className={`step-item ${
            applicationEdit?.step === 3 ? "is-active" : ""
          } ${
            application.step >= 3 && applicationEdit?.state !== "created"
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
              {staffApplicationDetails[locale].step4Title}
            </p>
            <p className={`is-hidden-mobile`}>
              {staffApplicationDetails[locale].step4Desc}
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
              applicationEdit?.step === 0 && !(isLoadingBack || isLoadingNext)
                ? "is-active"
                : ""
            }`}
          >
            {" "}
            <h1 className="title is-4 has-text-left my-6">
              {staffApplicationDetails[locale].arrival}
            </h1>
            <h5 className="subtitle is-5 has-text-left">
              {staffApplicationDetails[locale].arrivalSubtitle}
            </h5>
            <form className="has-text-left longer-form-labels">
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">
                    {staffApplicationDetails[locale].arrivalDate}*:
                  </label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="date"
                        name="arriveAt"
                        value={applicationEdit?.arriveAt ?? ""}
                        onChange={handleApplicationInputChange}
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faCalendar} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">
                    {staffApplicationDetails[locale].stayUntil}:
                  </label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="date"
                        name="stayUntil"
                        value={applicationEdit?.stayUntil ?? ""}
                        onChange={handleApplicationInputChange}
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faCalendar} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <h1 className="title is-4 has-text-left my-6">
              {profile[locale].personal}
            </h1>
            <form className="has-text-left longer-form-labels">
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">
                    {staffApplicationDetails[locale].name}*:
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
                        value={userEdit?.firstname ?? ""}
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
                        value={userEdit?.middle_names ?? ""}
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
                        value={userEdit?.lastname ?? ""}
                        onChange={handleUserInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">{profile[locale].gender}*:</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <GenderSelect
                      value={userEdit?.gender}
                      onInputChange={handleUserInputChange}
                      locale={locale}
                    />
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">{profile[locale].birthdate}*:</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="date"
                        name="birthday"
                        value={userEdit?.birthday ?? ""}
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
              {profile[locale].address}
            </h1>
            {userEdit && (
              <AddressEdit
                token={token}
                user={userEdit}
                address={getMainAddress(application.user)}
                addressId={getMainAddress(application.user)?.id}
                alwaysEdit={true}
                noButtons={true}
                bindSave={bindAddressSave}
              />
            )}
          </div>
          <div
            className={`step-content has-text-centered ${
              applicationEdit?.step === 1 && !(isLoadingBack || isLoadingNext)
                ? "is-active"
                : ""
            }`}
          >
            {questionCollection && (
              <ApplicationQuestions
                application={application}
                questionCollection={questionCollection}
                answerDetails={application.answers}
                bindSave={bindQuestionSave}
                disabled={applicationEdit?.state !== "created"}
                token={token}
              />
            )}
          </div>
          <div
            className={`step-content has-text-centered ${
              applicationEdit?.step === 2 && !(isLoadingBack || isLoadingNext)
                ? "is-active"
                : ""
            }`}
          >
            <h1 className="title is-4">
              {staffApplicationDetails[locale].pickReferences}
            </h1>
            <br />
            <ReferenceForm
              application={application}
              user={user}
              reference1Send={setReference1Send}
              reference2Send={setReference2Send}
            />
          </div>
          <div
            className={`step-content has-text-centered ${
              applicationEdit?.step === 3 ? "is-active" : ""
            }`}
          >
            <ConfirmStep
              applicationState={applicationEdit?.state}
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
              disabled={applicationEdit?.step === 0 ? true : false}
            >
              {general.buttons[locale].previous}
            </button>
          </div>
          <div className="steps-action">
            <button
              data-nav="next"
              onClick={goNext}
              className={`button is-primary ${
                isLoadingNext ? "is-loading" : ""
              }`}
              disabled={applicationEdit?.step > 2 ? true : false}
            >
              {general.buttons[locale].next}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const id = typeof params?.id === "string" ? params.id : params?.id?.[0];
  if (!id) {
    throw new Error("id params is missing");
  }
  const query = qs.stringify({
    populate: {
      answers: {
        populate: {
          question: {
            populate: ["type.localizations", "localizations"],
          },
        },
      },
      user: {
        populate: ["addresses"],
      },
      references: { populate: "*" },
    },
  });

  const { token } = parseCookie(req);
  if (!token) {
    throw new Error("Not logged in!");
  }

  try {
    const application = await getStaffApplicationDetails(id, token, query);

    if (application.error) {
      return {
        props: {
          error: application.error,
        },
      };
    }
    if (!application.data) {
      return { notFound: true };
    }
    const settingsQuery = qs.stringify(
      {
        populate: "applicationQuestions",
      },
      { encodeValuesOnly: true }
    );
    const applicationSettings = await getStaffApplicationSettings({
      token,
      query: settingsQuery,
    });

    if (applicationSettings.error) {
      return {
        props: {
          error: applicationSettings.error,
        },
      };
    }

    const questionsQuery = qs.stringify({
      filters: {
        collection: {
          id: { $eq: applicationSettings.data?.applicationQuestions.id },
        },
      },
      populate: ["type", "localizations"],
    });

    const questions = await getQuestionsFromAPI(token, questionsQuery);

    if (questions.error) {
      return {
        props: {
          error: questions.error,
        },
      };
    }
    return {
      props: {
        application: application.data,
        applicationSettings: applicationSettings.data,
        questionCollection: questions.data,
        token,
      },
    };
  } catch (error: any) {
    return {
      props: {
        error: error.message ?? error,
      },
    };
  }
};
