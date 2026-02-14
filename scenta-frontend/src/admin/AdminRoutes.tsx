import { Route, Routes } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import AdminProducts from "./products/AdminProducts";
import AdminProductForm from "./products/AdminProductForm";
import AdminInventory from "./inventory/AdminInventory";
import AdminOrders from "./orders/AdminOrders";
import AdminOrderDetail from "./orders/AdminOrderDetail";
import AdminCustomers from "./customers/AdminCustomers";
import AdminCoupons from "./marketing/AdminCoupons";
import AdminCollections from "./marketing/AdminCollections";
import AdminTheme from "./theme/AdminTheme";
import AdminBlog from "./content/AdminBlog";
import AdminPages from "./content/AdminPages";
import AdminReports from "./reports/AdminReports";
import AdminQuiz from "./quiz/AdminQuiz";

const AdminRoutes = () => (
  <Routes>
    <Route index element={<AdminDashboard />} />
    <Route path="products" element={<AdminProducts />} />
    <Route path="products/new" element={<AdminProductForm />} />
    <Route path="products/:id/edit" element={<AdminProductForm />} />
    <Route path="inventory" element={<AdminInventory />} />
    <Route path="orders" element={<AdminOrders />} />
    <Route path="orders/:id" element={<AdminOrderDetail />} />
    <Route path="customers" element={<AdminCustomers />} />
    <Route path="coupons" element={<AdminCoupons />} />
    <Route path="collections" element={<AdminCollections />} />
    <Route path="theme" element={<AdminTheme />} />
    <Route path="blog" element={<AdminBlog />} />
    <Route path="pages" element={<AdminPages />} />
    <Route path="quiz" element={<AdminQuiz />} />
    <Route path="reports" element={<AdminReports />} />
  </Routes>
);

export default AdminRoutes;
