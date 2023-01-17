import { useRouter } from "next/router";
import { defaultLocale, Locales } from "../config";

export function useLocale() {
  const { locale } = useRouter();
  const definedLocale = locale ?? defaultLocale;
  return definedLocale as Locales;
}
