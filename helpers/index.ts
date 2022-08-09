import cookie from "cookie";
import { IncomingMessage } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

export function parseCookie(
  req: IncomingMessage & {
    cookies: NextApiRequestCookies;
  }
) {
  return cookie.parse(req ? req.headers.cookie || "" : "");
}
