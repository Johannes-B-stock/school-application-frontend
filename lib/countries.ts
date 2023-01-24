import countries from "i18n-iso-countries";
import { LOCALES } from "../config";

LOCALES.forEach((locale) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  countries.registerLocale(require(`i18n-iso-countries/langs/${locale}.json`));
});

export const allCountries = countries;
