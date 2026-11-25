import { useEffect, useState } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

const ImageGrid = () => {
  const [images, setImages] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    imageName: "",
    description: ""
  });

  const { user } = useAuth();

  const fetchImages = async () => {
    const res = await API.get("/images");
    setImages(res.data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const canUpdate = user?.role === "admin" || user?.permissions?.update;
  const canDelete = user?.role === "admin" || user?.permissions?.delete;

  const deleteImage = async (id) => {
    if (!window.confirm("Delete image?")) return;
    await API.delete(`/images/${id}`);
    fetchImages();
  };

  // UPDATE START
  const startEdit = (img) => {
    setEditId(img._id);
    setEditData({
      imageName: img.imageName,
      description: img.description
    });
  };

  //  SAVE UPDATE
  const saveUpdate = async (id) => {
    await API.put(`/images/${id}`, editData);
    setEditId(null);
    fetchImages();
  };

  return (
    <div className="image-grid">
      {images.map((img) => (
        <div key={img._id} className="image-card">
          <img
            src={`https://food-villa-backed.onrender.com/api/images/file/${img.fileId}`}
            alt={img.imageName}
          />

          {editId === img._id ? (
            <>
              <input
                type="text"
                value={editData.imageName}
                onChange={(e) =>
                  setEditData({ ...editData, imageName: e.target.value })
                }
              />

              <input
                type="text"
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
              />

              <div className="card-actions">
                <button
                  className="update-btn"
                  onClick={() => saveUpdate(img._id)}
                >
                  Save
                </button>
                <button
                  className="delete-btn"
                  onClick={() => setEditId(null)}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4>{img.imageName}</h4>
                <p>{img.description}</p>
              </div>

              <div className="card-actions">
                {canUpdate && (
                  <button
                    className="update-btn"
                    onClick={() => startEdit(img)}
                  >
                    Update
                  </button>
                )}
                {canDelete && (
                  <button
                    className="delete-btn"
                    onClick={() => deleteImage(img._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
