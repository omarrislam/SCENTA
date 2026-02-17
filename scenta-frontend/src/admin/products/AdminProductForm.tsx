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
import { resolveApiAssetUrl } from "../../services/api";

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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!data) return;
    setTitle(data.title ?? "");
    setSlug(data.slug ?? "");
    setDescription(data.description ?? "");
    const variant = data.variants?.[0];
    setPrice(String(variant?.price ?? 0));
    setStock(String(variant?.stock ?? 0));
    setSizeMl(String(variant?.sizeMl ?? 50));
    const incomingImages =
      data.images
        ?.map((image) => resolveApiAssetUrl(image.url) ?? image.url)
        .filter(Boolean)
      ?? [];
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
      if (id) {
        await queryClient.invalidateQueries({ queryKey: ["admin-product", id] });
      }
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      await queryClient.invalidateQueries({ queryKey: ["products"], exact: false });
      await queryClient.invalidateQueries({ queryKey: ["product"], exact: false });
      localStorage.setItem("scenta-inventory-updated", String(Date.now()));
      window.dispatchEvent(new Event("inventory-updated"));
      pushToast("Product saved", "success");
      navigate("/admin/products");
    }
  });

  const normalizeImageForSave = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("/") || trimmed.startsWith("data:")) {
      return trimmed;
    }
    try {
      const parsed = new URL(trimmed);
      if (parsed.pathname.startsWith("/uploads/") || parsed.pathname.startsWith("/images/")) {
        return `${parsed.pathname}${parsed.search}`;
      }
      return trimmed;
    } catch {
      return trimmed;
    }
  };

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};
    if (!title.trim()) nextErrors.title = "Product name is required.";
    if (!slug.trim()) nextErrors.slug = "Slug is required.";
    if (!description.trim()) nextErrors.description = "Description is required.";
    if (Number.isNaN(Number(price)) || Number(price) <= 0) nextErrors.price = "Price must be greater than 0.";
    if (Number.isNaN(Number(stock)) || Number(stock) < 0) nextErrors.stock = "Stock cannot be negative.";
    if (Number.isNaN(Number(sizeMl)) || Number(sizeMl) <= 0) nextErrors.sizeMl = "Size must be greater than 0.";
    const cleanedImages = images.map(normalizeImageForSave).filter(Boolean);
    if (!cleanedImages.length) nextErrors.images = "Add at least one image URL or upload.";
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      pushToast("Fix the highlighted product fields before saving.", "error");
      return;
    }

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
    <div className="card grid admin-form-layout">
      <h1 className="section-title">{isEditing ? "Edit Product" : "New Product"}</h1>
      <section className="card admin-form-section">
        <h2 className="section-title">Core details</h2>
        <label className="input-label">
          Product name
          <TextInput
            intent={formErrors.title ? "error" : "default"}
            placeholder="Product name"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          {formErrors.title ? <span className="admin-form-error">{formErrors.title}</span> : null}
        </label>
        <label className="input-label">
          Slug
          <TextInput
            intent={formErrors.slug ? "error" : "default"}
            placeholder="Slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
          />
          <span className="admin-form-help">Use lowercase letters and hyphens.</span>
          {formErrors.slug ? <span className="admin-form-error">{formErrors.slug}</span> : null}
        </label>
        <label className="input-label">
          Description
          <textarea
            className={`input ${formErrors.description ? "input--error" : ""}`.trim()}
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          {formErrors.description ? <span className="admin-form-error">{formErrors.description}</span> : null}
        </label>
      </section>

      <section className="card admin-form-section">
        <h2 className="section-title">Pricing and inventory</h2>
        <div className="admin-form-grid-3">
          <label className="input-label">
            Size (ml)
            <TextInput intent={formErrors.sizeMl ? "error" : "default"} value={sizeMl} onChange={(event) => setSizeMl(event.target.value)} />
            {formErrors.sizeMl ? <span className="admin-form-error">{formErrors.sizeMl}</span> : null}
          </label>
          <label className="input-label">
            Price
            <TextInput intent={formErrors.price ? "error" : "default"} value={price} onChange={(event) => setPrice(event.target.value)} />
            {formErrors.price ? <span className="admin-form-error">{formErrors.price}</span> : null}
          </label>
          <label className="input-label">
            Stock
            <TextInput intent={formErrors.stock ? "error" : "default"} value={stock} onChange={(event) => setStock(event.target.value)} />
            {formErrors.stock ? <span className="admin-form-error">{formErrors.stock}</span> : null}
          </label>
        </div>
      </section>

      <section className="card admin-form-section">
        <h2 className="section-title">Media</h2>
        <p className="admin-form-help">Upload product media or paste hosted URLs.</p>
        <div className="grid" style={{ gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <span>Images</span>
            <Button type="button" onClick={handleAddImage}>
              Add image
            </Button>
          </div>
          {formErrors.images ? <p className="admin-form-error">{formErrors.images}</p> : null}
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
      </section>

      <section className="card admin-form-section">
        <h2 className="section-title">Publishing</h2>
        <label className="input-label">
          Notes (comma separated)
          <TextInput placeholder="Notes (comma separated)" value={notes} onChange={(event) => setNotes(event.target.value)} />
        </label>
        <label className="input-label">
          Status
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
        </label>
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
      </section>

      <div className="admin-form-actions">
        <Button
          className="button--primary"
          type="button"
          onClick={handleSubmit}
          disabled={mutation.isPending || uploadingIndex !== null}
        >
          {mutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default AdminProductForm;
