import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adjustInventory, listAdminProducts } from "../../services/adminService";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import { useToast } from "../../components/feedback/ToastContext";

const AdminInventory = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const { data = [] } = useQuery({ queryKey: ["admin-products"], queryFn: listAdminProducts });
  const [draft, setDraft] = useState<Record<string, number>>({});

  useEffect(() => {
    const next: Record<string, number> = {};
    data.forEach((product) => {
      product.variants?.forEach((variant) => {
        const key = `${product._id}:${variant.key}`;
        next[key] = variant.stock ?? 0;
      });
    });
    setDraft((prev) => {
      const prevKeys = Object.keys(prev);
      const nextKeys = Object.keys(next);
      if (prevKeys.length !== nextKeys.length) {
        return next;
      }
      for (const key of nextKeys) {
        if (prev[key] !== next[key]) {
          return next;
        }
      }
      return prev;
    });
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: { productId: string; variantKey: string; stock: number }) =>
      adjustInventory(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      pushToast(`Updated stock to ${payload.stock}`, "success");
      const stamp = String(Date.now());
      localStorage.setItem("scenta-inventory-updated", stamp);
      window.dispatchEvent(new CustomEvent("inventory-updated", { detail: stamp }));
    }
  });

  const rows = useMemo(
    () =>
      data.flatMap((product) =>
        (product.variants ?? []).map((variant) => ({
          productId: product._id,
          title: product.title,
          variantKey: variant.key,
          sizeMl: variant.sizeMl ?? 0,
          stock: variant.stock ?? 0
        }))
      ),
    [data]
  );

  return (
    <div className="admin-grid">
      <h1 className="section-title">Inventory</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Variant</th>
            <th>Stock</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const key = `${row.productId}:${row.variantKey}`;
            return (
              <tr key={key}>
                <td>{row.title}</td>
                <td>{row.sizeMl ? `${row.sizeMl}ml` : row.variantKey}</td>
                <td style={{ maxWidth: "120px" }}>
                  <TextInput
                    type="number"
                    value={draft[key] ?? row.stock}
                    onChange={(event) =>
                      setDraft((prev) => ({ ...prev, [key]: Number(event.target.value) }))
                    }
                  />
                </td>
                <td>
                  <Button
                    type="button"
                    onClick={() =>
                      mutation.mutate({
                        productId: row.productId,
                        variantKey: row.variantKey,
                        stock: draft[key] ?? row.stock
                      })
                    }
                  >
                    Update
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminInventory;
