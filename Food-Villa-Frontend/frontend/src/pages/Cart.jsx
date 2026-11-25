import { useState, useMemo, useCallback } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import CheckoutModal from "../components/checkout/CheckoutModal";
import { useCart } from "../context/CartContext";
import "../styles/index.css";

const DELIVERY_CHARGE = 40;
const MAX_QTY = 5;

const Cart = () => {
  const {
    cart,
    totalPrice,
    removeFromCart,
    updateQty,
  } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);

  const finalTotal = useMemo(
    () => totalPrice + DELIVERY_CHARGE,
    [totalPrice]
  );

  const handleIncrease = useCallback(
    (id, qty) => {
      if (qty >= MAX_QTY) return;
      updateQty(id, qty + 1);
    },
    [updateQty]
  );

  const handleDecrease = useCallback(
    (id, qty) => {
      if (qty <= 1) return;
      updateQty(id, qty - 1);
    },
    [updateQty]
  );

  /* EMPTY CART */
  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="cp-empty-wrapper">
          <div className="cp-empty-box">
            <div className="cp-empty-emoji">🛒</div>
            <h2>Your basket is empty</h2>
            <p>Add something delicious to get started!</p>
            <a href="/taste" className="cp-shop-btn">
              Explore Menu
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="cp-page">
        <h2 className="cp-title">My Basket</h2>

        <div className="cp-wrapper">
          {/* LEFT */}
          <div>
            {cart.map((item) => (
              <div className="cp-row" key={item._id}>
                <div className="cp-product">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                  />

                  <div className="cp-info">
                    <h4>{item.title}</h4>

                    <div className="cp-qty">
                      <button
                        className="cp-qty-btn cp-minus"
                        onClick={() =>
                          handleDecrease(
                            item._id,
                            item.qty
                          )
                        }
                        disabled={item.qty <= 1}
                      >
                        −
                      </button>

                      <span className="cp-qty-number">
                        {item.qty}
                      </span>

                      <button
                        className="cp-qty-btn cp-plus"
                        onClick={() =>
                          handleIncrease(
                            item._id,
                            item.qty
                          )
                        }
                        disabled={item.qty >= MAX_QTY}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="cp-right">
                  <div className="cp-price">
                    ₹{item.price * item.qty}
                  </div>

                  <button
                    className="cp-remove"
                    onClick={() =>
                      removeFromCart(item._id)
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="cp-summary">
            <h3>Order Summary</h3>

            <div className="cp-summary-row">
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>

            <div className="cp-summary-row">
              <span>Delivery</span>
              <span>₹{DELIVERY_CHARGE}</span>
            </div>

            <div className="cp-summary-total">
              Total ₹{finalTotal}
            </div>

            <button
              className="cp-checkout-btn"
              onClick={() => setShowCheckout(true)}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
        />
      )}

      <Footer />
    </>
  );
};

export default Cart;
