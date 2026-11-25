import { useState } from "react";
import OtpModal from "./OtpModal";
import AddressForm from "./AddressForm";
import API from "../../api/axios";
import { useCart } from "../../context/CartContext";
import "../../styles/index.css";

const DELIVERY_CHARGE = 40;

const CheckoutModal = ({ onClose }) => {
  const { cart, totalPrice, clearCart } = useCart();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  const placeOrder = async (addressData) => {
    try {
      setLoading(true);

      await API.post("/orders", {
        email: customer.email,
        fullName: addressData.fullName,
        mobile: addressData.mobile,
        address: addressData.address,
        city: addressData.city,
        state: addressData.state,
        pincode: addressData.pincode,
        latitude: addressData.latitude,
        longitude: addressData.longitude,
        items: cart.map((item) => ({
          productId: item._id,
          title: item.title,
          price: item.price,
          qty: item.qty,
        })),
        totalAmount: totalPrice + DELIVERY_CHARGE,
      });

      clearCart();
      alert("Order Confirmed (COD)");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ckm-overlay">
      <div className="ckm-modal">
        <button className="ckm-close-btn" onClick={onClose}>
          ✕
        </button>

        {!customer ? (
          <OtpModal onVerified={setCustomer} />
        ) : (
          <AddressForm onSubmit={placeOrder} loading={loading} />
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
