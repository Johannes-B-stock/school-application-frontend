import fs from "fs";
import path from "path";
import { API_URL } from "../config";
import qs from "qs";
import { toUpper } from "lodash";
import { PageContentData } from "api-definitions/backend";
import { SingleDataResponse } from "api-definitions/strapiBaseTypes";
import axios from "axios";

export const contentFileName = ".pageContent";

export const CONTENT_CACHE_PATH = path.resolve(
  path.join(__dirname, contentFileName)
);

export default async function getAndCachePageContent(
  locale: string
): Promise<PageContentData | undefined> {
  let cachedData: PageContentData | undefined;

  try {
    const filePath = CONTENT_CACHE_PATH + toUpper(locale);
    if (fs.existsSync(filePath)) {
      const cacheContent = fs.readFileSync(filePath, "utf8");
      cachedData = cacheContent ? JSON.parse(cacheContent) : undefined;
    }

    if (!cachedData || Object.keys(cachedData).length === 0) {
      const data = await fetchPageContentDataFromDb(locale);

      try {
        fs.writeFileSync(filePath, JSON.stringify(data), "utf8");
        console.log("Wrote to page content cache");
      } catch (error) {
        console.log("ERROR WRITING PAGE CONTENT CACHE TO FILE");
        console.log(error);
      }

      cachedData = data;
    }

    return cachedData;
  } catch (error) {
    console.log("Page content cache not initialized");
    return await fetchPageContentDataFromDb(locale);
  }
}

async function fetchPageContentDataFromDb(
  locale: string
): Promise<PageContentData | undefined> {
  const query = qs.stringify({
    populate: "*",
  });
  const res = await axios.get<SingleDataResponse<PageContentData>>(
    `${API_URL}/api/page-content?${query}`
  );
  const jsonResult = res.data;

  const localizedResult = jsonResult.data?.localizations?.find(
    (localization) => localization.locale === locale
  );
  if (res.status === 200) {
    return jsonResult.data
      ? {
          ...jsonResult.data,
          showcaseTitle:
            localizedResult?.showcaseTitle ?? jsonResult.data.showcaseTitle,
          showcaseSubtitle:
            localizedResult?.showcaseSubtitle ??
            jsonResult.data.showcaseSubtitle,
        }
      : undefined;
  } else {
    throw new Error(
      "Couldn't fetch content page data! Reason " + res.statusText
    );
  }
}
