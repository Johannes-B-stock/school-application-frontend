const axios = require("axios");
const qs = require("qs");
const path = require("path");
const fs = require("fs");
const icongen = require("icon-gen");

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
const query = qs.stringify({
  populate: "*",
});
fetchImage();

async function fetchImage() {
  const pageContentData = await axios.get(
    `${API_URL}/api/page-content?${query}`
  );
  const pageContent = pageContentData.data;
  const brandImageUrl =
    pageContent.data?.attributes.navbar_brand.data.attributes.formats.thumbnail
      .url ?? null;
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

const downloadImage = (url, image_path) =>
  axios({
    url,
    responseType: "stream",
  }).then(
    (response) =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on("finish", () => resolve())
          .on("error", (e) => reject(e));
      })
  );
