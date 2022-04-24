import { API_URL } from "@/config/index";
import cookie from "cookie";

export default async function register(req, res) {
  if (req.method === "POST") {
    const { username, email, password } = req.body;
    const strapiRes = await fetch(`${API_URL}/api/auth/local/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    try {
      const data = await strapiRes.json();

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
        res.status(200).json({ user: data.user });
      } else {
        res.status(strapiRes.status).json({ message: data.error.message });
      }
    } catch (error) {
      console.log(error);
      res.status(strapiRes.status).json({ message: strapiRes.statusText });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
