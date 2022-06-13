import { API_URL } from "@/config/index";
import cookie from "cookie";
import qs from "qs";

export default async function googleCallback(req, res) {
  if (req.method === "POST") {
    try {
      const body = JSON.parse(req.body);
      console.log(req);
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
        const query = qs.stringify({
          populate: [
            "role",
            "schools",
            "school_applications",
            "picture",
            "address",
          ],
        });
        const strapiRes = await fetch(`${API_URL}/api/users/me?${query}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.jwt}`,
          },
        });

        const user = await strapiRes.json();
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
