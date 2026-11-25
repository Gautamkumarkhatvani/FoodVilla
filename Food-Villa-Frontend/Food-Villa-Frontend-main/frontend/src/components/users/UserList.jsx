import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "../../styles/index.css";

const UserList = ({refreshKey}) => {
  const { isAdmin } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!isAdmin) {
    return (
      <div className="asu-card">
        <h3>Permission Denied</h3>
        <p>Only admin can manage sub users.</p>
      </div>
    );
  }

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");
      setUsers(res.data || []);
    } catch {
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshKey]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sub user?")) return;
    await API.delete(`/users/${id}`);
    fetchUsers();
  };

  const formatPermissions = (permissions = {}) => {
    const allowed = [];
    if (permissions?.kitchen?.add) allowed.push("Kitchen");
    if (permissions?.taste?.add) allowed.push("Taste");
    if (permissions?.recipe?.add) allowed.push("Recipe");
    if (permissions?.blog?.add) allowed.push("Blog");
    return allowed.length ? allowed.join(", ") : "No access";
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="asu-card">
      <h3>Sub Users</h3>

      {users.length === 0 && <p>No sub users found</p>}

      <div className="asu-list">
        {users.map((u) => (
          <div key={u._id} className="asu-row">
            <div>
              <strong>{u.username}</strong>
              <div className="asu-perm">
                Permissions: {formatPermissions(u.permissions)}
              </div>
            </div>

            <button
              className="asu-delete-btn"
              onClick={() => handleDelete(u._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
