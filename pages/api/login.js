import { API_URL } from "@/config/index";
import { parseCookie } from "@/helpers/index";
import cookie from "cookie";
import qs from "qs";

export default async function login(req, res) {
  if (req.method === "POST") {
    const { identifier, password } = req.body;
    const query = qs.stringify({
      populate: [
        "role",
        "schools",
        "school_applications",
        "picture",
        "address",
      ],
    });
    const strapiRes = await fetch(`${API_URL}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    try {
      const data = await strapiRes.json();

      if (parseCookie(req).CookieConsent !== "true") {
        throw new Error(
          "Can not store cookie because cookies are not accepted."
        );
      }
      if (strapiRes.ok) {
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
      res.status(strapiRes.status).json({ message: strapiRes.statusText });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
