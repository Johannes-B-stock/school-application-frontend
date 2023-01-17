/* eslint-disable @typescript-eslint/no-var-requires */
import { defaultLocale, LOCALES, Locales } from "@/config/index";
import { useMemo, useState } from "react";
import Select, { SingleValue } from "react-select";
import countries from "i18n-iso-countries";

LOCALES.forEach((locale) => {
  countries.registerLocale(require(`i18n-iso-countries/langs/${locale}.json`));
});

export const allCountries = countries;

export interface CountryEdit {
  value: string;
  label: string;
}

export default function CountrySelect({
  country,
  locale,
  countryChanged,
}: {
  country?: string;
  locale?: Locales;
  countryChanged: (country: string | undefined) => any;
}) {
  const [countryEdit, setCountryEdit] = useState<CountryEdit | undefined>(
    country
      ? {
          value: country,
          label: countries.getName(country, locale ?? defaultLocale),
        }
      : undefined
  );
  const countryList = useMemo(
    () =>
      Object.keys(countries.getNames(locale ?? defaultLocale)).map((key) => ({
        value: key,
        label: countries.getName(key, locale ?? defaultLocale),
      })),
    [locale]
  );

  const handleCountryInputChange = (
    country: SingleValue<{
      value: string;
      label: string;
    }>
  ) => {
    setCountryEdit(country ?? undefined);
    countryChanged(country?.value);
  };

  return (
    <Select
      classNamePrefix="select"
      name="country"
      value={countryEdit}
      onChange={handleCountryInputChange}
      options={countryList}
      styles={{
        control: (styles) => ({ ...styles, paddingLeft: "30px" }),
      }}
    />
  );
}
