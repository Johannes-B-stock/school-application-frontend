import Link from "next/link";

export default function NotConfirmedPage() {
  return (
    <section className="section hero">
      <div className="columns is-centered has-text-centered ">
        <div className="column is-7 box p-6 hero is-danger">
          <h1 className="title is-4">Not Confirmed</h1>
          <p>
            Your account has not been confirmed yet. Please check your emails
            and click on the confirmation link.
          </p>
          <p>
            After confirmation, please <Link href="/account/login">login </Link>
            again.
          </p>
        </div>
      </div>
    </section>
  );
}
