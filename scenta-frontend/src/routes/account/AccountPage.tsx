import { useTranslation } from "react-i18next";

const AccountPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="section-title">{t("account.title")}</h1>
      <div className="card">
        <p>{t("account.overview")}</p>
      </div>
    </div>
  );
};

export default AccountPage;
