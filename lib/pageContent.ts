import fs from "fs";
import path from "path";
import { API_URL } from "../config";
import qs from "qs";
import { toUpper } from "lodash";
import { PageContentData } from "api-definitions/backend";
import { SingleDataResponse } from "api-definitions/strapiBaseTypes";

const CONTENT_CACHE_PATH = path.resolve(path.join(__dirname, ".pageContent"));

export default async function getPageContent(
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
        fs.writeFileSync(
          CONTENT_CACHE_PATH + toUpper(locale),
          JSON.stringify(data),
          "utf8"
        );
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
    locale: locale,
  });
  const res = await fetch(`${API_URL}/api/page-content?${query}`);
  const jsonResult = (await res.json()) as SingleDataResponse<PageContentData>;
  if (res.ok) {
    return jsonResult.data;
  } else {
    throw new Error(
      "Couldn't fetch content page data! Reason " + res.statusText
    );
  }
}
