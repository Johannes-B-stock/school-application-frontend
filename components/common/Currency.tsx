import { useLocale } from "i18n/useLocale";
import { formatCurrency } from "lib/utils";

export default function Currency({
  value,
  currency,
}: {
  value: number;
  currency: string;
}) {
  const locale = useLocale();
  const amount = formatCurrency(locale, currency, value);

  return <span>{amount}</span>;
}
