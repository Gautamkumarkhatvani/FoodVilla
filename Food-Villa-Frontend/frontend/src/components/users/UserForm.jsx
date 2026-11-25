import { useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "../../styles/index.css";

const UserForm = ({ refresh }) => {
  const { isAdmin } = useAuth();
  if (!isAdmin) return null;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const modules = ["kitchen", "taste", "recipe", "blog"];

  const toggle = (module) => {
    setSelected((prev) =>
      prev.includes(module)
        ? prev.filter((m) => m !== module)
        : [...prev, module]
    );
  };

  const submit = async (e) => {
    e.preventDefault();

    const permissions = {
      kitchen: { add: selected.includes("kitchen") },
      taste: { add: selected.includes("taste") },
      recipe: { add: selected.includes("recipe") },
      blog: { add: selected.includes("blog") },
    };

    try {
      setLoading(true);
      await API.post("/users", {
        username,
        password,
        permissions,
      });

      alert("Sub user created successfully");
      setUsername("");
      setPassword("");
      setSelected([]);
      refresh?.();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to create sub user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="asu-card">
      <h3>Create Sub User</h3>

      <form onSubmit={submit} className="asu-form">
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="asu-permissions">
          {modules.map((m) => (
            <label key={m} className="asu-permission-item">
              <input
                type="checkbox"
                checked={selected.includes(m)}
                onChange={() => toggle(m)}
              />
              <span>{m}</span>
            </label>
          ))}
        </div>

        <button disabled={loading} style={{width:"120px",background:"#2563eb",color:"#ffffff",border:"none",padding:"10px 0",borderRadius:"999px",cursor:"pointer",fontWeight:"500"}}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
