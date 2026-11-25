import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import API from "../api/axios";

const CustomerAuthContext = createContext(null);

export const CustomerAuthProvider = ({ children }) => {
  /* ================= STATE ================= */
  const [customer, setCustomer] = useState(() => {
    try {
      const stored = localStorage.getItem("customer");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  /* ================= SYNC TOKEN WITH AXIOS ================= */
  useEffect(() => {
    const token = localStorage.getItem("customerToken");

    if (token) {
      API.defaults.headers.common[
        "Customer-Authorization"
      ] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common[
        "Customer-Authorization"
      ];
    }
  }, [customer]);

  /* ================= LOGIN ================= */
  const login = (data) => {
    if (!data) return;

    setCustomer(data);
    localStorage.setItem("customer", JSON.stringify(data));
    localStorage.setItem("customerToken", data.token);
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    try {
      if (customer?.id) {
        await API.post("/customers/logout", {
          customerId: customer.id,
        });
      }
    } catch (err) {
      console.warn("Customer logout failed");
    } finally {
      localStorage.removeItem("customer");
      localStorage.removeItem("customerToken");
      delete API.defaults.headers.common[
        "Customer-Authorization"
      ];
      setCustomer(null);
    }
  };

  /* ================= CONTEXT VALUE ================= */
  const value = {
    customer,
    login,
    logout,
    isLoggedIn: Boolean(customer),
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

/* ================= HOOK ================= */
export const useCustomerAuth = () => {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) {
    throw new Error(
      "useCustomerAuth must be used inside CustomerAuthProvider"
    );
  }
  return ctx;
};
