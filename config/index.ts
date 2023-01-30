import { fallbackLocale } from "./locales";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export const NEXT_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

export const COOKIE_NAME = process.env.COOKIE_NAME || "Y-Apply";

export const JWT_CRYPT_KEY =
  process.env.JWT_CRYPT_KEY || "a87sdzq38greazs87coaosyasd";

export const defaultLocale = fallbackLocale;

export const defaultCurrency = process.env.DEFAULT_CURRENCY || "USD";

export const supportedCurrencies = ["USD", "GBP", "EUR"];

export const LOCALES = ["en", "de"] as const;

type LocalesTuple = typeof LOCALES;
export type Locales = LocalesTuple[number];

export const defaultAvatarPath = "/images/defaultAvatar.png";
