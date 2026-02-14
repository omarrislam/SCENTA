import { useTranslation } from "react-i18next";

const OrderConfirmationPage = () => {
  const { t } = useTranslation();
  return (
    <div className="card">
      <h1 className="section-title">{t("order.confirmedTitle")}</h1>
      <p>{t("order.confirmedBody")}</p>
    </div>
  );
};

export default OrderConfirmationPage;
