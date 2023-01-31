import { useLocale } from "i18n/useLocale";
import { formatCurrency, formatCurrencyRange } from "lib/utils";
import getSymbolFromCurrency from "currency-symbol-map";

export default function Currency({
  value,
  currency,
}: {
  value: string;
  currency: string;
}) {
  const locale = useLocale();
  let output = value;
  const valueAsNumber = +value;
  if (Number.isNaN(valueAsNumber)) {
    if (value.includes("-")) {
      const from = +value.split("-")[0];
      const to = +value.split("-")[1];
      if (!Number.isNaN(from) && !Number.isNaN(to)) {
        output = formatCurrencyRange(locale, currency, from, to);
      }
    } else {
      output = `${value} ${getSymbolFromCurrency(currency) ?? ""}`;
    }
  } else {
    output = formatCurrency(locale, currency, valueAsNumber);
  }

  return <span>{output}</span>;
}
