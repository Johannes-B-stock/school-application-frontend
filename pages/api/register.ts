import { API_URL, COOKIE_NAME } from "@/config/index";
import { parseCookie } from "lib/utils";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username, email, password } = req.body;
    const strapiRes = await fetch(`${API_URL}/api/auth/local/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    try {
      const data = await strapiRes.json();
      if (parseCookie(req).CookieConsent !== "true") {
        throw new Error("Can not set cookie because cookies are not allowed.");
      }
      if (strapiRes.ok) {
        res.setHeader(
          "Set-Cookie",
          cookie.serialize(COOKIE_NAME, data.jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 60 * 60 * 24, // 1 day
            sameSite: "strict",
            path: "/",
          })
        );
        res.status(200).json({ user: data.user });
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
