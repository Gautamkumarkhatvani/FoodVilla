import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "../../styles/index.css";

const TasteList = ({ onEdit, onAdd,refreshKey }) => {
  const { isAdmin, hasPermission } = useAuth();
  const canAccess = isAdmin || hasPermission("taste");

  const [tastes, setTastes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTastes = async () => {
    try {
      setLoading(true);
      const res = await API.get("/taste");
      setTastes(res.data);
    } catch (err) {
      console.error("Taste fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canAccess) fetchTastes();
  }, [canAccess, refreshKey]);

  if (!canAccess) {
    return (
      <div className="at-card">
        <h3>Permission Denied</h3>
        <p>You are not allowed to access Taste module.</p>
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await API.delete(`/taste/${id}`);
    fetchTastes();
  };

  return (
    <div className="at-list">
      {(isAdmin || hasPermission("taste")) && (
        <button className="at-add-btn" onClick={onAdd}>
          + Add Taste
        </button>
      )}

      {loading && <p>Loading tastes...</p>}
      {!loading && tastes.length === 0 && (
        <p>No taste items found</p>
      )}

      {!loading &&
        tastes.map((t) => (
          <div className="at-item" key={t._id}>
            <img
              src={t.imageUrl}
              alt={t.title}
              onError={(e) =>
                (e.target.src =
                  "https://via.placeholder.com/90x70?text=No+Image")
              }
            />

            <div className="at-info">
              <h4>{t.title}</h4>
              <p className="at-desc">{t.description}</p>
              <p>₹{t.price}</p>
              <small>
                {t.calories} cal | {t.protein}g protein
              </small>
            </div>

            {isAdmin && (
              <div className="at-actions">
                <button
                  className="at-edit-btn"
                  onClick={() => onEdit(t)}
                >
                  Edit
                </button>

                <button
                  className="at-delete-btn"
                  onClick={() => handleDelete(t._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default TasteList;
