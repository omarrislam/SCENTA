import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import {
  AdminProduct,
  createAdminProduct,
  getAdminProduct,
  updateAdminProduct
} from "../../services/adminService";
import { uploadImage } from "../../services/backendApi";
import { useToast } from "../../components/feedback/ToastContext";

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const isEditing = Boolean(id && id !== "new");
  const { data } = useQuery({
    queryKey: ["admin-product", id],
    queryFn: () => getAdminProduct(id ?? ""),
    enabled: isEditing
  });

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [stock, setStock] = useState("0");
  const [sizeMl, setSizeMl] = useState("50");
  const [images, setImages] = useState<string[]>([""]);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("draft");
  const [flags, setFlags] = useState({ isFeatured: false, isBestSeller: false, isNew: false });
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!data) return;
    setTitle(data.title ?? "");
    setSlug(data.slug ?? "");
    setDescription(data.description ?? "");
    const variant = data.variants?.[0];
    setPrice(String(variant?.price ?? 0));
    setStock(String(variant?.stock ?? 0));
    setSizeMl(String(variant?.sizeMl ?? 50));
    const incomingImages = data.images?.map((image) => image.url).filter(Boolean) ?? [];
    setImages(incomingImages.length ? incomingImages : [""]);
    setStatus(data.status ?? "draft");
    setFlags({
      isFeatured: Boolean(data.flags?.isFeatured),
      isBestSeller: Boolean(data.flags?.isBestSeller),
      isNew: Boolean(data.flags?.isNew)
    });
    const noteList = data.notes?.top ?? [];
    setNotes(noteList.join(", "));
  }, [data]);

  const variantKey = useMemo(() => {
    const base = slug || "variant";
    return `${base}-${sizeMl}`;
  }, [slug, sizeMl]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<AdminProduct>) =>
      isEditing && id ? updateAdminProduct(id, payload) : createAdminProduct(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      navigate("/admin/products");
    }
  });

  const handleSubmit = () => {
    const cleanedImages = images.map((url) => url.trim()).filter(Boolean);
    const payload: Partial<AdminProduct> = {
      title,
      slug,
      description,
      status,
      flags,
      notes: { top: notes.split(",").map((note) => note.trim()).filter(Boolean) },
      variants: [
        {
          key: variantKey,
          sizeMl: Number(sizeMl),
          price: Number(price),
          stock: Number(stock)
        }
      ],
      images: cleanedImages.map((url) => ({ url }))
    };
    mutation.mutate(payload);
  };

  const handleImageChange = (index: number, value: string) => {
    setImages((prev) => prev.map((entry, idx) => (idx === index ? value : entry)));
  };

  const handleUploadImage = async (index: number, file?: File | null) => {
    if (!file) return;
    try {
      setUploadingIndex(index);
      const imageUrl = await uploadImage(file);
      handleImageChange(index, imageUrl);
      pushToast("Image uploaded", "success");
    } catch {
      pushToast("Image upload failed", "error");
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleAddImage = () => {
    setImages((prev) => [...prev, ""]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="card grid">
      <h1 className="section-title">{isEditing ? "Edit Product" : "New Product"}</h1>
      <TextInput placeholder="Product name" value={title} onChange={(event) => setTitle(event.target.value)} />
      <TextInput placeholder="Slug" value={slug} onChange={(event) => setSlug(event.target.value)} />
      <textarea
        className="input"
        placeholder="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <label className="input-label">
          Size (ml)
          <TextInput value={sizeMl} onChange={(event) => setSizeMl(event.target.value)} />
        </label>
        <label className="input-label">
          Price
          <TextInput value={price} onChange={(event) => setPrice(event.target.value)} />
        </label>
        <label className="input-label">
          Stock
          <TextInput value={stock} onChange={(event) => setStock(event.target.value)} />
        </label>
      </div>
      <div className="grid" style={{ gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <span>Images</span>
          <Button type="button" onClick={handleAddImage}>
            Add image
          </Button>
        </div>
        {images.map((image, index) => (
          <div key={`image-${index}`} className="card" style={{ display: "grid", gap: "10px" }}>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => void handleUploadImage(index, event.target.files?.[0])}
            />
            <TextInput
              placeholder={`Image URL ${index + 1}`}
              value={image}
              onChange={(event) => handleImageChange(index, event.target.value)}
            />
            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <small style={{ color: "var(--color-muted)" }}>
                {uploadingIndex === index ? "Uploading image..." : "Upload an image or paste a URL."}
              </small>
              {images.length > 1 ? (
                <Button type="button" onClick={() => handleRemoveImage(index)}>
                  Remove
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <TextInput placeholder="Notes (comma separated)" value={notes} onChange={(event) => setNotes(event.target.value)} />
      <Select value={status} onChange={(event) => setStatus(event.target.value)}>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </Select>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <label>
          <input
            type="checkbox"
            checked={flags.isFeatured}
            onChange={(event) => setFlags((prev) => ({ ...prev, isFeatured: event.target.checked }))}
          />
          Featured
        </label>
        <label>
          <input
            type="checkbox"
            checked={flags.isBestSeller}
            onChange={(event) => setFlags((prev) => ({ ...prev, isBestSeller: event.target.checked }))}
          />
          Best seller
        </label>
        <label>
          <input
            type="checkbox"
            checked={flags.isNew}
            onChange={(event) => setFlags((prev) => ({ ...prev, isNew: event.target.checked }))}
          />
          New
        </label>
      </div>
      <Button className="button--primary" type="button" onClick={handleSubmit} disabled={mutation.isPending}>
        {mutation.isPending ? "Saving..." : "Save"}
      </Button>
    </div>
  );
};

export default AdminProductForm;
