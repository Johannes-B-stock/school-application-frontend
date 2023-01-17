import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useTheme } from "next-themes";

export default function AnimatedModeSwitch({ size = 30 }: { size?: number }) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else setTheme("light");
  };

  return (
    <DarkModeSwitch
      style={{ marginBottom: "1rem" }}
      checked={theme === "light" ? false : true}
      onChange={toggleTheme}
      size={size}
      sunColor="#baa25d"
      moonColor="#a28942"
    />
  );
}
