import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import {
  createAdminCollection,
  deleteAdminCollection,
  listAdminCollections,
  listAdminProducts,
  updateAdminCollection
} from "../../services/adminService";
import { uploadImage } from "../../services/backendApi";
import { useToast } from "../../components/feedback/ToastContext";

const AdminCollections = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const { data = [] } = useQuery({
    queryKey: ["admin-collections"],
    queryFn: listAdminCollections
  });
  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: listAdminProducts
  });
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [productIds, setProductIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      createAdminCollection({ title, slug, description, image, productIds }),
    onSuccess: () => {
      setTitle("");
      setSlug("");
      setDescription("");
      setImage("");
      setProductIds([]);
      queryClient.invalidateQueries({ queryKey: ["admin-collections"] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      editingId
        ? updateAdminCollection(editingId, { title, slug, description, image, productIds })
        : Promise.resolve(null),
    onSuccess: () => {
      setEditingId(null);
      setTitle("");
      setSlug("");
      setDescription("");
      setImage("");
      setProductIds([]);
      queryClient.invalidateQueries({ queryKey: ["admin-collections"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-collections"] });
    }
  });

  const handleImageUpload = async (file: File) => {
    try {
      const url = await uploadImage(file);
      setImage(url);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      pushToast(message, "error");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setImage("");
    setProductIds([]);
  };

  const availableProducts = useMemo(
    () =>
      products.map((product) => ({
        id: product._id,
        title: product.title
      })),
    [products]
  );

  return (
    <div className="admin-grid">
      <h1 className="section-title">Collections</h1>
      <div className="card grid">
        <h2 className="section-title">{editingId ? "Edit Collection" : "New Collection"}</h2>
        <TextInput placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
        <TextInput placeholder="Slug" value={slug} onChange={(event) => setSlug(event.target.value)} />
        <TextInput
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <input
          className="input"
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleImageUpload(file);
          }}
        />
        <TextInput value={image} readOnly placeholder="Image preview URL" />
        <div className="grid">
          <strong>Assign products</strong>
          <div className="grid">
            {availableProducts.map((product) => (
              <label key={product.id}>
                <input
                  type="checkbox"
                  checked={productIds.includes(product.id)}
                  onChange={(event) => {
                    setProductIds((prev) =>
                      event.target.checked ? [...prev, product.id] : prev.filter((id) => id !== product.id)
                    );
                  }}
                />{" "}
                {product.title}
              </label>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Button
            className="button--primary"
            type="button"
            onClick={() => (editingId ? updateMutation.mutate() : mutation.mutate())}
          >
            Save
          </Button>
          {editingId && (
            <Button type="button" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Slug</th>
            <th>Products</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((collection) => (
            <tr key={collection.id}>
              <td>{collection.title}</td>
              <td>{collection.slug}</td>
              <td>{collection.productIds?.length ?? 0}</td>
              <td>
                <div className="table-actions">
                  <Button
                    type="button"
                    onClick={() => {
                      setEditingId(collection.id);
                      setTitle(collection.title);
                      setSlug(collection.slug);
                      setDescription(collection.description ?? "");
                      setImage(collection.image ?? "");
                      setProductIds(collection.productIds ?? []);
                    }}
                  >
                    Edit
                  </Button>
                  <Button type="button" onClick={() => deleteMutation.mutate(collection.id)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCollections;
