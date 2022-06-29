export default function ConfirmStep({
  applicationState,
  submitApplication,
  submitLoading,
}) {
  return (
    <>
      <h1 className="title is-4">Confirm</h1>
      {applicationState === "created" && (
        <>
          <p>
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
          <p>
            Your application has been submitted already and is now in review.
          </p>
        </>
      )}
      {applicationState === "reviewed" && (
        <>
          <p>
            Your application has been reviewed. You will soon know if it has
            been approved or revoked.
          </p>
        </>
      )}
      {applicationState === "approved" && (
        <>
          <p>Congratulations, your application has been approved!</p>
        </>
      )}
      {applicationState === "revoked" && (
        <>
          <p>Unfortunately, your application has been revoked!</p>
        </>
      )}
    </>
  );
}
