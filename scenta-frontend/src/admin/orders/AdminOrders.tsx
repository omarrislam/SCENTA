import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listAdminOrders } from "../../services/adminService";

const AdminOrders = () => {
  const { data = [] } = useQuery({ queryKey: ["admin-orders"], queryFn: listAdminOrders });

  return (
    <div className="admin-grid">
      <h1 className="section-title">Orders</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Status</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((order) => (
            <tr key={order.id}>
              <td>{order.orderNumber}</td>
              <td>{order.status}</td>
              <td>EGP {order.total}</td>
              <td>
                <Link to={`/admin/orders/${order.id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
