import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "../../styles/index.css";

const TasteForm = ({ editData = null, onSuccess, onCancel }) => {
  const { isAdmin, hasPermission } = useAuth();

  const canAccess = isAdmin || hasPermission("taste");
  const canEdit = isAdmin;

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    calories: "",
    protein: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || "",
        description: editData.description || "",
        price: editData.price || "",
        calories: editData.calories || "",
        protein: editData.protein || "",
      });
    } else {
      setForm({
        title: "",
        description: "",
        price: "",
        calories: "",
        protein: "",
      });
      setImage(null);
    }
  }, [editData]);

  if (!canAccess) {
    return (
      <div className="at-card">
        <h3>Permission Denied</h3>
        <p>You are not allowed to access Taste module.</p>
      </div>
    );
  }

  if (editData && !canEdit) {
    return (
      <div className="at-card">
        <h3>Permission Denied</h3>
        <p>Only admin can edit taste items.</p>
        <button className="at-edit-btn" onClick={onCancel}>
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
      fd.append("price", Number(form.price));
      fd.append("calories", Number(form.calories));
      fd.append("protein", Number(form.protein));
      if (image) fd.append("image", image);

      editData
        ? await API.put(`/taste/${editData._id}`, fd)
        : await API.post("/taste", fd);

      onSuccess?.();
    } catch (err) {
      console.error("Taste save error:", err);
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="at-card">
      <h3>{editData ? "Edit Taste (Admin)" : "Add Taste"}</h3>

      <form className="at-form" onSubmit={handleSubmit}>
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
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
          required
        />

        <input
          type="number"
          placeholder="Calories"
          value={form.calories}
          onChange={(e) =>
            setForm({ ...form, calories: e.target.value })
          }
          required
        />

        <input
          type="number"
          placeholder="Protein"
          value={form.protein}
          onChange={(e) =>
            setForm({ ...form, protein: e.target.value })
          }
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <div className="at-form-actions">
          <button disabled={loading}  style={{width:"120px",background:"#ff6624",color:"#ffffff",border:"none",padding:"10px 0",borderRadius:"999px",cursor:"pointer",fontWeight:"500"}}>
            {loading ? "Saving..." : "Save"}
          </button>

          {editData && (
            <button
              type="button"
              className="at-edit-btn"
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

export default TasteForm;
