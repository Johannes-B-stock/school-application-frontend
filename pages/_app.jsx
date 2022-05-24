import "../styles/globals.scss";
import "../styles/globals.css";
import "bulma-steps/dist/css/bulma-steps.min.css";
import { AuthProvider } from "@/context/AuthContext";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { PageContentProvider } from "@/context/PageContentContext";
import RouteGuard from "@/components/RouteGuard";
import CookieConsent from "react-cookie-consent";
import { ToastContainer } from "react-toastify";

config.autoAddCss = false;

export default function MyApp({ Component, pageProps }) {
  return (
    <PageContentProvider>
      <AuthProvider>
        <RouteGuard>
          <Component {...pageProps} />
        </RouteGuard>
      </AuthProvider>

      <ToastContainer />
      <CookieConsent
        location="bottom"
        buttonText="Accept"
        style={{ background: "#2B373B", opacity: 0.9 }}
        disableButtonStyles={true}
        cookieName="CookieConsent"
        buttonClasses="button is-primary"
        containerClasses="is-fixed is-bottom-0 is-right-0 p-8"
        contentClasses="ml-5"
        buttonWrapperClasses="buttons is-flex-grow-1 is-left mt-6 mt-0-tablet mr-6 mb-6"
      >
        By clicking Accept, you agree to the storing of cookies on your device
        to enhance site navigation.
      </CookieConsent>
    </PageContentProvider>
  );
}
