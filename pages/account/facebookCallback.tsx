import GoogleSpinner from "@/components/common/GoogleSpinner";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useContext, useMemo } from "react";
import { toast } from "react-toastify";

export default function FacebookCallback() {
  const router = useRouter();
  const { facebookCallback, user, error } = useContext(AuthContext);

  useEffect(() => {
    if (error) {
      toast.error(error);
      router.push("/account/login");
    }
  }, [error, router]);

  useMemo(() => {
    if (router.query.access_token) {
      facebookCallback({
        access_token: router.query.access_token,
      });
    }
  }, [router.query, facebookCallback]);

  if (user) {
    const returnUrl = router.query?.returnUrl ?? "/";
    if (typeof returnUrl !== "string") return;
    router.push(returnUrl);
  }
  return (
    <section className="section is-large">
      <div className="container has-text-centered">
        <h2 className="title has-text-centered">Logging in with Facebook...</h2>
        <br />
        <GoogleSpinner />
      </div>
    </section>
  );
}

FacebookCallback.getLayout = function getLayout(page: any) {
  return page;
};
