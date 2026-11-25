import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "../../styles/index.css";

const BlogList = ({ onAdd, onEdit, refreshKey }) => {
  const { isAdmin, hasPermission } = useAuth();

  const canAccess = isAdmin || hasPermission("blog");

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/blog");
      setBlogs(res.data);
    } catch (err) {
      console.error("Blog fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canAccess) {
      fetchBlogs();
    }
  }, [canAccess, refreshKey]);

  if (!canAccess) {
    return (
      <div className="abl-no-access-card">
        <h3>Permission Denied</h3>
        <p>You are not allowed to access Blog module.</p>
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      await API.delete(`/blog/${id}`);
      fetchBlogs();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="abl-list">
      {(isAdmin || hasPermission("blog")) && (
        <button className="abl-add-btn" onClick={onAdd}>
          + Add Blog
        </button>
      )}

      {loading && <p>Loading blogs...</p>}

      {!loading && blogs.length === 0 && <p>No blogs found</p>}

      {!loading &&
        blogs.map((b) => (
          <div key={b._id} className="abl-card">
            <img
              src={
                b.smallImage ||
                "https://via.placeholder.com/120x80?text=No+Image"
              }
              alt={b.title}
              className="abl-thumb"
            />

            <div className="abl-content">
              <h4 className="abl-title">{b.title}</h4>
              <p className="abl-desc">
                {b.description.length > 150
                  ? b.description.slice(0, 150) + "..."
                  : b.description}
              </p>
            </div>

            {isAdmin && (
              <div className="abl-actions">
                <button
                  className="abl-edit-btn"
                  onClick={() => onEdit(b)}
                >
                  Edit
                </button>

                <button
                  className="abl-delete-btn"
                  onClick={() => handleDelete(b._id)}
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

export default BlogList;
