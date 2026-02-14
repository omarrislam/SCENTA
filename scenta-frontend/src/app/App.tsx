import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StorefrontLayout from "../components/layout/StorefrontLayout";
import AdminLayout from "../admin/layout/AdminLayout";
import HomePage from "../routes/home/HomePage";
import ShopPage from "../routes/shop/ShopPage";
import ProductPage from "../routes/product/ProductPage";
import CartPage from "../routes/cart/CartPage";
import CheckoutPage from "../routes/checkout/CheckoutPage";
import AccountRoutes from "../routes/account/AccountRoutes";
import AuthPage from "../routes/auth/AuthPage";
import BlogPage from "../routes/blog/BlogPage";
import StaticPage from "../routes/pages/StaticPage";
import QuizPage from "../routes/quiz/QuizPage";
import OrderConfirmationPage from "../routes/order-confirmation/OrderConfirmationPage";
import AdminRoutes from "../admin/AdminRoutes";
import RequireAuth from "./auth/RequireAuth";
import RequireAdmin from "./auth/RequireAdmin";

const StorefrontShell = () => (
  <StorefrontLayout>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/collections/:slug" element={<ShopPage />} />
      <Route path="/product/:slug" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route
        path="/checkout"
        element={
          <RequireAuth>
            <CheckoutPage />
          </RequireAuth>
        }
      />
      <Route
        path="/account/*"
        element={
          <RequireAuth>
            <AccountRoutes />
          </RequireAuth>
        }
      />
      <Route path="/auth/:type" element={<AuthPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPage />} />
      <Route path="/pages/:slug" element={<StaticPage />} />
      <Route path="/about" element={<Navigate to="/pages/about" replace />} />
      <Route path="/returns" element={<Navigate to="/pages/returns" replace />} />
      <Route path="/shipping" element={<Navigate to="/pages/shipping" replace />} />
      <Route path="/privacy" element={<Navigate to="/pages/privacy" replace />} />
      <Route path="/terms" element={<Navigate to="/pages/terms" replace />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </StorefrontLayout>
);

const AdminShell = () => (
  <RequireAdmin>
    <AdminLayout>
      <AdminRoutes />
    </AdminLayout>
  </RequireAdmin>
);

const App = () => {
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  useEffect(() => {
    if (import.meta.env.MODE === "test") {
      return;
    }
    if (typeof window.scrollTo !== "function") {
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/admin/*" element={<AdminShell />} />
      <Route path="/*" element={<StorefrontShell />} />
    </Routes>
  );
};

export default App;
