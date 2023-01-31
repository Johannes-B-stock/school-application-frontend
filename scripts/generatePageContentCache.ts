import { locales } from "../config/locales";
import getAndCachePageContent from "../lib/pageContent";

locales.forEach(async (locale) => {
  await getAndCachePageContent(locale);
});
