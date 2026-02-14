import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdminCoupon,
  deleteAdminCoupon,
  listAdminCoupons,
  updateAdminCoupon
} from "../../services/backendApi";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import Select from "../../components/ui/Select";
import { Coupon } from "../../services/types";
import { useToast } from "../../components/feedback/ToastContext";

const defaultForm = { code: "", type: "percent", value: 10, status: "active" };

const AdminCoupons = () => {
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["admin-coupons"], queryFn: listAdminCoupons });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const createMutation = useMutation({
    mutationFn: (payload: Partial<Coupon>) => createAdminCoupon(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      setForm(defaultForm);
      pushToast("Coupon created", "success");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Coupon> }) =>
      updateAdminCoupon(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      setEditingId(null);
      setForm(defaultForm);
      pushToast("Coupon updated", "success");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      if (editingId) {
        setEditingId(null);
        setForm(defaultForm);
      }
      pushToast("Coupon deleted", "success");
    }
  });

  const rows = useMemo(
    () =>
      data.map((coupon) => ({
        ...coupon,
        id: coupon.id ?? coupon._id ?? ""
      })),
    [data]
  );

  const submit = () => {
    const payload = {
      code: form.code.trim().toUpperCase(),
      type: form.type as Coupon["type"],
      value: Number(form.value),
      status: form.status as Coupon["status"]
    };

    if (!payload.code) {
      pushToast("Coupon code required", "error");
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const startEdit = (coupon: Coupon & { id?: string }) => {
    setEditingId(coupon.id ?? coupon._id ?? null);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      status: coupon.status
    });
  };

  return (
    <div className="admin-grid">
      <h1 className="section-title">Coupons</h1>
      <div className="card admin-coupons-form">
        <TextInput
          placeholder="Code"
          value={form.code}
          onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))}
        />
        <Select
          value={form.type}
          onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
        >
          <option value="percent">Percent</option>
          <option value="bxgy">Buy X Get Y</option>
        </Select>
        <TextInput
          placeholder="Value"
          type="number"
          value={String(form.value)}
          onChange={(event) => setForm((prev) => ({ ...prev, value: Number(event.target.value) }))}
        />
        <Select
          value={form.status}
          onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
        >
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="expired">Expired</option>
        </Select>
        <Button type="button" className="button--primary" onClick={submit}>
          {editingId ? "Update" : "Create"}
        </Button>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Type</th>
            <th>Status</th>
            <th>Value</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((coupon) => (
            <tr key={coupon.id}>
              <td>{coupon.code}</td>
              <td>{coupon.type}</td>
              <td>{coupon.status}</td>
              <td>{coupon.value}</td>
              <td className="table-actions">
                <Button type="button" onClick={() => startEdit(coupon)}>
                  Edit
                </Button>
                <Button type="button" onClick={() => deleteMutation.mutate(coupon.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCoupons;
