import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
const StorefrontLayout = lazy(() => import("../components/layout/StorefrontLayout"));
const AdminLayout = lazy(() => import("../admin/layout/AdminLayout"));
const HomePage = lazy(() => import("../routes/home/HomePage"));
const ShopPage = lazy(() => import("../routes/shop/ShopPage"));
const ProductPage = lazy(() => import("../routes/product/ProductPage"));
const CartPage = lazy(() => import("../routes/cart/CartPage"));
const CheckoutPage = lazy(() => import("../routes/checkout/CheckoutPage"));
const AccountRoutes = lazy(() => import("../routes/account/AccountRoutes"));
const AuthPage = lazy(() => import("../routes/auth/AuthPage"));
const BlogPage = lazy(() => import("../routes/blog/BlogPage"));
const StaticPage = lazy(() => import("../routes/pages/StaticPage"));
const QuizPage = lazy(() => import("../routes/quiz/QuizPage"));
const OrderConfirmationPage = lazy(() => import("../routes/order-confirmation/OrderConfirmationPage"));
const AdminRoutes = lazy(() => import("../admin/AdminRoutes"));
const RequireAuth = lazy(() => import("./auth/RequireAuth"));
const RequireAdmin = lazy(() => import("./auth/RequireAdmin"));

const RouteFallback = () => <div className="page-shell">Loading...</div>;

const StorefrontShell = () => (
  <Suspense fallback={<RouteFallback />}>
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
  </Suspense>
);

const AdminShell = () => (
  <Suspense fallback={<RouteFallback />}>
    <RequireAdmin>
      <AdminLayout>
        <AdminRoutes />
      </AdminLayout>
    </RequireAdmin>
  </Suspense>
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
