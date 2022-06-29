import fs from "fs";
import path from "path";
import { API_URL } from "../config";
import qs from "qs";

async function fetchPageContentData(locale) {
  const query = qs.stringify({
    populate: "*",
    locale: locale,
  });
  const res = await fetch(`${API_URL}/api/page-content?${query}`);
  const jsonResult = await res.json();
  if (res.ok) {
    return {
      ...jsonResult.data?.attributes,
      brandImage:
        jsonResult.data?.attributes.navbar_brand.data.attributes.formats
          .thumbnail.url ?? null,
      showcase:
        jsonResult.data?.attributes.showcase.data.attributes.formats.large
          .url ?? null,
    };
  } else {
    throw new Error(
      "Couldn't fetch content page data! Reason " + res.statusText
    );
  }
}

const CONTENT_CACHE_PATH = path.resolve(path.join(__dirname, ".pageContent"));

export default async function getPageContent(locale) {
  let cachedData;

  try {
    cachedData = JSON.parse(fs.readFileSync(CONTENT_CACHE_PATH, "utf8"));
  } catch (error) {
    console.log("Page content cache not initialized");
  }

  if (!cachedData || Object.keys(cachedData).length === 0) {
    const data = await fetchPageContentData(locale);

    try {
      fs.writeFileSync(CONTENT_CACHE_PATH, JSON.stringify(data), "utf8");
      console.log("Wrote to page content cache");
    } catch (error) {
      console.log("ERROR WRITING PAGE CONTENT CACHE TO FILE");
      console.log(error);
    }

    cachedData = data;
  }

  return cachedData;
}
