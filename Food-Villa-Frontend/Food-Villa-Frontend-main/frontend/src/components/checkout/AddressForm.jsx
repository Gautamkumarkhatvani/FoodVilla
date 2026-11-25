import { useState } from "react";
import "../../styles/index.css";

const AddressForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  /* 🔒 INPUT HANDLERS */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 👉 Only letters + space
    if (["fullName", "city", "state"].includes(name)) {
      if (!/^[a-zA-Z\s]*$/.test(value)) return;
    }

    // 👉 Mobile: only numbers, max 10 digits
    if (name === "mobile") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    // 👉 Pincode: only numbers, max 6 digits
    if (name === "pincode") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 6) return;
    }

    setForm({ ...form, [name]: value });
  };

  /* ✅ SUBMIT */
  const handleSubmit = async () => {
    const { fullName, mobile, address, city, pincode } = form;

    if (!fullName || !mobile || !address || !city || !pincode) {
      alert("Please fill all required fields");
      return;
    }

    if (mobile.length !== 10) {
      alert("Mobile number must be exactly 10 digits");
      return;
    }

    if (pincode.length !== 6) {
      alert("Pincode must be 6 digits");
      return;
    }

    let latitude = null;
    let longitude = null;

    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    } catch {
      console.log("Location denied");
    }

    onSubmit({ ...form, latitude, longitude });
  };

  return (
    <div className="ckm-af-form">
      <h3 className="ckm-af-title">Delivery Details</h3>

      <input
        name="fullName"
        placeholder="Full Name"
        value={form.fullName}
        onChange={handleChange}
      />

      <input
        name="mobile"
        placeholder="Mobile Number"
        value={form.mobile}
        onChange={handleChange}
        inputMode="numeric"
      />

      <input
        name="address"
        placeholder="Full Address"
        value={form.address}
        onChange={handleChange}
      />

      <input
        name="city"
        placeholder="City"
        value={form.city}
        onChange={handleChange}
      />

      <input
        name="state"
        placeholder="State"
        value={form.state}
        onChange={handleChange}
      />

      <input
        name="pincode"
        placeholder="Pincode"
        value={form.pincode}
        onChange={handleChange}
        inputMode="numeric"
      />

      <button
        className="ckm-primary-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Placing..." : "Confirm Order (COD)"}
      </button>
    </div>
  );
};

export default AddressForm;