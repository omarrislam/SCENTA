import { useTranslation } from "react-i18next";
import { availableLocales } from "../../i18n/config";

const LocaleToggle = () => {
  const { i18n } = useTranslation();

  const nextLocale = i18n.language === "ar" ? "en" : "ar";

  return (
    <button
      className="locale-toggle"
      onClick={() => i18n.changeLanguage(nextLocale)}
      type="button"
      aria-label="Switch language"
    >
      {availableLocales.join(" / ")}
    </button>
  );
};

export default LocaleToggle;
