import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import API from "../api/axios";
import "../styles/index.css";

const DELIVERY_CHARGE = 40;

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { customer } = useCustomerAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = async () => {
    if (!customer) {
      alert("Please login first");
      return;
    }

    if (
      !form.fullName ||
      !form.mobile ||
      !form.address ||
      !form.city ||
      !form.pincode
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      let latitude = null;
      let longitude = null;

      try {
        const position = await new Promise(
          (resolve, reject) =>
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject
            )
        );

        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      } catch {
        console.log("Location denied");
      }

      await API.post("/orders", {
        email: customer.email,
        ...form,
        latitude,
        longitude,
        items: cart.map((item) => ({
          productId: item._id,
          title: item.title,
          price: item.price,
          qty: item.qty,
        })),
        totalAmount: totalPrice + DELIVERY_CHARGE,
      });

      clearCart();
      alert("Order Confirmed (Cash on Delivery)");
    } catch (err) {
      console.error(err);
      alert("Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (!customer) {
    return (
      <div className="co-login-required">
        <h2>Please login to continue</h2>
      </div>
    );
  }

  return (
    <div className="co-page">
      <h2 className="co-title">Checkout</h2>

      <div className="co-form">
        <input
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
        />
        <input
          name="mobile"
          placeholder="Mobile"
          onChange={handleChange}
        />
        <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
        />
        <input
          name="city"
          placeholder="City"
          onChange={handleChange}
        />
        <input
          name="state"
          placeholder="State"
          onChange={handleChange}
        />
        <input
          name="pincode"
          placeholder="Pincode"
          onChange={handleChange}
        />

        <button
          className="co-submit-btn"
          onClick={placeOrder}
          disabled={loading}
        >
          {loading
            ? "Placing..."
            : "Confirm Order (COD)"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
