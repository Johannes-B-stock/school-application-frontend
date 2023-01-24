/* eslint-disable @typescript-eslint/no-var-requires */
import { defaultLocale, Locales } from "@/config/index";
import { allCountries } from "lib/countries";
import { useMemo, useState } from "react";
import Select, { SingleValue } from "react-select";

export interface CountryEdit {
  value: string;
  label: string;
}

export default function CountrySelect({
  country,
  locale,
  countryChanged,
  required = false,
}: {
  country?: string;
  locale?: Locales;
  countryChanged: (country: string | undefined) => any;
  required?: boolean;
}) {
  const [countryEdit, setCountryEdit] = useState<CountryEdit | undefined>(
    country
      ? {
          value: country,
          label: allCountries.getName(country, locale ?? defaultLocale),
        }
      : undefined
  );
  const countryList = useMemo(
    () =>
      Object.keys(allCountries.getNames(locale ?? defaultLocale)).map(
        (key) => ({
          value: key,
          label: allCountries.getName(key, locale ?? defaultLocale),
        })
      ),
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
      className="has-text-centered"
      value={countryEdit}
      onChange={handleCountryInputChange}
      options={countryList}
      classNames={{
        control: () => (required && !country ? "border-red" : ""),
      }}
    />
  );
}
