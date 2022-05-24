import GoogleSpinner from "@/components/GoogleSpinner";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useContext, useMemo } from "react";
import { toast } from "react-toastify";

export default function GoogleCallback() {
  const router = useRouter();
  const { googleCallback, user, error } = useContext(AuthContext);

  useEffect(() => {
    if (error) {
      toast.error(error);
      router.push("/account/login");
    }
  }, [error, router]);

  useMemo(() => {
    if (router.query.access_token) {
      googleCallback({
        access_token: router.query.access_token,
      });
    }
  }, [router.query, googleCallback]);

  if (user) {
    router.push(router.query?.returnUrl ?? "/");
  }
  return (
    <section className="section is-large">
      <div className="container has-text-centered">
        <h2 className="title has-text-centered">Logging in with Google...</h2>
        <br />
        <GoogleSpinner />
      </div>
    </section>
  );
}
