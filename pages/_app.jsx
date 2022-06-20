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
import { useRouter } from "next/router";
import NProgress from "nprogress";
import "../styles/NProgress.scss";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { ThemeProvider } from "next-themes";

config.autoAddCss = false;

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  NProgress.configure({ showSpinner: false });

  useEffect(() => {
    const handleStart = () => {
      NProgress.start();
    };
    const handleStop = () => {
      NProgress.done();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  const defaultLayout = (page) => {
    return <Layout>{page}</Layout>;
  };

  const getLayout = Component.getLayout || defaultLayout;

  return (
    <PageContentProvider>
      <AuthProvider>
        <ThemeProvider>
          <RouteGuard>{getLayout(<Component {...pageProps} />)}</RouteGuard>
        </ThemeProvider>
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
