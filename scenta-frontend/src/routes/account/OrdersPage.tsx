import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { listMyOrders } from "../../services/orderService";
import Spinner from "../../components/feedback/Spinner";

const OrdersPage = () => {
  const { t } = useTranslation();
  const { data = [], isLoading } = useQuery({ queryKey: ["orders"], queryFn: listMyOrders });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="card">
      <h2 className="section-title">{t("account.orders")}</h2>
      <div className="grid">
        {data.map((order) => (
          <Link key={order.id} to={`/account/orders/${order.id}`}>
            {order.orderNumber} · {order.status} · EGP {order.total}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
