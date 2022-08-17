import { applicationDetails, general } from "@/i18n";
import { useRouter } from "next/router";

export default function ConfirmStep({
  applicationState,
  submitApplication,
  submitLoading,
}) {
  const { locale } = useRouter();
  return (
    <>
      {applicationState === "created" && (
        <>
          <p className="my-5">{applicationDetails[locale].confirmText}</p>

          <div
            className={`button is-primary ${submitLoading && "is-loading"}`}
            onClick={submitApplication}
          >
            {general.buttons[locale].submit}
          </div>
        </>
      )}
      {applicationState === "submitted" && (
        <>
          <p className="my-5">{applicationDetails[locale].submittedText}</p>
        </>
      )}
      {applicationState === "reviewed" && (
        <>
          <p className="my-5">{applicationDetails[locale].reviewedText}</p>
        </>
      )}
      {applicationState === "approved" && (
        <>
          <p className="my-5">{applicationDetails[locale].approvedText}</p>
        </>
      )}
      {applicationState === "revoked" && (
        <>
          <p className="my-5">{applicationDetails[locale].revokedText}</p>
        </>
      )}
    </>
  );
}
