import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "../../styles/index.css";

const KitchenList = ({ onAdd, onEdit, refreshKey }) => {
  const { isAdmin, hasPermission } = useAuth();
  const canAccess = isAdmin || hasPermission("kitchen");

  const [kitchens, setKitchens] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchKitchens = async () => {
    try {
      setLoading(true);
      const res = await API.get("/kitchen");
      setKitchens(res.data);
    } catch (err) {
      console.error("Kitchen fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (canAccess) fetchKitchens();
}, [canAccess, refreshKey]);


  if (!canAccess) {
    return (
      <div className="ak-card">
        <h3>Permission Denied</h3>
        <p>You are not allowed to access Kitchen module.</p>
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this kitchen?")) return;
    await API.delete(`/kitchen/${id}`);
    fetchKitchens();
  };

  return (
    <div className="ak-list">
      {(isAdmin || hasPermission("kitchen")) && (
        <button className="ak-add-btn" onClick={onAdd}>
          + Add Kitchen
        </button>
      )}

      {loading && <p>Loading kitchens...</p>}
      {!loading && kitchens.length === 0 && <p>No kitchen data found</p>}

      {!loading &&
        kitchens.map((k) => (
          <div className="ak-item" key={k._id}>
            <img
              src={k.imageUrl}
              alt={k.title}
              onError={(e) =>
                (e.target.src =
                  "https://via.placeholder.com/90x70?text=No+Image")
              }
            />

            <div className="ak-info">
              <h4>{k.title}</h4>
              <p className="ak-desc">{k.description}</p>
            </div>

            {isAdmin && (
              <div className="ak-actions">
                <button
                  className="ak-edit-btn"
                  onClick={() => onEdit(k)}
                >
                  Edit
                </button>

                <button
                  className="ak-delete-btn"
                  onClick={() => handleDelete(k._id)}
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

export default KitchenList;
