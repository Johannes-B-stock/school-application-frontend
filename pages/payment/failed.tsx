import { API_URL } from "@/config/index";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function FailedPage() {
  const router = useRouter();

  const sessionId = null;
  if (sessionId) {
    axios
      .get(`${API_URL}/strapi-stripe/retrieveCheckoutSession/${sessionId}`)
      .then((response) => console.log(response));
  }

  return (
    <div className="section">
      <div className="columns is-centered has-text-centered ">
        <div className="column is-5 box p-5 has-background-warning-light">
          <h1 className="title is-3 m-5">Payment Canceled</h1>

          <h4 className="subtitle is-4 m-5">
            Payment failed or got canceled. Please try again or
            <Link href="/contact"> contact us</Link>
          </h4>
          <div className="button my-4" onClick={() => router.back()}>
            Try again
          </div>
        </div>
      </div>
    </div>
  );
}
