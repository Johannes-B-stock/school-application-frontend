export default function ConfirmStep({
  applicationState,
  submitApplication,
  submitLoading,
}) {
  return (
    <>
      {applicationState === "created" && (
        <>
          <p className="my-5">
            I hereby confirm that I answered all questions to my best knowledge
            and that I want to apply.
          </p>

          <div
            className={`button is-primary ${submitLoading && "is-loading"}`}
            onClick={submitApplication}
          >
            Submit
          </div>
        </>
      )}
      {applicationState === "submitted" && (
        <>
          <p className="my-5">
            Your application has been submitted already and is now in review.
          </p>
        </>
      )}
      {applicationState === "reviewed" && (
        <>
          <p className="my-5">
            Your application has been reviewed. You will soon know if it has
            been approved or revoked.
          </p>
        </>
      )}
      {applicationState === "approved" && (
        <>
          <p className="my-5">
            Congratulations, your application has been approved!
          </p>
        </>
      )}
      {applicationState === "revoked" && (
        <>
          <p className="my-5">
            Unfortunately, your application has been revoked!
          </p>
        </>
      )}
    </>
  );
}
