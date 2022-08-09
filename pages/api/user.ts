import { parseCookie } from "@/helpers/index";
import { getMyDetails } from "lib/user";
import { NextApiRequest, NextApiResponse } from "next";

export default async function user(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    if (!req.headers.cookie) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }
    const { token } = parseCookie(req);
    try {
      const user = await getMyDetails(token);
      res.status(200).json({ user });
    } catch (error) {
      res.status(403).json({ message: "User forbidden" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
