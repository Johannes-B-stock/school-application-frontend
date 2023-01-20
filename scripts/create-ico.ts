import axios from "axios";
import qs from "qs";
import path from "path";
import fs from "fs";
import icongen from "icon-gen";
import { SingleDataResponse } from "api-definitions/strapiBaseTypes";
import { PageContentData } from "api-definitions/backend";
import { API_URL } from "../config";

const query = qs.stringify({
  populate: "*",
});
fetchImage();

async function fetchImage() {
  const pageContentData = await axios.get<SingleDataResponse<PageContentData>>(
    `${API_URL}/api/page-content?${query}`
  );
  const pageContent = pageContentData.data;
  const brandImageUrl =
    pageContent.data?.navbar_brand.formats.thumbnail.url ?? null;
  let brandImagePath = "";
  if (brandImageUrl === null) {
    brandImagePath = path.join("..", "public", "images", "school-default.png");
  } else {
    brandImagePath = "brandImage.png";
    await downloadImage(brandImageUrl, brandImagePath);
  }
  icongen(brandImagePath, path.join(__dirname, "..", "public"), {
    favicon: { icoSizes: [16, 32, 48, 64, 128, 256], pngSizes: [] },
    report: true,
  });
}

const downloadImage = (url: string, image_path: fs.PathLike) =>
  axios({
    url,
    responseType: "stream",
  }).then(
    (response) =>
      new Promise<void>((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on("finish", () => resolve())
          .on("error", (e: any) => reject(e));
      })
  );
