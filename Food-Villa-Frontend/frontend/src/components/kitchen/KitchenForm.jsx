import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "../../styles/index.css";

const KitchenForm = ({ editData = null, onSuccess, onCancel }) => {
  const { isAdmin, hasPermission } = useAuth();
  const canAccess = isAdmin || hasPermission("kitchen");
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
      <div className="ak-card">
        <h3>Permission Denied</h3>
        <p>You are not allowed to access Kitchen module.</p>
      </div>
    );
  }

  if (editData && !canEdit) {
    return (
      <div className="ak-card">
        <h3>Permission Denied</h3>
        <p>Only admin can edit kitchen items.</p>
        <button className="ak-edit-btn" onClick={onCancel}>
          Back
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editData && !image) {
      alert("Image is required");
      return;
    }

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      if (image) fd.append("image", image);

      editData
        ? await API.put(`/kitchen/${editData._id}`, fd)
        : await API.post("/kitchen", fd);

      onSuccess?.();
    } catch (err) {
      console.error("Kitchen save error:", err);
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ak-card">
      <h3>{editData ? "Edit Kitchen (Admin)" : "Add Kitchen"}</h3>

      <form className="ak-form" onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          required
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <div className="ak-form-actions">
          <button disabled={loading}style={{width:"120px",background:"#ff6624",color:"#ffffff",border:"none",padding:"10px 0",borderRadius:"999px",cursor:"pointer",fontWeight:"500"}}>
            {loading ? "Saving..." : "Save"}
          </button>

          {editData && (
            <button
              type="button"
              className="ak-edit-btn"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default KitchenForm;
