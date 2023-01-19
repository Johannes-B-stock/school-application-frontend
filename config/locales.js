module.exports = {
  fallbackLocale: process.env.DEFAULT_LOCALE || "en",
  // When changing the locales here, be aware that you also have to change the locales in the
  // ./index.ts file for typescript support and in the strapi backend.
  locales: ["en", "de"],
};
