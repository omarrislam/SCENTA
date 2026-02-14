import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import {
  createAdminBlogPost,
  deleteAdminBlogPost,
  listAdminBlogPosts,
  updateAdminBlogPost
} from "../../services/adminService";
import { uploadImage } from "../../services/backendApi";
import { useToast } from "../../components/feedback/ToastContext";

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  cover: ""
};

const AdminBlog = () => {
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["admin-blog"], queryFn: listAdminBlogPosts });
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const createMutation = useMutation({
    mutationFn: () => createAdminBlogPost(form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      setForm(emptyForm);
      pushToast("Post published", "success");
    }
  });

  const updateMutation = useMutation({
    mutationFn: () => updateAdminBlogPost(editingId ?? "", form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      setEditingId(null);
      setForm(emptyForm);
      pushToast("Post updated", "success");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminBlogPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      pushToast("Post deleted", "success");
    }
  });

  const handleEdit = (post: (typeof data)[number]) => {
    setEditingId(post.id);
    setForm({
      title: post.title ?? "",
      slug: post.slug ?? "",
      excerpt: post.excerpt ?? "",
      body: post.body ?? "",
      cover: post.cover ?? ""
    });
  };

  const handleCoverUpload = async (file?: File | null) => {
    if (!file) return;
    try {
      setIsUploading(true);
      const imageUrl = await uploadImage(file);
      setForm((prev) => ({ ...prev, cover: imageUrl }));
      pushToast("Cover image uploaded", "success");
    } catch {
      pushToast("Image upload failed", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="admin-grid">
      <h1 className="section-title">Blog</h1>
      <div className="card grid">
        <TextInput
          placeholder="Title"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
        />
        <TextInput
          placeholder="Slug"
          value={form.slug}
          onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
        />
        <TextInput
          placeholder="Excerpt"
          value={form.excerpt}
          onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
        />
        <label className="input-label">
          Cover image
          <input type="file" accept="image/*" onChange={(event) => void handleCoverUpload(event.target.files?.[0])} />
          <TextInput
            placeholder="Cover image URL"
            value={form.cover}
            onChange={(event) => setForm((prev) => ({ ...prev, cover: event.target.value }))}
          />
          <small style={{ color: "var(--color-muted)" }}>
            {isUploading ? "Uploading image..." : "Upload an image or paste a URL."}
          </small>
        </label>
        <textarea
          className="input"
          placeholder="Body"
          value={form.body}
          onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
        />
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {editingId ? (
            <>
              <Button className="button--primary" type="button" onClick={() => updateMutation.mutate()}>
                Save changes
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button className="button--primary" type="button" onClick={() => createMutation.mutate()}>
              Publish post
            </Button>
          )}
        </div>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Slug</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{post.slug}</td>
              <td className="table-actions">
                <Button type="button" onClick={() => handleEdit(post)}>
                  Edit
                </Button>
                <Button type="button" onClick={() => deleteMutation.mutate(post.id)}>
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

export default AdminBlog;
