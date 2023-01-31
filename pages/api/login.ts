import { API_URL, COOKIE_NAME } from "@/config/index";
import { encryptToken, parseCookie } from "lib/utils";
import cookie from "cookie";
import { getMyDetails } from "lib/user";
import { NextApiRequest, NextApiResponse } from "next";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { identifier, password } = req.body;
    const strapiRes = await fetch(`${API_URL}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    try {
      const data = await strapiRes.json();

      if (strapiRes.ok) {
        if (parseCookie(req).CookieConsent !== "true") {
          throw new Error(
            "Can not store cookie because cookies are not accepted."
          );
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
        res.status(200).json({ user, token: data.jwt });
      } else {
        res.status(strapiRes.status).json({ message: data.error.message });
      }
    } catch (error) {
      res.status(strapiRes.status).json({ message: strapiRes.statusText });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
