import { API_URL } from "@/config/index";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function SuccessPage({ paymentDetails }) {
  const router = useRouter();
  if (!paymentDetails) {
    router.back();
  }
  async function updateStrapiBackend() {
    if (!paymentDetails) {
      return;
    }
    if (paymentDetails.payment_status === "paid") {
      if (
        window.performance
          .getEntriesByType("navigation")
          .map((nav) => nav.entryType)
          .includes("reload")
      ) {
        console.info("website reloaded");
      } else {
        console.log("sending Payment details to strapi backend...");
        // store payment in strapi
        const stripePaymentUrl = API_URL + "/strapi-stripe/stripePayment";
        await fetch(stripePaymentUrl, {
          method: "post",
          body: JSON.stringify({
            txnDate: new Date(),
            transactionId: paymentDetails.id,
            isTxnSuccessful: true,
            txnMessage: paymentDetails,
            txnAmount: paymentDetails.amount_total / 100,
            customerName: paymentDetails.customer_details.name,
            customerEmail: paymentDetails.customer_details.email,
            stripeProduct: paymentDetails.metadata.productId,
          }),
          mode: "cors",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
        }).catch((err) => toast.error(err.message ?? err));
        setTimeout(() => router.push("/"), 4000);
      }
    }
  }

  updateStrapiBackend();

  return (
    <div className="section">
      <div className="columns is-centered has-text-centered ">
        {paymentDetails === null ? (
          <div className="column is-5 box p-5 has-background-success-light">
            <h1 className="title is-3 m-5">Payment successful!</h1>

            <h4 className="subtitle is-4 m-5">Thank you for your payment.</h4>
          </div>
        ) : paymentDetails.payment_status === "paid" ? (
          <div className="column is-6 is-5 box p-5 has-background-success-light">
            <h1 className="title is-3 m-5">Payment successful!</h1>

            <h4 className="subtitle is-4 m-5">
              Thank you for your payment. <br />
              We received the{" "}
              <span className="has-text-weight-bold">
                {paymentDetails.amount_total / 100}
                {paymentDetails.currency}
              </span>{" "}
              for your {paymentDetails.metadata.productName}.
            </h4>
          </div>
        ) : (
          <div className="column is-5 box p-5 has-background-warning-light">
            <h1 className="title is-3 m-5">Payment Failed</h1>

            <h4 className="subtitle is-4 m-5">
              Payment failed. Please try again or
              <Link href="/contact"> contact us</Link>
            </h4>
            <div className="button my-4" onClick={() => router.back()}>
              Try again
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps({ query }) {
  const sessionId = query?.sessionId;
  const response = await axios.get(
    `${API_URL}/strapi-stripe/retrieveCheckoutSession/${sessionId}`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return {
    props: {
      paymentDetails: response.data ?? null,
    },
  };
}
