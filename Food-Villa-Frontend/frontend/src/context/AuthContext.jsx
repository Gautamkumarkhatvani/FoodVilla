import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import API from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  /* STATE */
  const [token, setToken] = useState(() =>
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(true);

  /* AXIOS AUTH HEADER */
  useEffect(() => {
    if (token) {
      API.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common.Authorization;
    }

    //allow app render only after header set
    setLoading(false);
  }, [token]);

  /* LOGIN */
  const login = async (username, password) => {
    const res = await API.post("/auth/login", {
      username,
      password,
    });

    const safeUser = {
      username: res.data.user.username,
      role: res.data.user.role, // admin | subuser
      permissions: res.data.user.permissions || {},
    };

    setToken(res.data.token);
    setUser(safeUser);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(safeUser));
  };

  /* LOGOUT  */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete API.defaults.headers.common.Authorization;
  };

  /* ROLE & PERMISSIONS  */
  const isAdmin = user?.role === "admin";

  const hasPermission = (module) => {
    if (isAdmin) return true;
    return Boolean(user?.permissions?.[module]?.add);
  };

  // alias (used across UI)
  const canAdd = (module) => hasPermission(module);

  /*  CONTEXT VALUE */
  const value = {
    token,
    user,
    login,
    logout,
    isAdmin,
    hasPermission,
    canAdd,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/* HOOK  */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }
  return ctx;
};
