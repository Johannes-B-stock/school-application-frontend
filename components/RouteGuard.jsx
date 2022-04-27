import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import AuthContext from "@/context/AuthContext";

export default function RouteGuard({ children }) {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const publicPaths = [
      "/account/login",
      "/",
      "/account/register",
      "/user/googleCallback",
    ];
    const path = router.asPath.split("?")[0];
    if (!user && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: "/account/login",
        query: { returnUrl: router.asPath },
      });
    } else {
      setAuthorized(true);
    }
  }, [user, router, router.asPath]);

  return authorized && children;
}
