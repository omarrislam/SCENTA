import { NavLink, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AccountOverview from "./AccountOverview";
import OrdersPage from "./OrdersPage";
import OrderDetailPage from "./OrderDetailPage";
import WishlistPage from "./WishlistPage";

const AccountRoutes = () => {
  const { t } = useTranslation();
  return (
    <div className="account-layout">
      <aside className="card account-sidebar">
        <nav className="grid account-nav">
          <NavLink to="/account/overview">{t("account.overviewTitle")}</NavLink>
          <NavLink to="/account/orders">{t("account.orders")}</NavLink>
          <NavLink to="/account/wishlist">{t("account.wishlist")}</NavLink>
        </nav>
      </aside>
      <Routes>
        <Route index element={<AccountOverview />} />
        <Route path="overview" element={<AccountOverview />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:orderId" element={<OrderDetailPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
      </Routes>
    </div>
  );
};

export default AccountRoutes;
