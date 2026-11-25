import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import API from "../api/axios";
import { useCart } from "../context/CartContext";
import "../styles/index.css";

const MAX_QTY = 5;

const Taste = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("");

  const { cart, addToCart, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    fetchTaste();
  }, [sort]);

  const fetchTaste = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/taste?sort=${sort}`);

      setItems(
        res.data.map((i) => ({
          id: i._id,
          name: i.title,
          image: i.imageUrl,
          price: i.price,
          kcal: i.calories,
          protein: i.protein,
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getQty = (id) =>
    cart.find((c) => c._id === id)?.qty || 0;

  return (
    <>
      <Navbar />

      <section className="taste-page">
        <div className="taste-top">
          <h2 className="taste-title">Our Taste Menu</h2>

          <div className="taste-controls">
            <select
              className="taste-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="high">Price High → Low</option>
              <option value="low">Price Low → High</option>
            </select>

            <div className="taste-cart" onClick={() => navigate("/cart")}>
              🛒
              {totalItems > 0 && (
                <span className="taste-cart-badge">{totalItems}</span>
              )}
            </div>
          </div>
        </div>

        {loading && <p className="center-text">Loading...</p>}

        <div className="taste-grid">
          {!loading &&
            items.map((item) => {
              const qty = getQty(item.id);

              return (
                <div className="taste-card" key={item.id}>
                  <img src={item.image} alt={item.name} />

                  <h3 className="taste-name">{item.name}</h3>
                  <p className="taste-price">₹{item.price}</p>
                  <small className="taste-meta">
                    {item.kcal} kcal • {item.protein}g protein
                  </small>

                  {qty === 0 ? (
                    <button
                      className="taste-add-btn"
                      onClick={() =>
                        addToCart({
                          _id: item.id,
                          title: item.name,
                          imageUrl: item.image,
                          price: item.price,
                        })
                      }
                    >
                      QUICK ADD
                    </button>
                  ) : (
                    <div className="taste-qty-box">
                      <button
                        onClick={() =>
                          qty === 1
                            ? removeFromCart(item.id)
                            : updateQty(item.id, qty - 1)
                        }
                      >
                        −
                      </button>

                      <span>{qty}</span>

                      <button
                        onClick={() =>
                          qty < MAX_QTY &&
                          updateQty(item.id, qty + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Taste;