import { useQuery } from "@tanstack/react-query";
import { listAdminCustomers } from "../../services/adminService";

const AdminCustomers = () => {
  const { data = [] } = useQuery({ queryKey: ["admin-customers"], queryFn: listAdminCustomers });

  return (
    <div className="admin-grid">
      <h1 className="section-title">Customers</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Orders</th>
          </tr>
        </thead>
        <tbody>
          {data.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.orders ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCustomers;
