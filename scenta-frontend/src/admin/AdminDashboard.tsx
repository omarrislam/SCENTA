import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAdminCustomers, listAdminOrders, listAdminProducts } from "../services/adminService";

const formatCurrency = (value: number) =>
  value.toLocaleString("en-EG", { style: "currency", currency: "EGP", maximumFractionDigits: 0 });

const AdminDashboard = () => {
  const { data: orders = [] } = useQuery({ queryKey: ["admin-orders"], queryFn: listAdminOrders });
  const { data: products = [] } = useQuery({ queryKey: ["admin-products"], queryFn: listAdminProducts });
  const { data: customers = [] } = useQuery({ queryKey: ["admin-customers"], queryFn: listAdminCustomers });

  const todaySales = useMemo(() => {
    const today = new Date();
    return orders
      .filter((order) => {
        if (!order.createdAt) return false;
        const created = new Date(order.createdAt);
        return (
          created.getFullYear() === today.getFullYear() &&
          created.getMonth() === today.getMonth() &&
          created.getDate() === today.getDate()
        );
      })
      .reduce((sum, order) => sum + (order.total ?? 0), 0);
  }, [orders]);

  const lowStockSkus = useMemo(
    () =>
      products.reduce(
        (sum, product) => sum + (product.variants?.filter((variant) => (variant.stock ?? 0) <= 5).length ?? 0),
        0
      ),
    [products]
  );

  return (
    <div className="admin-grid">
      <h1 className="section-title">Admin Dashboard</h1>
      <div className="grid grid--3">
        <div className="card">
          <strong>Today</strong>
          <p>{formatCurrency(todaySales)}</p>
        </div>
        <div className="card">
          <strong>Orders</strong>
          <p>{orders.length}</p>
        </div>
        <div className="card">
          <strong>Low stock</strong>
          <p>{lowStockSkus} SKUs</p>
        </div>
      </div>
      <div className="grid grid--3">
        <div className="card">
          <strong>Customers</strong>
          <p>{customers.length}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
