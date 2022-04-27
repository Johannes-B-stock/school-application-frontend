import Layout from "@/components/Layout";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useContext, useState, useMemo } from "react";
import { toast } from "react-toastify";

export default function GoogleCallback() {
  const router = useRouter();
  const { googleCallback, user, error } = useContext(AuthContext);

  useEffect(() => {
    if (error) {
      toast.error(error);
      router.push("/account/login");
    }
  }, [error]);

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
    <Layout>
      <h1>Logging in with Google</h1>
    </Layout>
  );
}
