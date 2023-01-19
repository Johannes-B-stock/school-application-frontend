import cookie from "cookie";
import { IncomingMessage } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { COOKIE_NAME, JWT_CRYPT_KEY, Locales } from "../config";
import { defaultCurrency } from "@/config/index";
import Cryptr from "cryptr";

const cryptr = new Cryptr(JWT_CRYPT_KEY);

export function parseCookie(
  req: IncomingMessage & {
    cookies: NextApiRequestCookies;
  }
) {
  const parsedCookie = cookie.parse(req ? req.headers.cookie || "" : "");
  const encryptedToken = parsedCookie[COOKIE_NAME];
  const token = encryptedToken ? decryptToken(encryptedToken) : undefined;
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

export function encryptToken(jwt: string) {
  return cryptr.encrypt(jwt);
}

export function decryptToken(jwt: string) {
  return cryptr.decrypt(jwt);
}
