import { API_URL, COOKIE_NAME } from "@/config/index";
import cookie from "cookie";
import { getMyDetails } from "lib/user";
import { encryptToken, parseCookie } from "lib/utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function googleCallback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const body = JSON.parse(req.body);
      const strapiRes = await fetch(
        `${API_URL}/api/auth/google/callback?access_token=${body.access_token}`
      );

      const data = await strapiRes.json();

      if (strapiRes.ok) {
        if (parseCookie(req).CookieConsent !== "true") {
          throw new Error("Can not set cookie because cookies are not allowed");
        }
        const encryptedToken = encryptToken(data.jwt);
        res.setHeader(
          "Set-Cookie",
          cookie.serialize(COOKIE_NAME, encryptedToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 60 * 60 * 24, // 1 day
            sameSite: "strict",
            path: "/",
          })
        );
        const user = await getMyDetails(data.jwt);
        res.status(200).json({ user });
      } else {
        res.status(strapiRes.status).json({ message: data.error.message });
      }
    } catch (error: any) {
      res.status(405).json({
        message:
          error?.message ?? error ?? "already registered with another provider",
      });
    }
  }
}
