import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "../../styles/index.css";

const RecipeList = ({ onAdd, onEdit, refreshKey }) => {
  const { isAdmin, hasPermission } = useAuth();
  const canAccess = isAdmin || hasPermission("recipe");

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const res = await API.get("/recipe");
      setRecipes(res.data);
    } catch (err) {
      console.error("Recipe fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canAccess) fetchRecipes();
  }, [canAccess,refreshKey]);

  if (!canAccess) {
    return (
      <div className="ar-card">
        <h3>Permission Denied</h3>
        <p>You are not allowed to access Recipe module.</p>
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete recipe?")) return;
    await API.delete(`/recipe/${id}`);
    fetchRecipes();
  };

  return (
    <div className="ar-list">
      {(isAdmin || hasPermission("recipe")) && (
        <button className="ar-add-btn" onClick={onAdd}>
          + Add Recipe
        </button>
      )}

      {loading && <p>Loading recipes...</p>}
      {!loading && recipes.length === 0 && <p>No recipes found</p>}

      {!loading &&
        recipes.map((r) => (
          <div className="ar-item" key={r._id}>
            <img
              src={
                r.imageUrl ||
                "https://via.placeholder.com/90x70?text=No+Image"
              }
              alt={r.title}
            />

            <div className="ar-info">
              <h4>{r.title}</h4>
              <p>{r.description}</p>
            </div>

            {isAdmin && (
              <div className="ar-actions">
                <button
                  className="ar-edit-btn"
                  onClick={() => onEdit(r)}
                >
                  Edit
                </button>

                <button
                  className="ar-delete-btn"
                  onClick={() => handleDelete(r._id)}
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

export default RecipeList;
