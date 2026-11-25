import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "../../styles/index.css";

const RecipeForm = ({ editData = null, onSuccess, onCancel }) => {
  const { isAdmin, hasPermission } = useAuth();
  const canAccess = isAdmin || hasPermission("recipe");
  const canEdit = isAdmin;

  const [form, setForm] = useState({ title: "", description: "" });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || "",
        description: editData.description || "",
      });
    } else {
      setForm({ title: "", description: "" });
      setImage(null);
    }
  }, [editData]);

  if (!canAccess) {
    return (
      <div className="ar-card">
        <h3>Permission Denied</h3>
        <p>You are not allowed to access Recipe module.</p>
      </div>
    );
  }

  if (editData && !canEdit) {
    return (
      <div className="ar-card">
        <h3>Permission Denied</h3>
        <p>Only admin can edit recipes.</p>
        <button className="ar-edit-btn" onClick={onCancel}>
          Back
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      if (image) fd.append("image", image);

      editData
        ? await API.put(`/recipe/${editData._id}`, fd)
        : await API.post("/recipe", fd);

      onSuccess?.();
    } catch (err) {
      console.error("Recipe save error:", err);
      alert("Save recipe failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ar-card">
      <h3>{editData ? "Edit Recipe (Admin)" : "Add Recipe"}</h3>

      <form onSubmit={handleSubmit}>
        <div className="ar-form-grid">
          <input
            placeholder="Recipe title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            required
          />

          <textarea
            placeholder="Recipe description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            required
          />
        </div>

        <div className="ar-form-actions">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>

          {editData && (
            <button
              type="button"
              className="ar-edit-btn"
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

export default RecipeForm;
