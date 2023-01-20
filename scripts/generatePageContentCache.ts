import { locales } from "../config/locales";
import getAndCachePageContent, { contentFileName } from "../lib/pageContent";
import { copyFileSync, rmSync } from "fs";
import { toUpper } from "lodash";
import path from "path";

locales.forEach(async (locale) => {
  await getAndCachePageContent(
    locale,
    path.resolve(__dirname, contentFileName)
  );
  const filePath = path.resolve(
    path.join(__dirname, contentFileName + toUpper(locale))
  );
  const nextPagePath = path.join(
    __dirname,
    "..",
    ".next",
    "static",
    contentFileName + toUpper(locale)
  );
  copyFileSync(filePath, nextPagePath);
  rmSync(filePath);
});
