import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getMyOrder } from "../../services/orderService";

const OrderDetailPage = () => {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const { data } = useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => getMyOrder(orderId ?? ""),
    enabled: Boolean(orderId)
  });

  if (!data) {
    return <div className="card">{t("account.orderMissing")}</div>;
  }

  return (
    <div className="card">
      <h2 className="section-title">
        {t("account.orderLabel", { number: data.orderNumber })}
      </h2>
      <p>{t("account.status")}: {data.status}</p>
      <p>{t("account.total")}: EGP {data.total}</p>
    </div>
  );
};

export default OrderDetailPage;
