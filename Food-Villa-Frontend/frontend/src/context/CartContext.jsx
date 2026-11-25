import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext();

const MAX_QTY = 5;
const MIN_QTY = 1;

export const CartProvider = ({ children }) => {
  /* ================= SAFE INIT ================= */
  const [cart, setCart] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("cart"));
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  /* ================= ADD TO CART ================= */
  const addToCart = (product) => {
    if (!product?._id) return;

    setCart((prev) => {
      const exists = prev.find((item) => item._id === product._id);

      if (exists) {
        const newQty = Math.min(exists.qty + 1, MAX_QTY);
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, qty: newQty }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          price: Number(product.price) || 0,
          qty: 1,
        },
      ];
    });
  };

  /* ================= UPDATE QTY ================= */
  const updateQty = (id, qty) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item._id !== id) return item;

        const safeQty = Math.max(
          MIN_QTY,
          Math.min(qty, MAX_QTY)
        );

        return { ...item, qty: safeQty };
      })
    );
  };

  /* ================= REMOVE ================= */
  const removeFromCart = (id) => {
    setCart((prev) =>
      prev.filter((item) => item._id !== id)
    );
  };

  /* ================= CLEAR ================= */
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  /* ================= TOTAL ================= */
  const totalPrice = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum + Number(item.price) * Number(item.qty),
      0
    );
  }, [cart]);

  /* ================= SYNC STORAGE ================= */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* ================= OPTIMIZED CONTEXT VALUE ================= */
  const value = useMemo(
    () => ({
      cart,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      totalPrice,
    }),
    [cart, totalPrice]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
