import "../styles/globals.scss";
import "../styles/globals.css";
import "bulma-steps/dist/css/bulma-steps.min.css";
import { AuthProvider } from "@/context/AuthContext";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { PageContentProvider } from "@/context/PageContentContext";
import RouteGuard from "@/components/auth/RouteGuard";
import CookieConsent from "react-cookie-consent";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import "../styles/NProgress.scss";
import { ReactElement, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import { ThemeProvider } from "next-themes";
import { AppProps } from "next/app";
import { Page } from "types/page";
import { cookieBanner } from "@/i18n";
import { useLocale } from "i18n/useLocale";

config.autoAddCss = false;

// this should give a better typing
export type Props = AppProps & {
  Component: Page;
};

export default function MyApp({ Component, pageProps }: Props) {
  const router = useRouter();
  const locale = useLocale();

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

  const defaultLayout = (page: ReactElement) => {
    return <Layout>{page}</Layout>;
  };

  const getLayout = Component.getLayout || defaultLayout;

  return (
    <PageContentProvider locale={locale}>
      <AuthProvider>
        <ThemeProvider>
          <RouteGuard>{getLayout(<Component {...pageProps} />)}</RouteGuard>
        </ThemeProvider>
      </AuthProvider>

      <ToastContainer />
      <CookieConsent
        location="bottom"
        buttonText={cookieBanner[locale].accept}
        style={{
          background: "#2B373B",
          opacity: 0.87,
          width: "auto",
          right: "0px",
          minHeight: "100px",
        }}
        disableButtonStyles={true}
        cookieName="CookieConsent"
        buttonClasses="button is-secondary mx-4 mb-4"
        containerClasses="columns is-vcentered mt-6-tablet"
        contentClasses="column is-8"
        buttonWrapperClasses="column is-2 is-offset-5-mobile"
      >
        {cookieBanner[locale].text}
      </CookieConsent>
    </PageContentProvider>
  );
}
