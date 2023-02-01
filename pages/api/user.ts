import { parseCookie } from "lib/utils";
import { getMyDetails } from "lib/user";
import { NextApiRequest, NextApiResponse } from "next";

export default async function user(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    if (!req.headers.cookie) {
      console.log("Not authorized!");
      res.status(403).json({ message: "Not authorized" });
      return;
    }
    const { token } = parseCookie(req);
    if (!token) {
      res.status(403).json({ message: "Not logged in" });
      return;
    }
    try {
      const user = await getMyDetails(token);
      res.status(200).json({ user, token });
    } catch (error) {
      res.status(403).json({ message: "User forbidden" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
