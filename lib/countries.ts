/* eslint-disable @typescript-eslint/no-var-requires */
import countries from "i18n-iso-countries";
import nationalities from "i18n-nationality";
import { LOCALES } from "../config";

LOCALES.forEach((locale) => {
  countries.registerLocale(require(`i18n-iso-countries/langs/${locale}.json`));
  nationalities.registerLocale(
    require(`i18n-nationality/langs/${locale}.json`)
  );
});

export const allCountries = countries;
export const allNationalities = nationalities;
