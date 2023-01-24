import DashboardLayout from "@/components/Layout/DashboardLayout";
import { parseCookie } from "lib/utils";
import {
  faAngleDown,
  faAngleUp,
  faCheck,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { toast } from "react-toastify";
import GoogleSpinner from "@/components/common/GoogleSpinner";
import Image from "next/image";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import {
  Answer,
  Application,
  ApplicationState,
  StaffApplication,
  User,
} from "api-definitions/backend";
import { useLocale } from "i18n/useLocale";
import { getStaffApplicationDetails } from "lib/staffApplication";
import { getMainAddress } from "lib/address";
import { allCountries } from "lib/countries";
import AdminReference from "@/components/admin/AdminReference";
import { deleteApplicationRequest, updateState } from "lib/applications";

export default function ApplicationAdminView({
  application,
  token,
  user,
}: {
  application: StaffApplication;
  token: string;
  user: User;
}) {
  const [showReference1, setShowReference1] = useState(false);
  const [showReference2, setShowReference2] = useState(false);
  const [isLoadingAppAnswers, setIsLoadingAppAnswers] = useState(false);
  const [showQuestionary, setShowQuestionary] = useState(false);
  const [applicationAnswers, setApplicationAnswers] = useState<Answer[]>([]);

  const mainAddress = getMainAddress(user);

  const toggleShowQuestionary = async () => {
    setShowQuestionary(!showQuestionary);
    if (!showQuestionary && applicationAnswers.length === 0) {
      try {
        setIsLoadingAppAnswers(true);
        const answerDetails = application.answers ?? [];
        setApplicationAnswers(answerDetails);
      } catch (error: any) {
        toast.error(error.message ?? error);
      } finally {
        setIsLoadingAppAnswers(false);
      }
    }
  };

  const toggleShowReference1 = () => {
    setShowReference1(!showReference1);
  };

  const toggleShowReference2 = () => {
    setShowReference2(!showReference2);
  };

  const router = useRouter();
  const locale = useLocale();
  const reference1 = application.references?.find(() => true);
  const reference2 = application.references?.find((_ref, index) => index === 1);

  const deleteApplication = async (id: number) => {
    if (
      !confirm(
        "Do you really want to delete this application? There is no going back..."
      )
    )
      return;
    try {
      await deleteApplicationRequest(id, token, "staff");

      toast.success("Application was successful deleted");
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast.error(
        "Error while deleting application: " + error?.message ?? error
      );
    }
  };

  const revokeApplication = async (application: Application) => {
    if (application.state === "revoked") {
      return;
    }
    await changeState(application, "revoked");
  };

  const approveApplication = async (application: StaffApplication) => {
    try {
      if (application.state === "approved") {
        return;
      }
      await changeState(application, "approved");
    } catch (error: any) {
      toast.error(error.message ?? error);
    }
  };

  async function changeState(
    application: Application,
    desiredState: ApplicationState
  ) {
    try {
      await updateState(application.id, token, desiredState, "staff");
      toast.success(`Application was successful ${desiredState}`);
      router.reload();
    } catch (err: any) {
      toast.error(
        "Error while changing state of application: " + err?.message ?? err
      );
    }
  }

  return (
    <section className="section has-background-light">
      <h3 className="title is-3">Application for Staff</h3>
      <div className="columns">
        <div className="column is-7">
          <div className="card my-5">
            <header className="card-header">
              <p className="card-header-title background-gradient-primary-info">
                General
              </p>
            </header>
            <div className="card-content">
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">
                  Wants to arrive at:
                </div>
                <div className="column">
                  {new Date(application.arriveAt ?? "").toLocaleDateString(
                    locale
                  )}
                </div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">
                  Wants to stay until:
                </div>
                <div className="column">
                  {application.stayUntil
                    ? new Date(application.stayUntil).toLocaleDateString(locale)
                    : "unknown"}
                </div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">Status:</div>
                <div className="column">{application.state}</div>
              </div>
              {application.state === "submitted" && (
                <div className="columns is-mobile">
                  <div className="column is-3 has-text-weight-bold">
                    Submitted at:
                  </div>
                  <div className="column">
                    {application.submittedAt
                      ? new Date(application.submittedAt).toLocaleDateString(
                          locale
                        )
                      : ""}
                  </div>
                </div>
              )}
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-bold">
                  Progress:
                </div>
                <div className="column is-7 has-text-weight-bold">
                  <progress
                    className="progress is-primary my-2"
                    value={application.step}
                    max="3"
                  >
                    {application.step} / 3
                  </progress>
                </div>
              </div>
              <div className="columns-is-mobile">
                <div className="column">
                  <button
                    className={`button mx-1 is-success tooltip-bottom`}
                    data-tooltip="Approve"
                    disabled={application.state === "approved"}
                    onClick={() => approveApplication(application)}
                  >
                    <span className="icon">
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                  </button>
                  <button
                    className="button mx-1 is-warning tooltip-bottom"
                    data-tooltip="Revoke"
                    disabled={application.state === "revoked"}
                    onClick={() => revokeApplication(application)}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>

                  <div
                    className="button mx-1 is-danger tooltip-bottom"
                    data-tooltip="Delete"
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
              <p className="card-header-title background-gradient-primary-right">
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
                        user.picture?.formats.thumbnail?.url ??
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
                <div className="column is-3 has-text-weight-bold">Email:</div>
                <div className="column">
                  <a href={`mailto:${user.email}`}> {user.email}</a>
                </div>
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
                  {new Date(user.birthday ?? "").toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <div className="card my-5">
            <header className="card-header">
              <p className="card-header-title background-gradient-primary-right">
                Address
              </p>
            </header>
            <div className="card-content">
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-semibold">
                  Street:
                </div>
                <div className="column is-5">{mainAddress?.street}</div>
                <div className="column is-2">{mainAddress?.number}</div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-semibold">
                  City:
                </div>
                <div className="column">{mainAddress?.city}</div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-semibold">
                  Postal Code:
                </div>
                <div className="column">{mainAddress?.postalCode}</div>
              </div>

              <div className="columns is-mobile">
                <div className="column is-3 has-text-weight-semibold">
                  Country:
                </div>
                <div className="column">
                  {mainAddress?.country &&
                    allCountries.getName(mainAddress?.country, locale)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="column">
          <div className="card my-5">
            <header className="card-header background-gradient-success-link">
              <p className="card-header-title">Questionary</p>
              <button
                className="card-header-icon"
                aria-label="show"
                onClick={toggleShowQuestionary}
              >
                <span className="icon">
                  {showQuestionary ? (
                    <FontAwesomeIcon icon={faAngleUp} />
                  ) : (
                    <FontAwesomeIcon icon={faAngleDown} />
                  )}
                </span>
              </button>
            </header>
            <div
              className={`card-content has-text-centered is-collapsible ${
                showQuestionary ? "" : "is-collapsed"
              }`}
              aria-expanded={showQuestionary ? "true" : "false"}
            >
              {isLoadingAppAnswers && <GoogleSpinner />}
              {applicationAnswers?.map((answer) => (
                <div key={answer.id}>
                  <div className="has-text-weight-bold">
                    {answer.question.question}
                  </div>
                  <div>
                    {answer.question.inputType === "bool"
                      ? answer.answer === "true"
                        ? "Yes"
                        : "No"
                      : answer.answer}
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          </div>
          <div className="card my-5">
            <header className="card-header background-gradient-info-right">
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
              {reference1 == undefined ? (
                <p>Reference has not been created yet</p>
              ) : (
                <AdminReference reference={reference1} token={token} />
              )}
            </div>
          </div>
          <div className="card my-5">
            <header
              className="card-header background-gradient-info-right"
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
              {reference2 == undefined ? (
                <p>Reference has not been created yet</p>
              ) : (
                <AdminReference reference={reference2} token={token} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

ApplicationAdminView.getLayout = function getLayout(page: any) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const { token } = parseCookie(req);
  let id = params?.id;
  if (!id || !token) {
    return {
      props: {
        application: undefined,
        user: undefined,
        token,
      },
    };
  }
  if (typeof id !== "string") {
    id = id[0];
  }
  const application = await getStaffApplicationDetails(id, token, {
    populate: {
      answers: {
        populate: "*",
      },
      references: {
        populate: "",
      },
      user: {
        populate: ["addresses", "picture", "schools"],
      },
    },
    sort: "createdAt:asc",
  });
  const user = application.data?.user;

  return {
    props: {
      application: application.data,
      user: user,
      token,
    },
  };
};
