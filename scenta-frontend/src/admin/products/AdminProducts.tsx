import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteAdminProduct, listAdminProducts } from "../../services/adminService";

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["admin-products"], queryFn: listAdminProducts });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-products"] })
  });

  return (
    <div className="admin-grid">
      <div className="admin-header-row">
        <h1 className="section-title">Products</h1>
        <Link className="button button--primary" to="/admin/products/new">
          New Product
        </Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Flags</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((product) => (
            <tr key={product._id}>
              <td>{product.title}</td>
              <td>{product.status ?? "draft"}</td>
              <td>
                {[
                  product.flags?.isFeatured ? "featured" : null,
                  product.flags?.isBestSeller ? "bestSeller" : null,
                  product.flags?.isNew ? "new" : null
                ]
                  .filter(Boolean)
                  .join(", ")}
              </td>
              <td className="table-actions">
                <Link className="button button--ghost" to={`/admin/products/${product._id}/edit`}>
                  Edit
                </Link>
                <button
                  className="button"
                  type="button"
                  onClick={() => deleteMutation.mutate(product._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;
