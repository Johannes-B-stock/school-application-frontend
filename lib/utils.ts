import cookie from "cookie";
import { IncomingMessage } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { COOKIE_NAME, Locales } from "../config";
import { defaultCurrency } from "@/config/index";

export function parseCookie(
  req: IncomingMessage & {
    cookies: NextApiRequestCookies;
  }
) {
  const parsedCookie = cookie.parse(req ? req.headers.cookie || "" : "");
  const token = parsedCookie[COOKIE_NAME];
  const cookieConsent = parsedCookie.CookieConsent;
  const savedLocale = parsedCookie.NEXT_LOCALE;
  return { token, CookieConsent: cookieConsent, NEXT_LOCALE: savedLocale };
}

export function formatCurrency(
  locale: Locales,
  currency: string,
  value: number
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency ?? defaultCurrency,
  }).format(value);
}
