import { locales } from "../config/locales";
import getAndCachePageContent, {
  contentFileName,
  CONTENT_CACHE_PATH,
} from "../lib/pageContent";
import { copyFileSync, rmSync } from "fs";
import { toUpper } from "lodash";
import path from "path";

locales.forEach(async (locale) => {
  await getAndCachePageContent(locale);
  const filePath = CONTENT_CACHE_PATH + toUpper(locale);
  const nextPagePath = path.join(
    __dirname,
    "..",
    ".next",
    "server",
    "pages",
    "api",
    contentFileName + toUpper(locale)
  );
  copyFileSync(filePath, nextPagePath);
  rmSync(filePath);
});
