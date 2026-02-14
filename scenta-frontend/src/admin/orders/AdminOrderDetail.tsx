import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import { getAdminOrder, updateAdminOrderStatus } from "../../services/adminService";
import { useToast } from "../../components/feedback/ToastContext";

const AdminOrderDetail = () => {
  const { id } = useParams();
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-order", id],
    queryFn: () => getAdminOrder(id ?? ""),
    enabled: Boolean(id)
  });
  const [status, setStatus] = useState("pending");
  const [statusUpdated, setStatusUpdated] = useState(false);
  const mutation = useMutation({
    mutationFn: (nextStatus: string) => updateAdminOrderStatus(id ?? "", nextStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-order", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      setStatusUpdated(true);
      pushToast("Order status updated", "success");
    }
  });

  useEffect(() => {
    if (data?.status) {
      setStatus(data.status);
    }
  }, [data?.status]);

  useEffect(() => {
    setStatusUpdated(false);
  }, [status]);

  if (!data) {
    return <div className="card">Order not found.</div>;
  }

  return (
    <div className="card grid">
      <h1 className="section-title">Order {data.orderNumber}</h1>
      <div>
        <strong>Status</strong>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", marginTop: "8px" }}>
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="pending">Pending</option>
            <option value="placed">Placed</option>
            <option value="paid">Paid</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
          <Button
            type="button"
            className="button--primary"
            onClick={() => mutation.mutate(status)}
            disabled={mutation.isPending || status === data.status}
          >
            {mutation.isPending ? "Updating..." : "Update"}
          </Button>
          {statusUpdated ? <span className="badge">Updated</span> : null}
        </div>
      </div>
      <p>Total: EGP {data.totals?.grandTotal ?? 0}</p>
      {data.shippingAddress ? (
        <div>
          <strong>Shipping</strong>
          <p>{data.shippingAddress.fullName}</p>
          <p>{data.shippingAddress.phone}</p>
          <p>
            {data.shippingAddress.street}, {data.shippingAddress.area}, {data.shippingAddress.city}
          </p>
        </div>
      ) : null}
      {data.items?.length ? (
        <div>
          <strong>Items</strong>
          <ul>
            {data.items.map((item, index) => (
              <li key={`${item.productSlugSnapshot ?? "item"}-${index}`}>
                {item.productTitleSnapshot} - {item.qty} x EGP {item.unitPrice}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default AdminOrderDetail;
