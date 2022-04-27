import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { PageContentProvider } from "@/context/PageContentContext";
import RouteGuard from "@/components/RouteGuard";

config.autoAddCss = false;

export default function MyApp({ Component, pageProps }) {
  return (
    <PageContentProvider>
      <AuthProvider>
        <RouteGuard>
          <Component {...pageProps} />
        </RouteGuard>
      </AuthProvider>
    </PageContentProvider>
  );
}
