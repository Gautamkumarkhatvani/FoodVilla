import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const BlogForm = ({ editData = null, onSuccess, onCancel }) => {
  const { isAdmin, hasPermission } = useAuth();

  const canAccess = isAdmin || hasPermission("blog");
  const canEdit = isAdmin;

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [smallImage, setSmallImage] = useState(null);
  const [largeImage, setLargeImage] = useState(null);
  const [loading, setLoading] = useState(false);

  /* FILL FORM FOR EDIT */
  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || "",
        description: editData.description || "",
      });
    } else {
      setForm({ title: "", description: "" });
      setSmallImage(null);
      setLargeImage(null);
    }
  }, [editData]);

  /* ACCESS CHECK */
  if (!canAccess) {
    return (
      <div className="ad-card">
        <h3>Permission Denied</h3>
        <p>You are not allowed to access Blog module.</p>
      </div>
    );
  }

  /* EDIT BLOCK */
  if (editData && !canEdit) {
    return (
      <div className="ad-card">
        <h3>Permission Denied</h3>
        <p>Only admin can edit blogs.</p>
        <button onClick={onCancel}>Back</button>
      </div>
    );
  }

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editData && (!smallImage || !largeImage)) {
      alert("Both images are required");
      return;
    }

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      if (smallImage) fd.append("smallImage", smallImage);
      if (largeImage) fd.append("largeImage", largeImage);

      if (editData) {
        await API.put(`/blog/${editData._id}`, fd);
      } else {
        await API.post("/blog", fd);
      }

      onSuccess?.();
    } catch (err) {
      console.error("Blog save error:", err);
      alert("Save blog failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ad-card">
      <h3>{editData ? "Edit Blog (Admin)" : "Add Blog"}</h3>

      <form className="ad-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Blog title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          required
        />

        <textarea
          placeholder="Blog description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          required
        />

        <div className="ad-file-group">
          <label className="ad-file-label">
            Small Image
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setSmallImage(e.target.files[0])
              }
            />
          </label>

          <label className="ad-file-label">
            Large Image
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setLargeImage(e.target.files[0])
              }
            />
          </label>
        </div>

        <div className="ad-form-actions">
          <button disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>

          {editData && (
            <button
              type="button"
              className="edit-btn"
              onClick={onCancel}
              style={{background:"#2563eb"}}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
