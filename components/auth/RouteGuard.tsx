import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import AuthContext from "@/context/AuthContext";

export default function RouteGuard({ children }: { children: any }) {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const publicPaths = [
      "/account/login",
      "/account/notConfirmed",
      "/account/confirmed",
      "/account/forgotPassword",
      "/account/resetPassword",
      "/",
      "/account/register",
      "/account/googleCallback",
      "/account/facebookCallback",
      "/about",
      "/contact",
      "/references/",
      "/impressum",
      "/privacy",
      "/schools/:id",
      "/staff-application/details",
      "/404",
    ];
    const path = router.asPath.split("?")[0];
    if (
      !user &&
      !publicPaths.some(
        (publicPath) =>
          publicPath.toLowerCase() === path.toLowerCase() ||
          (publicPath.length > 1 &&
            publicPath.endsWith("/") &&
            path.includes(publicPath)) ||
          hasIdInIt(publicPath, path)
      )
    ) {
      setAuthorized(false);
      router.push({
        pathname: "/account/login",
        query: { returnUrl: router.asPath },
      });
    } else {
      setAuthorized(true);
    }
  }, [user, router, router.asPath]);

  return authorized && children ? children : <></>;
}

function hasIdInIt(publicPath: string, path: string): boolean {
  const splitPublicPath = publicPath.split("/");
  const idIndex = splitPublicPath.indexOf(":id");
  const splitPath = path.split("/");

  if (idIndex === -1) return false;

  const pathId = parseInt(splitPath[idIndex]);

  if (isNaN(pathId)) {
    return false;
  }

  const pathWithoutId = [
    ...splitPath.slice(0, idIndex),
    ...splitPath.slice(idIndex + 1),
  ].join("/");

  const publicPathWithoutId = [
    ...splitPublicPath.slice(0, idIndex),
    ...splitPublicPath.slice(idIndex + 1),
  ].join("/");

  return pathWithoutId === publicPathWithoutId;
}
