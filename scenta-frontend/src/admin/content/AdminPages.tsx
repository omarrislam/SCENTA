import { useQuery } from "@tanstack/react-query";
import { listAdminPages } from "../../services/adminService";

const AdminPages = () => {
  const { data = [] } = useQuery({ queryKey: ["admin-pages"], queryFn: listAdminPages });

  return (
    <div className="admin-grid">
      <h1 className="section-title">Pages</h1>
      <div className="card">
        <p style={{ color: "var(--color-muted)" }}>
          Pages are static content routes in your storefront (for example: privacy policy, shipping, returns, FAQ).
        </p>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Slug</th>
          </tr>
        </thead>
        <tbody>
          {data.map((page) => (
            <tr key={page.id}>
              <td>{page.title}</td>
              <td>{page.slug}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPages;
