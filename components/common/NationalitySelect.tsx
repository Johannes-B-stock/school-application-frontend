/* eslint-disable @typescript-eslint/no-var-requires */
import { defaultLocale, Locales } from "@/config/index";
import { allNationalities } from "lib/countries";
import { useMemo, useState } from "react";
import Select, { SingleValue } from "react-select";

export interface NationalityEdit {
  value: string;
  label: string;
}

export default function NationalitySelect({
  nationality,
  locale,
  nationalityChanged,
  required = false,
}: {
  nationality?: string;
  locale?: Locales;
  nationalityChanged: (nationality: string | undefined) => any;
  required?: boolean;
}) {
  const [nationalityEdit, setNationalityEdit] = useState<
    NationalityEdit | undefined
  >(
    nationality
      ? {
          value: nationality,
          label: allNationalities.getName(nationality, locale ?? defaultLocale),
        }
      : undefined
  );
  const nationalityList = useMemo(
    () =>
      Object.keys(allNationalities.getNames(locale ?? defaultLocale)).map(
        (key) => ({
          value: key,
          label: allNationalities.getName(key, locale ?? defaultLocale),
        })
      ),
    [locale]
  );

  const handleNationalityInputChange = (
    nationality: SingleValue<{
      value: string;
      label: string;
    }>
  ) => {
    setNationalityEdit(nationality ?? undefined);
    nationalityChanged(nationality?.value);
  };

  return (
    <Select
      classNamePrefix="select"
      name="nationality"
      className="has-text-centered"
      value={nationalityEdit}
      onChange={handleNationalityInputChange}
      options={nationalityList}
      classNames={{
        control: () => (required && !nationality ? "border-red" : ""),
      }}
    />
  );
}
