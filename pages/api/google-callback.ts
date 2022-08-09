import { API_URL } from "@/config/index";
import cookie from "cookie";
import { getMyDetails } from "lib/user";
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
        // if (parseCookie(req).CookieConsent !== "true") {
        //   throw new Error("Can not set cookie because cookies are not allowed");
        // }
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("token", data.jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            sameSite: "strict",
            path: "/",
          })
        );
        const user = await getMyDetails(data.jwt);
        res.status(200).json({ user });
      } else {
        res.status(strapiRes.status).json({ message: data.error.message });
      }
    } catch (error) {
      res.status(405).json({
        message:
          error?.message ?? error ?? "already registered with another provider",
      });
    }
  }
}
