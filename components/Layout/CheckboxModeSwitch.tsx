import { user as useri18n } from "@/i18n";
import { useLocale } from "i18n/useLocale";
import { useTheme } from "next-themes";

export default function CheckboxModeSwitch() {
  const { theme, setTheme } = useTheme();
  const locale = useLocale();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else setTheme("light");
  };

  return (
    <>
      <label htmlFor="switchRoundedDefault">{useri18n[locale].darkMode} </label>

      <input
        id="switchRoundedDefault"
        type="checkbox"
        name="switchRoundedDefault"
        className="switch is-rounded"
        checked={theme === "light" ? true : false}
        onClick={toggleTheme}
      />
      <label htmlFor="switchRoundedDefault">{useri18n[locale].lightMode}</label>
    </>
  );
}
